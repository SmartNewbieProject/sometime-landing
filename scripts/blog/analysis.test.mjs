import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildClusters, buildRadar, judgeArticle, pageKind, readMap, recordInMap } from './analysis.mjs';

const U = 'https://some-in-univ.com';
const row = (query, page, impressions, clicks, position) => ({ query, page: `${U}${page}`, impressions, clicks, position });
const map = { entries: [{ id: 'P1', keyword: '과팅', keywords: ['과팅', '대학생 미팅'], status: 'planned' }, { id: 'X', keyword: 'mbti 소개팅', keywords: [], status: 'rejected' }] };

test('page kinds are derived from the decoded path', () => {
  assert.equal(pageKind(`${U}/`), 'home');
  assert.equal(pageKind(`${U}/blog/a`), 'blog');
  assert.equal(pageKind(`${U}/blog/%ED%95%98`), 'blog');
  assert.equal(pageKind(`${U}/card-news/x`), 'card-news');
  assert.equal(pageKind(`${U}/faq`), 'other');
});

test('near-duplicate queries cluster under the highest-impression one', () => {
  const c = buildClusters([row('소개팅 후 연락 텀', '/card-news/a', 154, 5, 6.3), row('소개팅 연락 텀', '/card-news/a', 83, 1, 7.6), row('과팅 시간', '/', 3, 0, 11)]);
  assert.equal(c.length, 2);
  assert.equal(c[0].rep, '소개팅 후 연락 텀');
  assert.equal(c[0].impressions, 237);
  assert.equal(c[0].queries, 2);
});

test('radar splits improve / create / covered and drops brand, policy and tiny clusters', () => {
  const rows = [
    row('소개팅 후 연락 텀', '/card-news/a', 400, 8, 6.3), // 페이지 있음 + CTR 2% → 고칠 글
    row('소개팅 애프터 멘트', '/', 60, 1, 30), // 전용 글 없음 → 새 글
    row('과팅 앱', '/', 40, 0, 40), // 지도에 있음(planned) → covered
    row('mbti 소개팅', '/', 80, 1, 25), // rejected 는 covered 로 막지 않는다 → 새 글 후보
    row('썸타임 후기', '/', 900, 400, 1), // 브랜드 제외
    row('원나잇 어플', '/', 100, 0, 20), // 정책 위반 제외
    row('희귀 검색어', '/', 4, 0, 50), // 노출 부족
    row('대학생 소개팅 앱', '/blog/ok', 300, 30, 5), // CTR 10% → 고칠 글 아님, 순위 양호 → 후보 아님
    row('카이스트 소개팅', '/university/KAIST', 50, 8, 5), // 전용 페이지가 있다 → 후보 아님
    row('マッチングアプリ 長崎', '/jp/university/F1', 150, 1, 15), // 일본 시장 → 제외
  ];
  const r = buildRadar(rows, map);
  assert.deepEqual(r.improve.map((c) => c.rep), ['소개팅 후 연락 텀']);
  assert.deepEqual(r.create.map((c) => c.rep), ['mbti 소개팅', '소개팅 애프터 멘트']);
  assert.deepEqual(r.covered.map((c) => [c.rep, c.entry]), [['과팅 앱', 'P1']]);
});

test('article verdict follows the lifecycle rules in rules.json', () => {
  assert.equal(judgeArticle({ ageDays: 10, impressions: 500, clicks: 30, position: 5 }).verdict, '관찰 중');
  assert.equal(judgeArticle({ ageDays: 30, impressions: 0, clicks: 0, position: 0 }).verdict, '색인 확인');
  assert.equal(judgeArticle({ ageDays: 40, impressions: 10, clicks: 0, position: 20 }).verdict, '관찰 중');
  assert.equal(judgeArticle({ ageDays: 60, impressions: 50, clicks: 1, position: 20 }).verdict, '접기 검토');
  assert.equal(judgeArticle({ ageDays: 60, impressions: 800, clicks: 8, position: 6 }).verdict, '제목·설명 보강');
  assert.equal(judgeArticle({ ageDays: 60, impressions: 800, clicks: 60, position: 6 }).verdict, '유지');
});

test('recordInMap updates a matching slug, appends an unknown one, and refuses a broken map', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kmap-'));
  const file = path.join(dir, 'keyword-map.json');
  fs.writeFileSync(file, JSON.stringify({ entries: [{ id: 'P3', keyword: 'a', status: 'draft', slug: 's1' }] }));
  assert.deepEqual(recordInMap(file, { slug: 's1', keyword: 'a', status: 'published', publishedAt: '2026-10-09T00:00:00Z' }), { updated: true });
  assert.deepEqual(recordInMap(file, { slug: 's2', keyword: 'b', keywords: ['b'], status: 'draft' }), { updated: false });
  const m = readMap(file);
  assert.equal(m.entries.find((e) => e.slug === 's1').status, 'published');
  assert.equal(m.entries.find((e) => e.slug === 's2').id, 's2');
  fs.writeFileSync(file, '{"entries":"x"}');
  assert.throws(() => readMap(file), /entries/);
});

test('a narrow map entry does not swallow the broader head query', () => {
  const narrow = { entries: [{ id: 'P5', keyword: '대학생 소개팅 앱 후기', keywords: [], status: 'planned' }] };
  const r = buildRadar([row('대학생 소개팅', '/', 500, 40, 18)], narrow);
  assert.deepEqual(r.create.map((c) => c.rep), ['대학생 소개팅']);
  assert.deepEqual(r.covered, []);
});

test('index state drives the verdict: unindexed after a week, indexed-but-no-impressions waits, unknown asks for a manual check', () => {
  const base = { impressions: 0, clicks: 0, position: 0 };
  assert.equal(judgeArticle({ ...base, ageDays: 3, indexState: { verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google' } }).verdict, '관찰 중');
  const unindexed = judgeArticle({ ...base, ageDays: 9, indexState: { verdict: 'NEUTRAL', coverageState: '크롤링됨 - 현재 색인이 생성되지 않음' } });
  assert.equal(unindexed.verdict, '미색인');
  assert.match(unindexed.reason, /크롤링됨/);
  assert.equal(judgeArticle({ ...base, ageDays: 30, indexState: { verdict: 'PASS', coverageState: '제출되고 색인이 생성되었습니다.' } }).verdict, '노출 대기');
  const unknown = judgeArticle({ ...base, ageDays: 30, indexState: null });
  assert.equal(unknown.verdict, '색인 확인');
  assert.match(unknown.reason, /조회하지 못했/);
});
