import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import CardNewsPage from "../card-news/[id]/page";
import { normalizeSectionRichText } from "./section-richtext";

// Actual first slide content from 019bd9ab-87a2-71d8-8f1e-9b3c884d19d6.
const importedHtml = '<p><strong>"혹시 아는 사람 만날까 봐..." </strong>망설였던 적 있으시죠?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p>&nbsp;이 걱정, 너무 잘 알아요</p><p>이제 마음 졸이지 마세요. 여러분의 사생활은 소중하니까요.</p><p><br></p>';

test("actual imported HTML retains all text and paragraph boundaries without entity-only gaps", () => {
  const text = normalizeSectionRichText(importedHtml);
  assert.notEqual(text, null);
  assert.equal(text!.split("\n\n").length, 3);
  assert.doesNotMatch(text!, /<\/?(?:p|strong|br)\b|&nbsp;|\u00a0/);
  // Compare source-derived text, not a pinned prose expectation.
  assert.equal(text!.replace(/\s/g, ""), importedHtml.replace(/<[^>]*>|&nbsp;|\s/g, ""));
});

test("HTML decoding preserves literal text and distinguishes breaks from paragraphs", () => {
  assert.equal(normalizeSectionRichText('<p>A_SENTINEL<strong>B_SENTINEL</strong><br>C_SENTINEL</p><p>&amp;&nbsp;&quot;&#39;&#x1f49c;&lt;tag&gt;</p>'), 'A_SENTINELB_SENTINEL\nC_SENTINEL\n\n& "\'💜<tag>');
  assert.equal(normalizeSectionRichText('<div>A_SENTINEL<div>B_SENTINEL</div>C_SENTINEL</div>'), 'A_SENTINEL\n\nB_SENTINEL\n\nC_SENTINEL');
});

test("executable, style and embedded subtrees are discarded without running them", () => {
  const source = '<p>A_SENTINEL</p><script>throw new Error("SCRIPT_SENTINEL")</script><style>STYLE_SENTINEL</style><iframe srcdoc="IFRAME_SENTINEL">FRAME_SENTINEL</iframe><svg><text>SVG_SENTINEL</text></svg><object>OBJECT_SENTINEL</object><template>TEMPLATE_SENTINEL</template><!--COMMENT_SENTINEL--><p onclick="EVENT_SENTINEL">B_SENTINEL</p>';
  assert.equal(normalizeSectionRichText(source), 'A_SENTINEL\n\nB_SENTINEL');
});

test("ordinary Markdown, code samples and autolinks bypass normalization unchanged", () => {
  for (const source of ['# HEADING\n\n**BOLD** &amp; TEXT', '[LINK](/path)\n\n![IMAGE](/asset.png)', '```html\n<p>CODE_SENTINEL</p>\n```', '`<strong>CODE_SENTINEL</strong>`', '<https://example.test>', 'TEXT <strong>INLINE_SENTINEL</strong>']) {
    assert.equal(normalizeSectionRichText(source), null);
  }
});

test("real section rendering handles body and content safely while retaining original images and Markdown", async (t) => {
  const id = '019bd9ab-87a2-71d8-8f1e-9b3c884d19d6';
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({
    id, title: 'TITLE_SENTINEL', sections: [
      { content: importedHtml, imageUrl: 'https://example.test/portrait.png' },
      { body: '<p>**LITERAL_SENTINEL** &lt;img src=x onerror=alert(1)&gt;</p><script>SCRIPT_SENTINEL</script><p>TAIL_SENTINEL<br>BREAK_SENTINEL</p>' },
      { body: '**MARKDOWN_SENTINEL**' },
    ],
  }), { headers: { 'Content-Type': 'application/json' } }));
  const html = renderToStaticMarkup(<PathnameContext.Provider value="/card-news">{await CardNewsPage({ params: Promise.resolve({ id }) })}</PathnameContext.Provider>);
  assert.doesNotMatch(html, /&lt;\/?(?:p|strong|br)&gt;|&amp;nbsp;|SCRIPT_SENTINEL|<script>\s*SCRIPT_SENTINEL/);
  assert.ok(html.includes('**LITERAL_SENTINEL** &lt;img src=x onerror=alert(1)&gt;'));
  assert.match(html, /<p>TAIL_SENTINEL<br\s*\/>BREAK_SENTINEL<\/p>/);
  assert.ok(html.includes('<strong>MARKDOWN_SENTINEL</strong>'));
  assert.ok(html.includes('href="https://example.test/portrait.png"'));
  assert.ok(html.includes('object-fit:contain'));
});
