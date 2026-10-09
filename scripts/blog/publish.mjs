#!/usr/bin/env node
// 사용법:
//   node publish.mjs lint    <draft.html>                 검사만(쓰기·로그인 없음)
//   node publish.mjs draft   <draft.html> [--id ID]       검사 후 draft 로 저장
//   node publish.mjs publish <draft.html> [--id ID|--update]  검사 후 발행하고 라이브 검증
//   node publish.mjs verify  <slug> [--keyword K]         라이브 검증만
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recordInMap } from './analysis.mjs';
import { DEFAULT_API, loadEnv as loadEnvFrom } from './env.mjs';
import { fetchGsc } from './gsc.mjs';
import { buildPayload, convertDraft, draftPhrases, findGscOverlap, lintDraft, lintOnline, parseHtml, SITE, walk } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MAP_FILE = path.join(ROOT, 'content', 'keyword-map.json');
const POLL_MS = 20000;
const POLL_MAX_MS = 10 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fail = (msg) => {
  console.error(`✖ ${msg}`);
  process.exit(1);
};

function loadEnv() {
  try {
    return loadEnvFrom({ root: ROOT });
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
  }
}

async function call(url, init, what) {
  const res = await fetch(url, { signal: AbortSignal.timeout(60000), ...init });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* 본문이 JSON 이 아니면 아래에서 상태 코드로 보고한다 */
  }
  if (!res.ok) throw new Error(`${what} 실패: HTTP ${res.status} ${json?.message ? JSON.stringify(json.message) : text.slice(0, 200)}`);
  return json;
}

async function login({ email, password, api }) {
  const json = await call(`${api}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Country': 'kr' }, body: JSON.stringify({ email, password }) }, '로그인');
  const token = json?.accessToken ?? json?.data?.accessToken;
  if (!token) throw new Error('로그인 응답에 accessToken 이 없다.');
  return token;
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };

async function uploadLocalImages(draft, baseDir, token, api) {
  const srcs = [draft.meta['og:image'], ...draft.images.map((i) => i.src)].filter((s) => s && !/^https:\/\//.test(s));
  const map = {};
  for (const src of new Set(srcs)) {
    const file = path.resolve(baseDir, src);
    const form = new FormData();
    form.append('file', new Blob([fs.readFileSync(file)], { type: MIME[path.extname(file).toLowerCase()] }), path.basename(file));
    const json = await call(`${api}/admin/v2/sometime-articles/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'X-Country': 'kr' }, body: form }, `이미지 업로드(${src})`);
    const url = json?.data?.url ?? json?.url;
    if (!url) throw new Error(`이미지 업로드 응답에 url 이 없다: ${src}`);
    map[src] = url;
    console.log(`  ↑ ${src} → ${url}`);
  }
  return map;
}

function printReport(report) {
  console.log('\n— 검사 결과 —');
  for (const e of report.errors) console.log(`  ✖ [${e.code}] ${e.message}`);
  for (const w of report.warnings) console.log(`  ! [${w.code}] ${w.message}`);
  if (!report.errors.length && !report.warnings.length) console.log('  이상 없음');
  console.log(`\n  ${JSON.stringify(report.info)}`);
}

