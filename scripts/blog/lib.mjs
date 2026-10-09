// 초안 HTML → 사이트 마크다운 변환과 SEO·사실성 검사. 외부 의존성 없음.
// 렌더러(sometime-landing MarkdownBody)가 지원하는 문법만 내보낸다: 제목, 문단, 목록, 인용, 표,
// 코드, **굵게**, 링크, 이미지. 원시 HTML 은 이스케이프되므로 변환 단계에서 반드시 마크다운으로 바꾼다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const rules = JSON.parse(fs.readFileSync(path.join(here, 'rules.json'), 'utf8'));
export const SITE = 'https://some-in-univ.com';

const VOID = new Set(['meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'base', 'col', 'area', 'wbr']);
const RAW = new Set(['script', 'style']);
const FORBIDDEN = new Set(['script', 'style', 'iframe', 'video', 'audio', 'form', 'object', 'embed']);
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·', hellip: '…', ndash: '–', mdash: '—' };

const decode = (s) =>
  s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });

function parseAttrs(str) {
  const attrs = {};
  for (const m of str.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    attrs[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

export function parseHtml(src) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<![^>]*>|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>|[^<]+|</g;
  const lower = src.toLowerCase();
  let m;
  while ((m = re.exec(src))) {
    const [tok, close, name, attrStr] = m;
    const top = stack[stack.length - 1];
    if (tok.startsWith('<!')) continue;
    if (name === undefined) {
      top.children.push({ text: decode(tok) });
      continue;
    }
    const tag = name.toLowerCase();
    if (close) {
      for (let i = stack.length - 1; i > 0; i -= 1) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    const node = { tag, attrs: parseAttrs(attrStr), children: [] };
    top.children.push(node);
    if (RAW.has(tag)) {
      const end = lower.indexOf(`</${tag}`, re.lastIndex);
      re.lastIndex = end < 0 ? src.length : src.indexOf('>', end) + 1;
      continue;
    }
    if (!VOID.has(tag) && !attrStr.trim().endsWith('/')) stack.push(node);
  }
  return root;
}

export const walk = (node, fn) => {
  fn(node);
  for (const c of node.children ?? []) walk(c, fn);
};
const textOf = (node) => (node.text !== undefined ? node.text : (node.children ?? []).map(textOf).join(''));
const squash = (s) => s.replace(/\s+/g, ' ').trim();

/** HTML 문자열 → { meta, title, subtitle, markdown, headings, links, images, issues } */
export function convertDraft(html) {
  const tree = parseHtml(html);
  const meta = {};
  let h1Count = 0;
  let title = '';
  let subtitle = '';
  const issues = [];
  walk(tree, (n) => {
    if (n.tag === 'meta') {
      const key = n.attrs.name ?? n.attrs.property;
      if (key && n.attrs.content !== undefined) meta[key.toLowerCase()] = n.attrs.content.trim();
    }
    if (n.tag === 'h1') {
      h1Count += 1;
      if (!title) title = squash(textOf(n));
    }
    if (FORBIDDEN.has(n.tag)) issues.push({ code: 'forbidden-tag', message: `<${n.tag}> 는 본문에 쓸 수 없다(렌더러가 이스케이프하거나 보안 위험).` });
  });
  if (!meta['title-tag'] && !title) {
    const t = [];
    walk(tree, (n) => n.tag === 'title' && t.push(squash(textOf(n))));
    if (t[0]) title = t[0];
  }

  let bodyRoot = tree;
  walk(tree, (n) => {
    if (bodyRoot === tree && n.tag === 'article') bodyRoot = n;
  });
  if (bodyRoot === tree) walk(tree, (n) => n.tag === 'body' && bodyRoot === tree && (bodyRoot = n));

  const headings = [];
  const links = [];
  const images = [];
  let usedEmphasis = false;
  let usedBreak = false;

  const inline = (node) =>
    (node.children ?? [])
      .map((c) => {
        if (c.text !== undefined) return c.text.replace(/\s+/g, ' ');
        switch (c.tag) {
          case 'strong':
          case 'b': {
            const t = inline(c).trim();
            return t ? `**${t}**` : '';
          }
          case 'em':
          case 'i':
            usedEmphasis = true;
            return inline(c);
          case 'code':
            return `\`${textOf(c).replace(/`/g, '')}\``;
          case 'br':
            usedBreak = true;
            return ' ';
          case 'a': {
            const text = squash(inline(c));
            const href = c.attrs.href ?? '';
            links.push({ href, text });
            return href ? `[${text}](${href})` : text;
          }
          case 'img': {
            const img = { src: c.attrs.src ?? '', alt: (c.attrs.alt ?? '').trim() };
            images.push(img);
            return `![${img.alt}](${img.src})`;
          }
          default:
            return inline(c);
        }
      })
      .join('');

  const cell = (n) => squash(inline(n)).replace(/\|/g, '\\|');

  const blocks = (nodes) => {
    const out = [];
    for (const n of nodes) {
      if (n.text !== undefined) {
        const t = squash(n.text);
        if (t) out.push(t);
        continue;
      }
      switch (n.tag) {
        case 'h1':
        case 'title':
        case 'head':
        case 'script':
        case 'style':
        case 'meta':
        case 'link':
          break;
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6': {
          const level = Number(n.tag[1]);
          const text = squash(inline(n));
          headings.push({ level, text });
          if (level >= 4) issues.push({ code: 'deep-heading', message: `<${n.tag}> "${text}" — 본문은 h2·h3 까지만 쓴다.`, warn: true });
          out.push(`${'#'.repeat(Math.min(level, 3))} ${text}`);
          break;
        }
        case 'p': {
          if ((n.attrs.class ?? '').split(/\s+/).includes('subtitle')) {
            if (!subtitle) subtitle = squash(inline(n));
            break;
          }
          const t = squash(inline(n));
          if (t) out.push(t);
          break;
        }
        case 'ul':
        case 'ol': {
          const items = n.children.filter((c) => c.tag === 'li');
          if (n.children.some((c) => c.tag === 'li' && c.children.some((g) => g.tag === 'ul' || g.tag === 'ol'))) {
            issues.push({ code: 'nested-list', message: '중첩 목록은 렌더러가 지원하지 않는다. 한 단계 목록으로 바꾼다.' });
          }
          out.push(items.map((li, i) => `${n.tag === 'ol' ? `${i + 1}.` : '-'} ${squash(inline(li))}`).join('\n'));
          break;
        }
        case 'blockquote': {
          const t = squash(inline(n));
          if (t) out.push(`> ${t}`);
          break;
        }
        case 'hr':
          out.push('---');
          break;
        case 'pre':
          out.push(`\`\`\`\n${textOf(n).replace(/^\n|\n$/g, '')}\n\`\`\``);
          break;
        case 'table': {
          const rows = [];
          walk(n, (r) => r.tag === 'tr' && rows.push(r.children.filter((c) => c.tag === 'th' || c.tag === 'td').map(cell)));
          if (rows.length >= 2) {
            out.push([`| ${rows[0].join(' | ')} |`, `| ${rows[0].map(() => '---').join(' | ')} |`, ...rows.slice(1).map((r) => `| ${r.join(' | ')} |`)].join('\n'));
          } else issues.push({ code: 'table-shape', message: '표는 머리글 행 + 1개 이상의 본문 행이 필요하다.' });
          break;
        }
        case 'img': {
          const img = { src: n.attrs.src ?? '', alt: (n.attrs.alt ?? '').trim() };
          images.push(img);
          out.push(`![${img.alt}](${img.src})`);
          break;
        }
        case 'figcaption':
          if (squash(inline(n))) out.push(squash(inline(n)));
          break;
        default:
          out.push(...blocks(n.children ?? []));
      }
    }
    return out;
  };

  const markdown = blocks(bodyRoot.children).join('\n\n').trim();
  if (usedEmphasis) issues.push({ code: 'emphasis', message: '<em>/<i> 는 렌더러에 기울임이 없어 일반 글자로 나온다.', warn: true });
  if (usedBreak) issues.push({ code: 'line-break', message: '<br> 는 공백으로 바뀐다. 줄을 나누려면 문단(<p>)을 나눈다.', warn: true });
  return { meta, title, subtitle, h1Count, markdown, headings, links, images, issues };
}

