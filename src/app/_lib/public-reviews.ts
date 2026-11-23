const API_BASE_URL =
  process.env.SOMETIME_PUBLIC_CONTENT_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.some-in-univ.com/api";

/** 서버 /public-reviews 는 요청 한 번에 100개까지 준다. */
const STORE_REVIEW_LIMIT = 100;
/** "ㅎㅎㅎㅎ" 같은 한 줄은 후기로 읽히지 않는다. 앱 커뮤니티 후기 칸과 달리 공개 웹에서는 거른다. */
const COUPLE_REVIEW_MIN_LENGTH = 10;
const REVALIDATE_SECONDS = 3600;

export const STORE_LABELS = { APP_STORE: "App Store", PLAY_STORE: "Google Play" } as const;

type StoreSource = keyof typeof STORE_LABELS;

export type StoreRating = { average: number; count: number };

export type ReviewSummary = {
  appStore: StoreRating;
  playStore: StoreRating;
  keywords: { key: string; label: string; count: number }[];
  keywordBase: number;
  foundPartnerCount: number | null;
};

export type StoreReview = {
  id: string;
  source: StoreSource;
  rating: number;
  title: string | null;
  body: string;
  createdAt: string;
};

export type CoupleReview = {
  id: string;
  body: string;
  authorUniversity: string;
  partnerUniversity: string;
};

export type PublicReviewsPage = {
  summary: ReviewSummary;
  coupleReviews: CoupleReview[];
  storeReviews: StoreReview[];
};