async function verifyLive({ slug, metaTitle, title, description, expectFaq }) {
  const url = `${SITE}/blog/${slug}`;
  const results = [];
  const rec = (name, ok, detail = '') => results.push({ name, ok, detail });
  let res;
  let html = '';
  const t0 = Date.now();
  while (Date.now() - t0 < POLL_MAX_MS) {
    res = await fetch(`${url}?cb=${Date.now()}`, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    if (res.status === 200) {
      html = await res.text();
      break;
    }
    console.log(`  … ${url} → ${res.status}, ${POLL_MS / 1000}초 뒤 재시도(사이트 캐시 5분)`);
    await sleep(POLL_MS);
  }
  rec('페이지 200', res?.status === 200, `HTTP ${res?.status}`);
  if (res?.status !== 200) return results;

  const tree = parseHtml(html);
  const metas = {};
  const links = {};
  const h1 = [];
  let docTitle = '';
  walk(tree, (n) => {
    if (n.tag === 'meta') metas[(n.attrs.name ?? n.attrs.property ?? '').toLowerCase()] = n.attrs.content;
    if (n.tag === 'link' && n.attrs.rel) links[n.attrs.rel] = n.attrs.href;
    if (n.tag === 'h1') h1.push(1);
    if (n.tag === 'title' && !docTitle) docTitle = (n.children[0]?.text ?? '').trim();
  });
  const types = new Set();
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const collect = (v) => {
        if (Array.isArray(v)) v.forEach(collect);
        else if (v && typeof v === 'object') {
          [].concat(v['@type'] ?? []).forEach((t) => types.add(t));
          Object.values(v).forEach(collect);
        }
      };
      collect(JSON.parse(m[1]));
    } catch {
      rec('JSON-LD 파싱', false, '깨진 JSON-LD');
    }
  }
  rec('<title> 에 제목 포함', docTitle.includes(metaTitle) || docTitle.includes(title), docTitle);
  rec('설명 meta 일치', metas.description === description, metas.description ?? '없음');
  rec('canonical 이 자기 주소', links.canonical === url, links.canonical ?? '없음');
  rec('og:image 있음', Boolean(metas['og:image']), metas['og:image'] ?? '없음');
  rec('<h1> 정확히 1개', h1.length === 1, `${h1.length}개`);
  rec('Article JSON-LD', types.has('Article'), [...types].join(','));
  rec('BreadcrumbList JSON-LD', types.has('BreadcrumbList'));
  if (expectFaq) rec('FAQPage JSON-LD', types.has('FAQPage'), 'FAQ 섹션이 사이트 파서에 잡혔는지');
  rec('색인 허용(noindex 없음)', !/noindex/i.test(`${metas.robots ?? ''} ${res.headers.get('x-robots-tag') ?? ''}`), `robots=${metas.robots ?? '-'} x-robots-tag=${res.headers.get('x-robots-tag') ?? '-'}`);

  let inSitemap = false;
  while (!inSitemap && Date.now() - t0 < POLL_MAX_MS) {
    const xml = await (await fetch(`${SITE}/sitemap.xml?cb=${Date.now()}`, { signal: AbortSignal.timeout(30000) })).text();
    inSitemap = xml.includes(`<loc>${url}</loc>`);
    if (!inSitemap) {
      console.log(`  … 사이트맵에 아직 없음, ${POLL_MS / 1000}초 뒤 재시도(재생성 5분)`);
      await sleep(POLL_MS);
    }
  }
  rec('사이트맵에 포함', inSitemap, `${SITE}/sitemap.xml`);
  return results;
}