const chars = (s) => Array.from(s).length;
export const isInternal = (href) => href.startsWith('/') || href.startsWith(SITE) || href.startsWith('#');
const FAQ_HEADING = /^(#{2,3})\s*(FAQ|Q\s*&\s*A|자주\s*묻는\s*질문|자주묻는질문)\s*$/i;

/** FAQ 섹션이 사이트의 splitContentAndFaq 로 파싱되는 형태인지: ## FAQ 아래 ### 질문 + 답 문단 */
export function checkFaq(markdown) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((l) => FAQ_HEADING.test(l.trim()));
  if (start < 0) return { present: false, pairs: 0, ok: true };
  const level = lines[start].trim().match(FAQ_HEADING)[1].length;
  let pairs = 0;
  let q = null;
  let answered = false;
  let ok = true;
  for (const raw of lines.slice(start + 1)) {
    const line = raw.trim();
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h && h[1].length <= level) break;
    if (h && h[1].length === level + 1) {
      if (q && !answered) ok = false;
      if (q && answered) pairs += 1;
      q = h[2];
      answered = false;
    } else if (line) {
      if (!q) ok = false;
      else answered = true;
    }
  }
  if (q && answered) pairs += 1;
  else if (q) ok = false;
  return { present: true, pairs, ok: ok && pairs > 0 };
}

