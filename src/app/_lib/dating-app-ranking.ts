/**
 * /dating-app-ranking 데이터. App Store 공개 API 두 개만 쓴다.
 * - 평점·평가 수·앱 이름: iTunes lookup (country=kr)
 * - 오늘 순위: App Store 한국 소셜 네트워킹(6005) 무료 차트 상위 100 RSS
 * Google Play 는 공개 API 가 없어 싣지 않는다(페이지에 그렇게 밝힌다).
 *
 * "대학생 앱" 은 우리가 정하지 않는다. 앱 이름(App Store 표시명)에 "대학생"을 내건 앱만 그렇게 본다.
 * 값이 없거나 모양이 다르면 대체값 없이 던진다. ISR 이 실패하면 이전 페이지가 남는다.
 */

export const SOMETIME_APP_ID = "6746120889";

/** 비교 대상. 순서는 의미 없다(화면은 오늘 순위로 정렬한다). */
export const RANKING_APP_IDS = [
  SOMETIME_APP_ID,
  "1661759931", // 연픽
  "6444236865", // 클럽트웬티
  "1261209014", // 위피
  "1058232900", // 글램
  "1191259452", // 스카이피플
] as const;

const SOCIAL_CHART_URL = "https://itunes.apple.com/kr/rss/topfreeapplications/limit=100/genre=6005/json";
const LOOKUP_URL = `https://itunes.apple.com/lookup?country=kr&id=${RANKING_APP_IDS.join(",")}`;
export const CHART_SIZE = 100;
const REVALIDATE_SECONDS = 6 * 3600;

export type RankedApp = {
  id: string;
  /** App Store 표시명 앞부분(“연픽 - 대학생 소개팅, 미팅” → “연픽”) */
  name: string;
  /** 표시명 뒷부분, 앱이 스스로 내건 한 줄. 없으면 null */
  tagline: string | null;
  isCollege: boolean;
  rating: number;
  ratingCount: number;
  /** 소셜 네트워킹 무료 차트 순위. 상위 100 밖이면 null */
  chartRank: number | null;
  storeUrl: string;
};

export type RankingSnapshot = {
  apps: RankedApp[];
  /** 오늘 차트 상위 100 전체에서 이름에 "대학생"을 내건 앱 중 가장 높은 앱. 없으면 null */
  collegeLeader: ChartEntry | null;
  checkedAt: string;
};

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

export function splitTrackName(trackName: string): { name: string; tagline: string | null } {
  const m = trackName.match(/^(.+?)\s*(?:\s-\s|:\s|\s—\s)\s*(.+)$/);
  if (!m) return { name: trackName.trim(), tagline: null };
  return { name: m[1].replace(/\(.+\)$/, "").trim(), tagline: m[2].trim() };
}

export function parseLookup(payload: unknown): Map<string, Omit<RankedApp, "chartRank">> {
  if (!isRecord(payload) || !Array.isArray(payload.results)) {
    throw new Error("dating-app-ranking: lookup results 가 없다");
  }
  const byId = new Map<string, Omit<RankedApp, "chartRank">>();
  for (const r of payload.results) {
    if (!isRecord(r)) continue;
    const id = String(r.trackId ?? "");
    if (
      !id ||
      typeof r.trackName !== "string" ||
      !Number.isFinite(r.averageUserRating) ||
      !Number.isInteger(r.userRatingCount) ||
      typeof r.trackViewUrl !== "string"
    ) {
      throw new Error(`dating-app-ranking: lookup ${id || "?"} 형식이 올바르지 않다`);
    }
    const { name, tagline } = splitTrackName(r.trackName);
    byId.set(id, {
      id,
      name,
      tagline,
      isCollege: r.trackName.includes("대학생"),
      rating: r.averageUserRating as number,
      ratingCount: r.userRatingCount as number,
      storeUrl: r.trackViewUrl.split("?")[0],
    });
  }
  const missing = RANKING_APP_IDS.filter((id) => !byId.has(id));
  if (missing.length) throw new Error(`dating-app-ranking: lookup 에 없는 앱 ${missing.join(",")}`);
  return byId;
}

export type ChartEntry = { id: string; name: string; rank: number };

/** RSS 를 순서대로. 1위가 [0]. */
export function parseChart(payload: unknown): ChartEntry[] {
  const entries = isRecord(payload) && isRecord(payload.feed) ? payload.feed.entry : null;
  if (!Array.isArray(entries) || entries.length < 10) {
    throw new Error("dating-app-ranking: 소셜 차트 RSS 가 비었거나 짧다");
  }
  return entries.map((e, i) => {
    const id = isRecord(e) && isRecord(e.id) && isRecord(e.id.attributes) ? e.id.attributes["im:id"] : null;
    const name = isRecord(e) && isRecord(e["im:name"]) ? e["im:name"].label : null;
    if (typeof id !== "string" || typeof name !== "string") {
      throw new Error(`dating-app-ranking: 차트 ${i + 1}위 id·이름이 없다`);
    }
    return { id, name, rank: i + 1 };
  });
}

/** 순위 있는 앱이 앞, 그 안에서는 순위 순. 100위 밖은 평가 수가 많은 순. */
export function buildSnapshot(
  lookup: Map<string, Omit<RankedApp, "chartRank">>,
  chart: ChartEntry[],
  checkedAt: string,
): RankingSnapshot {
  const apps = RANKING_APP_IDS.map((id) => {
    const hit = chart.find((c) => c.id === id);
    return { ...lookup.get(id)!, chartRank: hit ? hit.rank : null };
  }).sort((a, b) => {
    if (a.chartRank !== null && b.chartRank !== null) return a.chartRank - b.chartRank;
    if (a.chartRank !== null) return -1;
    if (b.chartRank !== null) return 1;
    return b.ratingCount - a.ratingCount;
  });
  const collegeLeader = chart.find((c) => c.name.includes("대학생")) ?? null;
  return { apps, collegeLeader, checkedAt };
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS }, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`dating-app-ranking: ${url} 가 ${res.status} 를 돌려줬다`);
  return res.json();
}

export async function getRankingSnapshot(now = new Date()): Promise<RankingSnapshot> {
  const [lookup, chart] = await Promise.all([fetchJson(LOOKUP_URL), fetchJson(SOCIAL_CHART_URL)]);
  return buildSnapshot(parseLookup(lookup), parseChart(chart), now.toISOString());
}

export function formatKstDate(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
  return `${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;
}

export const formatCount = (n: number) => n.toLocaleString("ko-KR");
