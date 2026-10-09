#!/usr/bin/env node
// 발행 글 성과 판정: 키워드 지도의 published 항목마다 노출·클릭·순위를 모아 rules.json lifecycle 기준으로 판정한다.
//   npm run blog:report
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { judgeArticle, readMap } from './analysis.mjs';
import { fetchGsc } from './gsc.mjs';
import { DEFAULT_API } from './env.mjs';
import { SITE } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const api = process.env.BLOG_API_BASE || DEFAULT_API;
const map = readMap(path.join(ROOT, 'content', 'keyword-map.json'));
const published = map.entries.filter((e) => e.status === 'published' && e.slug);
const drafts = map.entries.filter((e) => e.status === 'draft' && e.slug);
const rows = fetchGsc({ days: 92 });
const decode = (u) => {
  try {
    return decodeURIComponent(new URL(u).pathname);
  } catch {
    return u;
  }
};

console.log(`# 발행 글 성과 (Search Console 92일, ${published.length}편)\n`);
if (!published.length) console.log('발행된 항목이 없다. 키워드 지도의 status 가 published 인 글이 생기면 여기에 나온다.\n');
for (const e of published) {
  const res = await fetch(`${api}/sometime-articles/${encodeURIComponent(e.slug)}`, { headers: { 'X-Country': 'kr' }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) {
    console.log(`- ${e.slug}: 공개 API 에서 찾지 못했다(HTTP ${res.status}). 지도 상태가 published 인데 글이 없다 — 확인 필요\n`);
    continue;
  }
  const art = await res.json();
  const publishedAt = (art.data ?? art).publishedAt ?? e.publishedAt;
  if (!publishedAt) {
    console.log(`- ${e.slug}: 발행일을 알 수 없어 판정하지 않는다.\n`);
    continue;
  }
  const ageDays = Math.floor((Date.now() - Date.parse(publishedAt)) / 86400000);
  const mine = rows.filter((r) => decode(r.page) === `/blog/${e.slug}`);
  const impressions = mine.reduce((s, r) => s + r.impressions, 0);
  const clicks = mine.reduce((s, r) => s + r.clicks, 0);
  const position = impressions ? mine.reduce((s, r) => s + r.position * r.impressions, 0) / impressions : 0;
  const j = judgeArticle({ ageDays, impressions, clicks, position });
  const topQ = mine.sort((a, b) => b.impressions - a.impressions).slice(0, 3).map((r) => `${r.query}(${r.impressions})`).join(', ');
  console.log(`## ${e.slug} — ${j.verdict}\n- ${SITE}/blog/${e.slug} · 발행 ${ageDays}일\n- 노출 ${impressions} · 클릭 ${clicks} · 순위 ${impressions ? position.toFixed(1) : '-'}\n- 판정 근거: ${j.reason}\n- 상위 검색어: ${topQ || '없음'}\n`);
}
for (const e of drafts) {
  const res = await fetch(`${api}/sometime-articles/${encodeURIComponent(e.slug)}`, { headers: { 'X-Country': 'kr' }, signal: AbortSignal.timeout(30000) });
  if (res.ok) console.log(`! ${e.slug}: 지도에는 draft 인데 이미 공개돼 있다. status 를 published 로 고친다.`);
}
console.log('\n색인 여부는 이 보고서로 알 수 없다(URL 검사 API 미연결). "색인 확인" 판정이면 Search Console 에서 직접 본다.');
