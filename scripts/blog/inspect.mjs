#!/usr/bin/env node
// 색인 상태 조회(Search Console URL 검사 API, 읽기 전용).
//   npm run blog:inspect -- <slug|URL> [...]
import { inspectUrl } from './gsc.mjs';
import { SITE } from './lib.mjs';

const targets = process.argv.slice(2);
if (!targets.length) {
  console.error('✖ 사용법: npm run blog:inspect -- <slug|URL> [...]');
  process.exit(1);
}
let failed = false;
for (const t of targets) {
  const url = /^https?:\/\//.test(t) ? t : `${SITE}/blog/${t}`;
  try {
    const r = await inspectUrl(url);
    console.log(`${r.verdict === 'PASS' ? '✔' : '!'} ${url}\n  ${r.verdict} · ${r.coverageState}\n  마지막 크롤 ${r.lastCrawlTime ?? '-'} · 색인 허용 ${r.indexingState ?? '-'} · 가져오기 ${r.pageFetchState ?? '-'}\n  구글 canonical ${r.googleCanonical ?? '-'}${r.googleCanonical && r.userCanonical && r.googleCanonical !== r.userCanonical ? `  (사이트 선언 ${r.userCanonical} 과 다르다)` : ''}`);
  } catch (e) {
    failed = true;
    console.log(`✖ ${url}\n  ${e instanceof Error ? e.message : e}`);
  }
}
process.exit(failed ? 1 : 0);
