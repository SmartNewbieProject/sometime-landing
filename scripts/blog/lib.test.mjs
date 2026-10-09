import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPayload, checkFaq, convertDraft, draftPhrases, findGscOverlap, lintDraft, lintOnline, parseGscCsv, parseHtml } from './lib.mjs';

const para = (n) => `<p>${'소개팅 애프터 연락은 만남 직후 짧게 보내는 편이 부담이 적다. '.repeat(n)}</p>`;
const draftHtml = ({ head = '', body = '' } = {}) => `<!doctype html><html><head>
<meta name="slug" content="after-contact-timing"><meta name="category" content="tips">
<meta name="keyword" content="소개팅 애프터"><meta name="description" content="소개팅 애프터 연락은 언제 보내는 게 좋을까. 시간대와 문장 길이, 답이 없을 때의 대처를 정리했습니다.">
<meta property="og:image" content="https://cdn.example.com/a.png">${head}</head><body><article>
<h1>소개팅 애프터 연락, 언제 보낼까</h1><p class="subtitle">부제입니다.</p>
${para(10)}<h2>소개팅 애프터 시간대</h2>${para(10)}<p>자세한 건 <a href="/faq">FAQ</a>와 <a href="/verification">학교 인증</a>, <a href="/blog/yeonpick-vs-sometime">비교 글</a>을 본다. <strong>굵게</strong></p>
<ul><li>하나</li><li>둘</li></ul><h2>자주 묻는 질문</h2><h3>언제 보내나요?</h3><p>당일 밤.</p><h3>답이 없으면?</h3><p>기다린다.</p>${body}
</article></body></html>`;
const lint = (html, o) => lintDraft(convertDraft(html), { fileExists: () => true, fileSize: () => 1000, ...o });
const codes = (r) => r.errors.map((e) => e.code);

