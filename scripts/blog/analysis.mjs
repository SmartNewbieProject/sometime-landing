// 키워드 레이더·성과 판정의 순수 함수. 네트워크 없음(스크립트가 데이터를 가져와 넘긴다).
import fs from 'node:fs';
import { jaccard, rules, violatesErrorClaim } from './lib.mjs';

export const pageKind = (url) => {
  let p = url;
  try {
    p = decodeURIComponent(new URL(url).pathname);
  } catch {
    /* 해석 못 하면 원문 비교 */
  }
  if (p === '/' || p === '') return 'home';
  if (p.startsWith('/blog/')) return 'blog';
  if (p.startsWith('/card-news/')) return 'card-news';
  if (p === '/jp' || p.startsWith('/jp/')) return 'jp';
  return 'other';
};

/** 같은 검색 의도로 보이는 검색어를 묶는다(2글자 쌍 유사도). 대표는 노출이 가장 큰 검색어. */
export function buildClusters(rows) {
  const byQuery = new Map();
  for (const r of rows) {
    const q = byQuery.get(r.query) ?? { query: r.query, impressions: 0, clicks: 0, posW: 0, pages: new Map() };
    q.impressions += r.impressions;
    q.clicks += r.clicks;
    q.posW += r.position * r.impressions;
    q.pages.set(r.page, (q.pages.get(r.page) ?? 0) + r.impressions);
    byQuery.set(r.query, q);
  }
  const sorted = [...byQuery.values()].sort((a, b) => b.impressions - a.impressions);
  const clusters = [];
  for (const q of sorted) {
    const home = clusters.find((c) => jaccard(c.rep, q.query) >= rules.radar.clusterSimilarity);
    if (home) home.members.push(q);
    else clusters.push({ rep: q.query, members: [q] });
  }
  return clusters.map((c) => {
    const imp = c.members.reduce((s, m) => s + m.impressions, 0);
    const clicks = c.members.reduce((s, m) => s + m.clicks, 0);
    const posW = c.members.reduce((s, m) => s + m.posW, 0);
    const pages = new Map();
    for (const m of c.members) for (const [p, i] of m.pages) pages.set(p, (pages.get(p) ?? 0) + i);
    const [topPage] = [...pages.entries()].sort((a, b) => b[1] - a[1])[0];
    return { rep: c.rep, queries: c.members.length, impressions: imp, clicks, ctr: imp ? clicks / imp : 0, position: imp ? posW / imp : 0, topPage, kind: pageKind(topPage) };
  });
}

// 지도 항목이 검색어를 '가린다'고 보는 기준: 검색어가 항목 키워드를 포함하거나 거의 같을 때만(좁은 항목이 넓은 헤드 검색어를 삼키지 않게).
const COVER_SIMILARITY = 0.75;
const isCovered = (cluster, map) =>
  map.entries.find((e) => e.status !== 'rejected' && [e.keyword, ...(e.keywords ?? [])].some((k) => cluster.rep.includes(k) || jaccard(k, cluster.rep) >= COVER_SIMILARITY));

/** improve: 이미 페이지가 있는데 CTR 이 낮은 군집(제목·설명 보강). create: 노출은 있는데 전용 글이 없는 군집(신규). */
export function buildRadar(rows, map) {
  const t = rules.radar;
  const brand = new RegExp(t.brand, 'i');
  const improve = [];
  const create = [];
  const covered = [];
  for (const c of buildClusters(rows)) {
    if (c.kind === 'jp' || brand.test(c.rep) || violatesErrorClaim(c.rep)) continue; // jp: 한국어 블로그 대상이 아닌 일본 시장 페이지
    const owned = c.kind === 'blog' || c.kind === 'card-news';
    if (owned && c.impressions >= t.improveMinImpressions && c.position >= t.improvePositionMin && c.position <= t.improvePositionMax && c.ctr < t.improveMaxCtr) {
      improve.push(c);
      continue;
    }
    if (c.impressions < t.minImpressions) continue;
    const entry = isCovered(c, map);
    if (entry) {
      covered.push({ ...c, entry: entry.id });
      continue;
    }
    // 홈이 대신 받고 있거나(전용 글 없음), 글은 있지만 순위가 한참 밀린 경우만. /university·/faq 같은 전용 페이지가 있으면 제외.
    if (c.kind === 'home' || (owned && c.position > t.createPositionOver)) create.push(c);
  }
  const byImp = (a, b) => b.impressions - a.impressions;
  return { improve: improve.sort(byImp), create: create.sort(byImp), covered: covered.sort(byImp) };
}

/** 발행 글 한 편의 상태 판정. 기준은 rules.json lifecycle. indexState 는 URL 검사 결과({verdict,coverageState}) 또는 null(조회 불가). */
export function judgeArticle({ ageDays, impressions, clicks, position, indexState = null }) {
  const t = rules.lifecycle;
  const ctr = impressions ? clicks / impressions : 0;
  const indexed = indexState?.verdict === 'PASS';
  if (indexState && !indexed && ageDays >= t.indexCheckDays) {
    return { verdict: '미색인', reason: `발행 ${ageDays}일인데 Google 이 색인하지 않았다: ${indexState.coverageState || indexState.verdict}` };
  }
  if (ageDays < t.observeDays) return { verdict: '관찰 중', reason: `발행 ${ageDays}일(${t.observeDays}일 전에는 판정하지 않는다)` };
  if (impressions === 0) {
    if (indexed) return { verdict: '노출 대기', reason: '색인은 됐지만 노출이 없다 — 검색어와 순위가 아직 잡히지 않았다' };
    return { verdict: '색인 확인', reason: indexState ? `노출 0, ${indexState.coverageState || indexState.verdict}` : '노출 0 — URL 검사를 조회하지 못했으니 Search Console 에서 직접 본다' };
  }
  if (ageDays < t.decideDays) return { verdict: '관찰 중', reason: `발행 ${ageDays}일(${t.decideDays}일에 판정)` };
  if (impressions < t.minImpressions) return { verdict: '접기 검토', reason: `${ageDays}일간 노출 ${impressions} < ${t.minImpressions}` };
  if (ctr < t.lowCtr && position <= 10) return { verdict: '제목·설명 보강', reason: `순위 ${position.toFixed(1)}인데 CTR ${(ctr * 100).toFixed(1)}%` };
  return { verdict: '유지', reason: `노출 ${impressions}, CTR ${(ctr * 100).toFixed(1)}%, 순위 ${position.toFixed(1)}` };
}

export function readMap(file) {
  const map = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(map.entries)) throw new Error(`${file}: entries 배열이 없다.`);
  return map;
}

/** publish·draft 가 끝나면 지도를 맞춘다. 같은 slug 항목이 있으면 상태만, 없으면 새로 추가한다. */
export function recordInMap(file, { slug, keyword, keywords, status, publishedAt }) {
  const map = readMap(file);
  const entry = map.entries.find((e) => e.slug === slug);
  if (entry) {
    entry.status = status;
    if (publishedAt) entry.publishedAt = publishedAt;
  } else {
    map.entries.push({ id: slug, keyword, keywords: keywords ?? [], status, slug, ...(publishedAt ? { publishedAt } : {}) });
  }
  fs.writeFileSync(file, `${JSON.stringify(map, null, 2)}\n`);
  return { updated: Boolean(entry) };
}