/** 오프라인 검사. online 결과(링크·중복)는 lintOnline 이 같은 report 에 덧붙인다. */
export function lintDraft(draft, { baseDir = process.cwd(), fileExists = (p) => fs.existsSync(p), fileSize = (p) => fs.statSync(p).size } = {}) {
  const t = rules.thresholds;
  const errors = [];
  const warnings = [];
  const err = (code, message) => errors.push({ code, message });
  const warn = (code, message) => warnings.push({ code, message });
  const { meta, title, markdown, headings, links, images } = draft;

  for (const i of draft.issues) (i.warn ? warn : err)(i.code, i.message);

  const slug = meta.slug ?? '';
  if (!slug) err('slug-missing', '<meta name="slug"> 가 없다.');
  else {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err('slug-format', `슬러그는 소문자·숫자·하이픈만 쓴다: "${slug}"`);
    if (slug.length < 3 || slug.length > 200) err('slug-length', '슬러그는 3~200자.');
    if (slug.length > 60) warn('slug-long', '슬러그가 60자를 넘는다. 짧을수록 좋다.');
    if (/^(naver|jp)-/.test(slug)) err('slug-reserved', '"naver-", "jp-" 접두어는 noindex·제외 규칙에 걸려 쓸 수 없다.');
  }
  if (!rules.categories.includes(meta.category)) err('category', `category 는 ${rules.categories.join('/')} 중 하나여야 한다(받은 값: "${meta.category ?? ''}").`);

  const keyword = meta.keyword ?? '';
  if (!keyword) err('keyword-missing', '<meta name="keyword"> (핵심 키워드 1개)가 없다.');

  if (draft.h1Count !== 1) err('h1-count', `<h1> 은 정확히 1개여야 한다(현재 ${draft.h1Count}개).`);
  if (!title) err('title-missing', '제목(<h1>)이 비었다.');
  if (chars(title) > 200) err('title-length', '제목은 200자 이하.');

  const metaTitle = meta['title-tag'] || title;
  if (chars(metaTitle) > t.metaTitleMax) err('meta-title-length', `검색결과 제목은 ${t.metaTitleMax}자 이하(현재 ${chars(metaTitle)}자). <meta name="title-tag"> 로 짧은 제목을 따로 준다.`);

  const description = meta.description ?? '';
  if (!description) err('description-missing', '<meta name="description"> 이 없다.');
  else {
    if (chars(description) > t.metaDescriptionMax) err('description-length', `설명은 ${t.metaDescriptionMax}자 이하(현재 ${chars(description)}자).`);
    if (chars(description) < t.metaDescriptionMin) warn('description-short', `설명이 ${t.metaDescriptionMin}자보다 짧다(현재 ${chars(description)}자).`);
  }
  if (draft.subtitle && chars(draft.subtitle) > 300) err('subtitle-length', '부제는 300자 이하.');

  // 구조
  const h2 = headings.filter((h) => h.level === 2);
  if (h2.length === 0) err('h2-missing', '<h2> 소제목이 하나도 없다.');
  else if (h2.length < 2) warn('h2-few', '<h2> 가 1개뿐이다. 2개 이상으로 나누면 훑어 읽기와 발췌 노출에 유리하다.');
  const firstH3 = headings.findIndex((h) => h.level === 3);
  if (firstH3 >= 0 && !headings.slice(0, firstH3).some((h) => h.level === 2)) err('heading-skip', '<h3> 앞에 <h2> 가 없다(제목 계층 건너뜀).');

  // 키워드 배치
  if (keyword) {
    const has = (s) => s.includes(keyword);
    if (!has(metaTitle) && !has(title)) err('keyword-title', `핵심 키워드 "${keyword}" 가 제목에 없다.`);
    if (!has(description)) warn('keyword-description', '설명에 핵심 키워드가 없다.');
    const firstPara = markdown.split('\n\n').find((b) => !/^(#|!\[|>|-|\d+\.|\|)/.test(b)) ?? '';
    if (!has(firstPara)) warn('keyword-intro', '첫 문단에 핵심 키워드가 없다.');
    if (!h2.some((h) => has(h.text))) warn('keyword-h2', '<h2> 중 핵심 키워드를 담은 것이 없다.');
    const count = markdown.split(keyword).length - 1;
    const density = (count * chars(keyword) * 100) / Math.max(1, chars(markdown));
    if (density > t.keywordDensityWarnPercent) warn('keyword-stuffing', `핵심 키워드 밀도 ${density.toFixed(1)}% (${count}회). 과하면 스팸 신호다.`);
  }

  // 분량
  const bodyChars = chars(markdown.replace(/\s+/g, ''));
  if (bodyChars < t.bodyCharsError) err('thin-content', `본문이 너무 짧다(공백 제외 ${bodyChars}자, 최소 ${t.bodyCharsError}자). 얇은 글은 색인되지 않는다.`);
  else if (bodyChars < t.bodyCharsWarn) warn('short-content', `본문 ${bodyChars}자. ${t.bodyCharsWarn}자 이상이면 안정적이다.`);

  // 링크
  const internal = links.filter((l) => isInternal(l.href) && !l.href.startsWith('#'));
  const external = links.filter((l) => !isInternal(l.href));
  if (internal.length < t.internalLinksError) err('internal-links', `내부 링크가 ${internal.length}개다. 최소 ${t.internalLinksError}개(고아 페이지 방지).`);
  else if (internal.length < t.internalLinksWarn) warn('internal-links-few', `내부 링크 ${internal.length}개. ${t.internalLinksWarn}개 이상 권장.`);
  if (external.length > t.externalLinksWarn) warn('external-links-many', `외부 링크가 ${external.length}개다.`);
  for (const l of links) {
    if (!l.href) err('link-empty', `href 없는 링크: "${l.text}"`);
    else if (l.href.startsWith('http:')) err('link-http', `http 링크: ${l.href}`);
    else if (/^(javascript|data):/i.test(l.href)) err('link-scheme', `허용되지 않는 링크: ${l.href}`);
    if (l.href && !l.text) err('link-text', `링크 글자가 비었다: ${l.href}`);
  }
  if (internal.some((l) => l.href.replace(SITE, '').replace(/\/+$/, '') === `/blog/${slug}`)) warn('self-link', '자기 자신으로 가는 링크가 있다.');

  // 이미지
  const ogImage = meta['og:image'] ?? '';
  if (!ogImage) warn('og-image', '<meta property="og:image"> 가 없다. 서버 기본 썸네일(sometime-story.png)로 나간다.');
  for (const src of [ogImage, ...images.map((i) => i.src)].filter(Boolean)) {
    if (/^https:\/\//.test(src)) continue;
    if (/^(http:|\/\/|data:|\/)/.test(src)) {
      err('image-src', `이미지 주소를 쓸 수 없다(https 또는 로컬 파일만): ${src}`);
      continue;
    }
    const file = path.resolve(baseDir, src);
    if (!fileExists(file)) err('image-missing', `로컬 이미지 파일이 없다: ${src}`);
    else {
      if (!/\.(png|jpe?g|webp|gif)$/i.test(file)) err('image-type', `이미지 형식은 PNG/JPG/WEBP/GIF: ${src}`);
      const size = fileSize(file);
      if (size > 10 * 1024 * 1024) err('image-size', `이미지가 10MB 를 넘는다: ${src}`);
      else if (size > t.imageBytesWarn) warn('image-heavy', `이미지 ${(size / 1024).toFixed(0)}KB: ${src} (성능을 위해 ${t.imageBytesWarn / 1000}KB 이하 권장)`);
    }
  }
  for (const img of images) if (!img.alt) err('image-alt', `alt 가 없는 이미지: ${img.src}`);
  if (images.length) warn('image-frame', '본문 이미지는 사이트에서 3:4 틀(object-contain) 안에 나온다. 가로 이미지는 여백이 생긴다.');

  // FAQ
  const faq = checkFaq(markdown);
  if (!faq.present) warn('faq-missing', 'FAQ 섹션(## 자주 묻는 질문 아래 ### 질문 + 답)이 없다. 넣으면 FAQPage 구조화 데이터가 자동으로 붙는다.');
  else if (!faq.ok) err('faq-format', 'FAQ 섹션이 사이트 파서 형식이 아니다. "## 자주 묻는 질문" 아래 "### 질문" + 답 문단으로 쓴다(그렇지 않으면 FAQPage 가 생성되지 않는다).');
  else if (faq.pairs < 2) warn('faq-few', `FAQ 가 ${faq.pairs}개다. 3개 이상 권장.`);

  // 사실성·정책 규칙
  const haystack = [title, draft.subtitle, description, markdown].join('\n');
  for (const rule of rules.banned) {
    const m = haystack.match(new RegExp(rule.pattern, 'i'));
    if (m) (rule.level === 'error' ? err : warn)('claim', `"${m[0]}" — ${rule.reason}`);
  }

  return {
    errors,
    warnings,
    info: { slug, keyword, metaTitle, metaTitleChars: chars(metaTitle), descriptionChars: chars(description), bodyChars, h2: h2.length, internalLinks: internal.length, externalLinks: external.length, images: images.length, faqPairs: faq.pairs },
  };
}

const bigrams = (s) => {
  const t = s.replace(/\s+/g, '');
  const set = new Set();
  for (let i = 0; i < t.length - 1; i += 1) set.add(t.slice(i, i + 2));
  return set;
};
export const jaccard = (a, b) => {
  const A = bigrams(a);
  const B = bigrams(b);
  let hit = 0;
  for (const x of A) if (B.has(x)) hit += 1;
  return hit / Math.max(1, A.size + B.size - hit);
};

/** 온라인 검사: 내부 링크 실재, 같은 키워드의 기존 글(카니발라이제이션) */
export async function lintOnline(draft, report, { fetchImpl = fetch, api = 'https://api.some-in-univ.com/api' } = {}) {
  const err = (code, message) => report.errors.push({ code, message });
  const warn = (code, message) => report.warnings.push({ code, message });
  const internal = [...new Set(draft.links.map((l) => l.href).filter((h) => isInternal(h) && !h.startsWith('#')))];
  await Promise.all(
    internal.map(async (href) => {
      const url = href.startsWith('/') ? SITE + href : href;
      try {
        const res = await fetchImpl(url, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(20000) });
        if (res.status >= 300) err('link-dead', `내부 링크가 ${res.status} 를 돌려준다: ${href}`);
      } catch (e) {
        err('link-dead', `내부 링크를 열지 못했다: ${href} (${e instanceof Error ? e.message : e})`);
      }
    }),
  );

  const existing = [];
  for (let page = 1; page <= 10; page += 1) {
    const res = await fetchImpl(`${api}/sometime-articles?limit=50&page=${page}`, { headers: { 'X-Country': 'kr' }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`기존 글 목록 조회 실패: HTTP ${res.status}`);
    const json = await res.json();
    const items = json.items ?? json.data?.items ?? [];
    existing.push(...items);
    if (items.length < 50) break;
  }
  const slug = draft.meta.slug;
  report.info.existingArticles = existing.length;
  if (existing.some((a) => a.slug === slug)) report.info.slugExists = true;
  const indexable = existing.filter((a) => !/^(naver|jp)-/.test(a.slug) && a.slug !== slug);
  const keyword = draft.meta.keyword ?? '';
  for (const a of indexable) {
    const sameKeyword = keyword && (a.title.includes(keyword) || (a.seo?.keywords ?? []).includes(keyword));
    const similar = jaccard(draft.title, a.title);
    if (sameKeyword || similar >= 0.5) {
      warn('cannibalization', `비슷한 기존 글: /blog/${a.slug} "${a.title}" (${sameKeyword ? '같은 키워드' : `제목 유사도 ${(similar * 100).toFixed(0)}%`}). 같은 검색 의도면 새 글 대신 보강을 검토한다.`);
    }
  }
  return report;
}

/** 서버로 보낼 본문. 이미지 주소는 업로드가 끝난 값(imageMap)으로 바꾼다. */
export function buildPayload(draft, { publish, nowIso, imageMap = {}, author = rules.defaultAuthor }) {
  const sub = (s) => imageMap[s] ?? s;
  const markdown = draft.markdown.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (_, alt, src) => `![${alt}](${sub(src)})`);
  const ogImage = draft.meta['og:image'] ? sub(draft.meta['og:image']) : undefined;
  const extra = (draft.meta.keywords ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const keywords = [...new Set([draft.meta.keyword, ...extra])].slice(0, 7);
  return {
    slug: draft.meta.slug,
    status: publish ? 'published' : 'draft',
    category: draft.meta.category,
    title: draft.title,
    ...(draft.subtitle ? { subtitle: draft.subtitle } : {}),
    content: markdown,
    excerpt: draft.meta.description.slice(0, 500),
    ...(ogImage ? { thumbnail: { type: 'image', url: ogImage, alt: draft.title } } : {}),
    author: { ...author, ...(draft.meta.author ? { name: draft.meta.author } : {}) },
    seo: {
      metaTitle: draft.meta['title-tag'] || draft.title,
      metaDescription: draft.meta.description,
      ...(ogImage ? { ogImage } : {}),
      keywords,
    },
    // 이미 발행일이 있는 글을 고칠 때는 nowIso 를 넘기지 않아 발행일을 보존한다.
    ...(publish && nowIso ? { publishedAt: nowIso } : {}),
  };
}

/** 초안의 키워드 계열(핵심 + 보조)과 겹치는 Search Console 검색어를 이미 받고 있는 URL 을 모은다. */
export function draftPhrases(draft) {
  const extra = (draft.meta.keywords ?? '').split(',').map((x) => x.trim());
  return [...new Set([draft.meta.keyword, ...extra].filter((x) => x && chars(x) >= 3))];
}

export function parseGscCsv(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.match(/^(.*),(https?:\/\/[^,]*),(\d+),(\d+),([\d.]+),([\d.]+)\s*$/))
    .filter(Boolean)
    .map((m) => ({ query: m[1].replace(/^"|"$/g, ''), page: m[2], clicks: +m[3], impressions: +m[4], position: +m[6] }));
}

export function findGscOverlap(rows, phrases, slug) {
  const self = `/blog/${slug}`;
  const byPage = new Map();
  for (const r of rows) {
    const hit = phrases.find((p) => r.query.includes(p));
    if (!hit) continue;
    let pathname = r.page;
    try {
      pathname = decodeURIComponent(new URL(r.page).pathname);
    } catch {
      /* 주소를 해석 못 하면 원문 그대로 비교한다 */
    }
    if (pathname === self) continue;
    const e = byPage.get(r.page) ?? { page: r.page, impressions: 0, clicks: 0, queries: [] };
    e.impressions += r.impressions;
    e.clicks += r.clicks;
    e.queries.push(r);
    byPage.set(r.page, e);
  }
  return [...byPage.values()].sort((a, b) => b.impressions - a.impressions);
}

/** level=error 규칙에 걸리는 문구인지(키워드 후보에서 제외할 때 쓴다). */
export function violatesErrorClaim(text) {
  return rules.banned.some((r) => r.level === 'error' && new RegExp(r.pattern, 'i').test(text));
}