function printVerify(results) {
  console.log('\n— 라이브 검증 —');
  for (const r of results) console.log(`  ${r.ok ? '✔' : '✖'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
  return results.every((r) => r.ok);
}

const [cmd, target, ...rest] = process.argv.slice(2);
const flag = (name) => rest.includes(`--${name}`);
const opt = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};

if (cmd === 'verify') {
  if (!target) fail('slug 가 필요하다.');
  const res = await fetch(`https://api.some-in-univ.com/api/sometime-articles/${encodeURIComponent(target)}`, { headers: { 'X-Country': 'kr' } });
  if (!res.ok) fail(`공개 API 에서 ${target} 을 찾지 못했다(HTTP ${res.status}). 아직 draft 이거나 슬러그가 틀렸다.`);
  const a = await res.json();
  const art = a.data ?? a;
  const ok = printVerify(await verifyLive({ slug: target, metaTitle: art.seo?.metaTitle ?? art.title, title: art.title, description: art.seo?.metaDescription ?? art.excerpt, expectFaq: /^#{2,3}\s*(FAQ|자주\s*묻는\s*질문)/im.test(art.content) }));
  process.exit(ok ? 0 : 1);
}

if (!['lint', 'draft', 'publish'].includes(cmd) || !target) fail('사용법: publish.mjs <lint|draft|publish> <draft.html> | verify <slug>');
const file = path.resolve(target);
if (!fs.existsSync(file)) fail(`파일이 없다: ${file}`);
const baseDir = path.dirname(file);
const draft = convertDraft(fs.readFileSync(file, 'utf8'));
const report = lintDraft(draft, { baseDir });
if (report.errors.length === 0 || cmd === 'lint') {
  try {
    await lintOnline(draft, report, { api: process.env.BLOG_API_BASE || DEFAULT_API });
  } catch (e) {
    report.errors.push({ code: 'online-lint', message: `온라인 검사를 하지 못했다: ${e instanceof Error ? e.message : e}` });
  }
}
// 같은 검색어를 이미 받는 다른 URL(카드뉴스 포함)이 있는지 Search Console 실데이터로 확인한다.
// 조회가 안 되면 조용히 넘기지 않고 경고로 남긴다(검사가 빠졌다는 사실을 알린다).
try {
  const rows = fetchGsc({ days: 92 });
  for (const o of findGscOverlap(rows, draftPhrases(draft), draft.meta.slug).slice(0, 5)) {
    const top = o.queries.sort((a, b) => b.impressions - a.impressions)[0];
    report.warnings.push({ code: 'gsc-overlap', message: `이미 이 키워드 계열로 노출 중인 URL: ${decodeURIComponent(o.page)} (92일 노출 ${o.impressions}·클릭 ${o.clicks}, 대표 "${top.query}" 순위 ${top.position.toFixed(1)}). 같은 검색 의도면 새 글 대신 그 글 보강을 검토하고, 다르면 본문에서 그 글로 링크한다.` });
  }
} catch (e) {
  report.warnings.push({ code: 'gsc-unavailable', message: `Search Console 겹침 검사를 하지 못했다(${e instanceof Error ? e.message.split('\n')[0].slice(0, 120) : e}). 카니발라이제이션을 수동으로 확인한다.` });
}
printReport(report);
if (cmd === 'lint') process.exit(report.errors.length ? 1 : 0);
if (report.errors.length) fail('오류가 있어 저장하지 않았다. 위 ✖ 를 고친 뒤 다시 실행한다.');

let id = opt('id');
if (report.info.slugExists && !id && !flag('update')) fail(`슬러그 "${draft.meta.slug}" 가 이미 공개되어 있다. 같은 글 수정이면 --update, 새 글이면 slug 를 바꾼다.`);

const env = loadEnv();
const token = await login(env);
const headers = { Authorization: `Bearer ${token}`, 'X-Country': 'kr', 'Content-Type': 'application/json' };
if (flag('update') && !id) {
  const pub = await call(`${env.api}/sometime-articles/${encodeURIComponent(draft.meta.slug)}`, { headers: { 'X-Country': 'kr' } }, '기존 글 조회');
  id = (pub.data ?? pub).id;
  if (!id) throw new Error('기존 글의 id 를 찾지 못했다.');
}
console.log('\n— 이미지 —');
const imageMap = await uploadLocalImages(draft, baseDir, token, env.api);
if (!Object.keys(imageMap).length) console.log('  업로드할 로컬 이미지 없음');

const publish = cmd === 'publish';
let keepPublishedAt = false;
if (id) {
  const current = await call(`${env.api}/admin/v2/sometime-articles/${id}`, { headers }, '기존 글 상세 조회');
  keepPublishedAt = Boolean((current.data ?? current).publishedAt);
}
const payload = buildPayload(draft, { publish, nowIso: keepPublishedAt ? undefined : new Date().toISOString(), imageMap });
const saved = await call(
  id ? `${env.api}/admin/v2/sometime-articles/${id}` : `${env.api}/admin/v2/sometime-articles`,
  { method: id ? 'PATCH' : 'POST', headers, body: JSON.stringify(payload) },
  id ? '글 수정' : '글 생성',
);
const art = saved?.data ?? saved;
console.log(`\n✔ ${id ? '수정' : '생성'} 완료: id=${art.id} status=${art.status} slug=${art.slug}`);

const mapNote = recordInMap(MAP_FILE, { slug: art.slug, keyword: draft.meta.keyword, keywords: draftPhrases(draft), status: publish ? 'published' : 'draft', publishedAt: publish ? payload.publishedAt ?? art.publishedAt : undefined });
console.log(`  키워드 지도(content/keyword-map.json) ${mapNote.updated ? '상태 갱신' : '항목 추가'} — 커밋해 둔다.`);

if (!publish) {
  console.log(`  초안이라 공개되지 않는다. 발행: npm run blog:publish -- ${target} --id ${art.id}`);
  process.exit(0);
}
console.log(`  서버가 IndexNow(Bing·Naver) 핑을 자동 전송한다. 페이지는 사이트 캐시 때문에 최대 5분 뒤에 열린다.`);
const ok = printVerify(await verifyLive({ slug: art.slug, metaTitle: payload.seo.metaTitle, title: payload.title, description: payload.seo.metaDescription, expectFaq: report.info.faqPairs > 0 }));
console.log(`\n수동으로 남은 일: Search Console → URL 검사 → 색인 생성 요청(Google 은 API 가 없다): ${SITE}/blog/${art.slug}`);
process.exit(ok ? 0 : 1);