/** 가시 평점 요약(App Store + Google Play)과 일치하는 가중 평균 AggregateRating 을 계산한다. */
export function buildReviewsAggregateRating(
  summary: ReviewSummary,
): { ratingValue: number; ratingCount: number } | undefined {
  const stores = [summary.appStore, summary.playStore].filter(
    (s) => s.count > 0 && Number.isFinite(s.average) && s.average > 0,
  );
  const ratingCount = stores.reduce((sum, s) => sum + s.count, 0);
  if (ratingCount <= 0) return undefined;
  const weighted =
    stores.reduce((sum, s) => sum + s.average * s.count, 0) / ratingCount;
  return {
    ratingValue: Math.round(weighted * 100) / 100,
    ratingCount,
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** 서버 응답은 { data: ... } 로 감싸져 오기도 한다. */
const unwrap = (payload: unknown): unknown =>
  isRecord(payload) && "data" in payload ? payload.data : payload;

function parseStoreRating(value: unknown, name: string): StoreRating {
  if (!isRecord(value) || !Number.isFinite(value.average) || !Number.isInteger(value.count)) {
    throw new Error(`public-reviews: summary.stores.${name} 가 올바르지 않다`);
  }
  return { average: value.average as number, count: value.count as number };
}

/** 값이 없거나 모양이 다르면 대체값 없이 던진다. 빌드가 실패하면 이전 배포가 유지된다. */
export function parseReviewSummary(payload: unknown): ReviewSummary {
  const body = unwrap(payload);
  if (!isRecord(body) || !isRecord(body.stores)) {
    throw new Error("public-reviews: summary.stores 가 없다");
  }
  const keywords = Array.isArray(body.keywords) ? body.keywords : [];
  keywords.forEach((keyword, index) => {
    const valid =
      isRecord(keyword) &&
      typeof keyword.key === "string" &&
      typeof keyword.label === "string" &&
      Number.isInteger(keyword.count);
    if (!valid) throw new Error(`public-reviews: summary.keywords[${index}] 형식이 올바르지 않다`);
  });
  const foundPartner = isRecord(body.foundPartner) ? body.foundPartner.count : null;

  return {
    appStore: parseStoreRating(body.stores.appStore, "appStore"),
    playStore: parseStoreRating(body.stores.playStore, "playStore"),
    keywords: keywords as ReviewSummary["keywords"],
    keywordBase: Number.isInteger(body.keywordBase) ? (body.keywordBase as number) : 0,
    // 앱 신뢰 사다리와 같은 규칙: 없거나 0이면 그 줄을 그리지 않는다(sometimes-app review-ladder.ts).
    foundPartnerCount:
      typeof foundPartner === "number" && Number.isInteger(foundPartner) && foundPartner > 0
        ? foundPartner
        : null,
  };
}

function parseItems(payload: unknown, label: string): Record<string, unknown>[] {
  const body = unwrap(payload);
  if (!isRecord(body) || !Array.isArray(body.items)) {
    throw new Error(`public-reviews: ${label} items 가 없다`);
  }
  return body.items.filter(isRecord);
}

/** store_review 목록에는 커뮤니티 후기도 섞인다. 작성자 이름이 있는 글은 공개 웹 색인에 올리지 않고 스토어 후기만 쓴다. */
export function parseStoreReviews(payload: unknown): StoreReview[] {
  const reviews = parseItems(payload, "store_review")
    .filter((item) => Object.hasOwn(STORE_LABELS, item.source as string))
    .map((item, index) => {
      if (
        typeof item.id !== "string" ||
        !Number.isFinite(item.rating) ||
        typeof item.body !== "string" ||
        item.body.trim() === "" ||
        typeof item.createdAt !== "string"
      ) {
        throw new Error(`public-reviews: store_review[${index}] 형식이 올바르지 않다`);
      }
      return {
        id: item.id,
        source: item.source as StoreSource,
        rating: item.rating as number,
        title: typeof item.title === "string" && item.title.trim() !== "" ? item.title : null,
        body: item.body.trim(),
        createdAt: item.createdAt,
      };
    });
  if (reviews.length < 1) throw new Error("public-reviews: 스토어 후기가 비어 있다");
  return reviews;
}

const universityName = (value: unknown): string | null =>
  isRecord(value) && typeof value.name === "string" && value.name.trim() !== ""
    ? value.name
    : null;

/** 두 학교 이름이 다 있는 후기만 쓴다. 학교를 모르면 "어디서 만났는지"를 보여 줄 수 없어 뺀다. */
export function parseCoupleReviews(payload: unknown): CoupleReview[] {
  return parseItems(payload, "couple").flatMap((item) => {
    const body = typeof item.body === "string" ? item.body.trim() : "";
    const authorUniversity = universityName(isRecord(item.author) ? item.author.university : null);
    const partnerUniversity = universityName(item.partnerUniversity);
    if (
      typeof item.id !== "string" ||
      body.length < COUPLE_REVIEW_MIN_LENGTH ||
      !authorUniversity ||
      !partnerUniversity
    ) {
      return [];
    }
    return [{ id: item.id, body, authorUniversity, partnerUniversity }];
  });
}

async function fetchJson(path: string): Promise<unknown> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json", "X-Country": "kr" },
  });
  if (!response.ok) throw new Error(`public-reviews: ${url} 가 ${response.status} 를 돌려줬다`);
  return response.json();
}

export async function getPublicReviewsPage(): Promise<PublicReviewsPage> {
  const [summary, couple, store] = await Promise.all([
    fetchJson("/public-reviews/summary"),
    fetchJson("/public-reviews?type=couple&limit=20"),
    fetchJson(`/public-reviews?type=store_review&limit=${STORE_REVIEW_LIMIT}`),
  ]);
  return {
    summary: parseReviewSummary(summary),
    coupleReviews: parseCoupleReviews(couple),
    storeReviews: parseStoreReviews(store),
  };
}

const formatCount = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function formatStoreRatingLine(summary: ReviewSummary): string {
  const { appStore, playStore } = summary;
  return `App Store ${appStore.average.toFixed(1)}점(${formatCount(appStore.count)}개), Google Play ${playStore.average.toFixed(1)}점(${formatCount(playStore.count)}개)`;
}

/** 앱 커뮤니티 후기 칸 머리 문구와 같은 문장이다(sometimes-app found-partner-count.tsx). */
export function formatFoundPartnerLine(count: number): string {
  return `2025년 5월부터 지금까지 ${formatCount(count)}명이 썸타임에서 인연을 찾아 떠났어요`;
}

export function formatStoreReviewMeta(review: StoreReview): string {
  return `${STORE_LABELS[review.source]} · 평점 ${review.rating} · ${review.createdAt.slice(0, 10)}`;
}
