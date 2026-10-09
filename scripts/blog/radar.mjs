#!/usr/bin/env node
// 키워드 레이더: Search Console 92일 데이터에서 "다음에 쓸 글"과 "고칠 글" 후보를 뽑는다.
//   npm run blog:radar            → 표 출력
//   npm run blog:radar -- --top 15
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRadar, readMap } from './analysis.mjs';
import { fetchGsc } from './gsc.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const topIdx = process.argv.indexOf('--top');
const top = topIdx >= 0 ? Number(process.argv[topIdx + 1]) : 10;
if (!Number.isInteger(top) || top < 1) {
  console.error('✖ --top 은 1 이상의 정수여야 한다.');
  process.exit(1);
}

const rows = fetchGsc({ days: 92 });
const map = readMap(path.join(ROOT, 'content', 'keyword-map.json'));
const { improve, create, covered } = buildRadar(rows, map);
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const line = (c) => `| ${c.rep} | ${c.queries} | ${c.impressions} | ${c.clicks} | ${pct(c.ctr)} | ${c.position.toFixed(1)} | ${decodeURIComponent(new URL(c.topPage).pathname)} |`;
const head = '| 대표 검색어 | 검색어 수 | 노출 | 클릭 | CTR | 순위 | 현재 URL |\n|---|---:|---:|---:|---:|---:|---|';

console.log(`# 키워드 레이더 (Search Console 92일, 행 ${rows.length}개, 지도 항목 ${map.entries.length}개)\n`);
console.log(`## 고칠 글 — 페이지가 있는데 CTR 이 낮다 (제목·설명·본문 보강)\n${improve.length ? `${head}\n${improve.slice(0, top).map(line).join('\n')}` : '없음'}\n`);
console.log(`## 새로 쓸 글 — 노출은 있는데 전용 글이 없다\n${create.length ? `${head}\n${create.slice(0, top).map(line).join('\n')}` : '없음'}\n`);
console.log(`## 이미 지도에 있는 주제\n${covered.length ? covered.slice(0, top).map((c) => `- ${c.rep} (노출 ${c.impressions}) → ${c.entry}`).join('\n') : '없음'}\n`);
console.log('다음: 후보를 고르면 content/keyword-map.json 에 status "planned" 로 적고, 같은 검색 의도의 기존 글이 없는지(blog:lint 의 gsc-overlap) 확인한 뒤 초안을 쓴다.');
