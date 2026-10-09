import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { inspectUrl, summarizeInspection } from './gsc.mjs';
import { loadPlanner, parsePlannerCsv, plannerLookup } from './planner.mjs';

const ok = { inspectionResult: { indexStatusResult: { verdict: 'PASS', coverageState: '색인 생성됨', lastCrawlTime: '2026-09-24T05:38:44Z', googleCanonical: 'https://x/a', userCanonical: 'https://x/a', indexingState: 'INDEXING_ALLOWED', pageFetchState: 'SUCCESSFUL' } } };

test('inspection summary keeps the fields the report needs and refuses an empty response', () => {
  assert.equal(summarizeInspection(ok).coverageState, '색인 생성됨');
  assert.throws(() => summarizeInspection({ inspectionResult: {} }), /verdict/);
});

test('inspectUrl posts the property and url, and surfaces API errors with status and message', async () => {
  let sent;
  const good = await inspectUrl('https://x/a', { token: 't', fetchImpl: async (_u, init) => ((sent = JSON.parse(init.body)), Response.json(ok)) });
  assert.equal(good.verdict, 'PASS');
  assert.deepEqual([sent.inspectionUrl, sent.siteUrl], ['https://x/a', 'sc-domain:some-in-univ.com']);
  await assert.rejects(inspectUrl('https://x/a', { token: 't', fetchImpl: async () => Response.json({ error: { message: 'denied' } }, { status: 403 }) }), /HTTP 403 denied/);
});

test('planner csv: blank bucket stays null, lookup is exact (spaces ignored) and never borrows a similar keyword', () => {
  const rows = parsePlannerCsv('keyword,currency,avg_monthly_searches_bucket_value,competition,top_of_page_bid_low_krw,top_of_page_bid_high_krw\n과팅,KRW,5000,낮음,,\n"미팅 앱",KRW,500,낮음,1421,5392\n미정,KRW,,알 수 없음,,');
  assert.deepEqual(rows.map((r) => r.bucket), [5000, 500, null]);
  const dir = new URL('./__planner_tmp__/', import.meta.url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(new URL('a.csv', dir), 'keyword,currency,avg_monthly_searches_bucket_value,competition\n과팅,KRW,50,낮음\n');
  fs.writeFileSync(new URL('b.csv', dir), 'keyword,currency,avg_monthly_searches_bucket_value,competition\n과팅,KRW,5000,낮음\n미팅앱,KRW,500,낮음\n');
  const map = loadPlanner(dir.pathname);
  fs.rmSync(dir, { recursive: true });
  assert.equal(plannerLookup(map, '과팅').bucket, 5000, 'later file wins');
  assert.equal(plannerLookup(map, '미팅 앱').bucket, 500);
  assert.equal(plannerLookup(map, '과팅 앱'), null);
  assert.throws(() => parsePlannerCsv('a,b\n1,2'), /keyword 열/);
});