test('html is converted to the markdown subset the site renders', () => {
  const d = convertDraft(draftHtml());
  assert.equal(d.title, '소개팅 애프터 연락, 언제 보낼까');
  assert.equal(d.subtitle, '부제입니다.');
  assert.ok(!d.markdown.includes('# 소개팅 애프터 연락, 언제'), 'h1 must not be repeated in the body');
  assert.match(d.markdown, /^## 소개팅 애프터 시간대$/m);
  assert.match(d.markdown, /\[FAQ\]\(\/faq\)/);
  assert.match(d.markdown, /\*\*굵게\*\*/);
  assert.match(d.markdown, /^- 하나\n- 둘$/m);
  assert.deepEqual(d.links.map((l) => l.href), ['/faq', '/verification', '/blog/yeonpick-vs-sometime']);
});

test('a complete draft has no errors', () => {
  const r = lint(draftHtml());
  assert.deepEqual(r.errors, []);
  assert.equal(r.info.faqPairs, 2);
});

test('structure and meta violations block publishing', () => {
  assert.ok(codes(lint(draftHtml({ body: '<h1>두번째</h1>' }))).includes('h1-count'));
  assert.ok(codes(lint(draftHtml({ head: '<meta name="slug" content="한글 슬러그">' }))).includes('slug-format'));
  assert.ok(codes(lint(draftHtml({ head: '<meta name="category" content="guide">' }))).includes('category'));
  assert.ok(codes(lint(draftHtml({ head: `<meta name="title-tag" content="${'가'.repeat(61)}">` }))).includes('meta-title-length'));
  assert.ok(codes(lint(draftHtml({ head: `<meta name="description" content="${'가'.repeat(161)}">` }))).includes('description-length'));
  assert.ok(codes(lint(draftHtml({ head: '<meta name="slug" content="naver-123">' }))).includes('slug-reserved'));
  assert.ok(codes(lint(draftHtml({ body: '<script>alert(1)</script>' }))).includes('forbidden-tag'));
});

test('keyword must reach the title; thin content and missing internal links are errors', () => {
  assert.ok(codes(lint(draftHtml({ head: '<meta name="keyword" content="과팅 앱">' }))).includes('keyword-title'));
  const thin = convertDraft('<meta name="slug" content="x-y"><article><h1>소개팅 애프터</h1><h2>a</h2><p>짧다</p></article>');
  assert.ok(codes(lintDraft(thin, { fileExists: () => true })).includes('thin-content'));
  assert.ok(codes(lint(draftHtml().replace(/<a href="[^"]*">/g, '<a href="https://example.com/x">'))).includes('internal-links'));
});

test('images need alt text, https or an existing local file', () => {
  assert.ok(codes(lint(draftHtml({ body: '<img src="https://cdn.example.com/b.png">' }))).includes('image-alt'));
  assert.ok(codes(lint(draftHtml({ body: '<img src="http://x.com/b.png" alt="a">' }))).includes('image-src'));
  assert.ok(codes(lint(draftHtml({ body: '<img src="./b.png" alt="a">' }), { fileExists: () => false })).includes('image-missing'));
  assert.ok(lint(draftHtml({ body: '<img src="./b.png" alt="a">' }), { fileSize: () => 900000 }).warnings.some((w) => w.code === 'image-heavy'));
});

test('unverified AI-matching claims and policy keywords are errors, hedges are warnings', () => {
  assert.ok(codes(lint(draftHtml({ body: '<p>AI가 추천해 주는 상대</p>' }))).includes('claim'));
  assert.ok(codes(lint(draftHtml({ body: '<p>원나잇 어플</p>' }))).includes('claim'));
  const r = lint(draftHtml({ body: '<p>무조건 답장이 온다</p>' }));
  assert.ok(!codes(r).includes('claim') && r.warnings.some((w) => w.code === 'claim'));
});

test('FAQ must match the site parser shape or the FAQPage schema silently disappears', () => {
  assert.deepEqual(checkFaq('## 본문\n\n글'), { present: false, pairs: 0, ok: true });
  assert.equal(checkFaq('## FAQ\n\n### Q1\n\nA1\n\n### Q2\n\nA2').pairs, 2);
  assert.equal(checkFaq('## FAQ\n\n### Q1\n\n### Q2\n\nA2').ok, false);
  assert.equal(checkFaq('## 자주 묻는 질문\n\n설명만 있다').ok, false);
});

test('unsupported html is called out instead of silently dropped', () => {
  const d = convertDraft(draftHtml({ body: '<ul><li>a<ul><li>b</li></ul></li></ul><p><em>기울임</em><br>줄</p><h4>깊다</h4>' }));
  const r = lintDraft(d, { fileExists: () => true });
  assert.ok(codes(r).includes('nested-list'));
  assert.ok(r.warnings.some((w) => w.code === 'emphasis') && r.warnings.some((w) => w.code === 'line-break') && r.warnings.some((w) => w.code === 'deep-heading'));
});

test('parseHtml survives doctype, comments, entities and unclosed tags', () => {
  const t = parseHtml('<!doctype html><!-- c --><p>a &amp; b &#51060;<br><b>x</p>');
  assert.equal(t.children.length, 1);
  assert.equal(t.children[0].tag, 'p');
});

test('payload carries seo fields, draft has no publishedAt, publish does', () => {
  const d = convertDraft(draftHtml({ head: '<meta name="title-tag" content="짧은 제목"><meta name="keywords" content="연락 텀, 애프터">' }));
  const draft = buildPayload(d, { publish: false, nowIso: '2026-10-08T00:00:00Z' });
  assert.equal(draft.status, 'draft');
  assert.ok(!('publishedAt' in draft));
  assert.equal(draft.seo.metaTitle, '짧은 제목');
  assert.deepEqual(draft.seo.keywords, ['소개팅 애프터', '연락 텀', '애프터']);
  assert.equal(draft.author.id, 'sometime-team');
  const pub = buildPayload(d, { publish: true, nowIso: '2026-10-08T00:00:00Z', imageMap: { 'https://cdn.example.com/a.png': 'https://cdn.example.com/up.png' } });
  assert.equal(pub.status, 'published');
  assert.equal(pub.publishedAt, '2026-10-08T00:00:00Z');
  assert.equal(pub.thumbnail.url, 'https://cdn.example.com/up.png');
  const edit = buildPayload(d, { publish: true, nowIso: undefined });
  assert.equal(edit.status, 'published');
  assert.ok(!('publishedAt' in edit), 'editing an already published article must not move its publish date');
});

test('online lint flags dead internal links and same-keyword articles', async () => {
  const d = convertDraft(draftHtml());
  const report = lintDraft(d, { fileExists: () => true, fileSize: () => 1 });
  const fakeFetch = async (url) => {
    if (url.includes('/sometime-articles')) {
      return Response.json({ items: [
        { slug: 'older', title: '소개팅 애프터 연락 가이드', seo: { keywords: [] } },
        { slug: 'naver-1', title: '소개팅 애프터 연락', seo: {} },
        { slug: 'unrelated', title: '학교 인증이 필요한 이유', seo: {} },
      ] });
    }
    return new Response('', { status: url.endsWith('/verification') ? 404 : 200 });
  };
  await lintOnline(d, report, { fetchImpl: fakeFetch });
  assert.ok(report.errors.some((e) => e.code === 'link-dead' && e.message.includes('/verification')));
  const c = report.warnings.filter((w) => w.code === 'cannibalization');
  assert.equal(c.length, 1);
  assert.match(c[0].message, /\/blog\/older/);
});

test('GSC overlap finds other pages already ranking for the draft keyword family', () => {
  const d = convertDraft(draftHtml({ head: '<meta name="keywords" content="소개팅 후 연락, 연락">' }));
  assert.deepEqual(draftPhrases(d), ['소개팅 애프터', '소개팅 후 연락']);
  const csv = [
    'query,page,clicks,impressions,ctr,position',
    '소개팅 후 연락 텀,https://some-in-univ.com/card-news/abc,5,154,0.03,6.3',
    '"소개팅 후 연락, 언제",https://some-in-univ.com/card-news/abc,1,10,0.1,7',
    '소개팅 애프터 멘트,https://some-in-univ.com/blog/after-contact-timing,2,20,0.1,5',
    '과팅,https://some-in-univ.com/,0,3,0,40',
  ].join('\r\n');
  const rows = parseGscCsv(csv);
  assert.equal(rows.length, 4);
  const overlap = findGscOverlap(rows, draftPhrases(d), 'after-contact-timing');
  assert.equal(overlap.length, 1, 'own URL and unrelated queries are excluded');
  assert.equal(overlap[0].page, 'https://some-in-univ.com/card-news/abc');
  assert.equal(overlap[0].impressions, 164);
});
