import assert from "node:assert/strict";
import { test } from "node:test";
import { markdownToHtml } from "../_components/public-content/MarkdownBody";
import { splitContentAndFaq } from "./faq";
import { getBannerAlt, getBannerCaption, getBannerDimensions } from "./banner-a11y";

test("FAQ extraction preserves following sections, links and images", () => {
  const tail = "## NEXT_SENTINEL\n\n[link](/next)\n\n![asset](/image.png)";
  const result = splitContentAndFaq(`INTRO_SENTINEL\n\n## FAQ\n\n### Q_SENTINEL\n\nA_SENTINEL\n\n${tail}`);
  assert.equal(result.faqs.length, 1);
  assert.equal(result.faqs[0].answer, "A_SENTINEL");
  assert.ok(result.body.endsWith(tail));
});

test("FAQ supports nested section levels and stops at a peer heading", () => {
  const result = splitContentAndFaq("### FAQ\n#### Q_SENTINEL\nA_SENTINEL\n### NEXT_SENTINEL\nTAIL_SENTINEL");
  assert.equal(result.faqs.length, 1);
  assert.ok(result.body.includes("TAIL_SENTINEL"));
  assert.ok(!result.faqs[0].answer.includes("TAIL_SENTINEL"));
});

test("unparseable FAQ and empty answers never delete source content", () => {
  for (const source of ["## FAQ\nUNSTRUCTURED_SENTINEL", "## FAQ\n### EMPTY_SENTINEL\n## END"]) {
    assert.equal(splitContentAndFaq(source).body, source);
  }
});

test("FAQ-like headings in fenced code are not extracted", () => {
  const source = "```md\n## FAQ\n### Q_SENTINEL\nA_SENTINEL\n```";
  assert.deepEqual(splitContentAndFaq(source), { body: source, faqs: [] });
});

test("relative, fragment and app-path links retain their destinations", () => {
  for (const href of ["/faq#photo", "../guide", "./guide", "guide/page", "#part", "?page=2", "/profile/photo-management?referrer=test"]) {
    assert.ok(markdownToHtml(`[LABEL](${href})`).includes(`href="${href}"`));
  }
});

test("custom buttons become semantic styled anchors, not raw tokens", () => {
  const html = markdownToHtml("[button:LABEL](/profile/photo-management?referrer=test)");
  assert.match(html, /<a [^>]*href="\/profile\/photo-management\?referrer=test"/);
  assert.match(html, /class="public-content-button/);
  assert.ok(!html.includes("button:LABEL"));
});

test("unsafe or invalid destinations cannot become anchors or images", () => {
  for (const href of ["javascript:alert(1)", "data:text/html,evil", "//evil.test", "/\\evil.test", "/%5cevil.test", "/%2fevil.test", "/%0aevil", "/bad%zz", "https://", "/path with space"]) {
    assert.ok(!markdownToHtml(`[button:LABEL](${href})`).includes("<a "), href);
    assert.ok(!markdownToHtml(`![ALT](${href})`).includes("<img "), href);
  }
});

test("inline syntax escapes attributes once and never parses inside generated HTML", () => {
  const html = markdownToHtml('[A & B](https://example.test/?a=1&b=2) ![A " B](/image.png) `<script>`');
  assert.ok(html.includes('href="https://example.test/?a=1&amp;b=2"'));
  assert.ok(html.includes('alt="A &quot; B"'));
  assert.ok(!html.includes("&amp;quot;"));
  assert.ok(!html.includes("<script>"));
  assert.ok(markdownToHtml('`[button:LABEL](/path)`').includes("<code>[button:LABEL](/path)</code>"));
});

test("bare source URLs become concise actionable links", () => {
  const html = markdownToHtml("SOURCE: https://apps.apple.com/kr/app/%ED%95%9C/id123\n\nhttps://forms.gle/form-id");
  assert.equal((html.match(/<a /g) ?? []).length, 2);
  assert.ok(!html.replace(/<[^>]*>/g, "").includes("%ED%95%9C"));
});

test("separators and empty blockquote markers are not prose", () => {
  const html = markdownToHtml("A\n\n---\n\n>\n\nB");
  assert.ok(html.includes("<hr />"));
  assert.ok(!html.includes("<p>---</p>"));
  assert.ok(!html.includes("&gt;"));
});

test("article body heading hierarchy never creates a second h1", () => {
  const html = markdownToHtml("# H1_SENTINEL\n## H2_SENTINEL\n### H3_SENTINEL");
  assert.ok(!html.includes("<h1>"));
  assert.ok(html.includes("<h2>H1_SENTINEL</h2>"));
  assert.ok(html.includes("<h3>H2_SENTINEL</h3>"));
  assert.ok(html.includes("<h4>H3_SENTINEL</h4>"));
});

test("inline media retains alt and links to its original for enlargement", () => {
  const html = markdownToHtml("![ALT_SENTINEL](/portrait.png)");
  assert.ok(html.includes('href="/portrait.png"'));
  assert.ok(html.includes('target="_blank"'));
  assert.ok(html.includes('alt="ALT_SENTINEL"'));
  assert.ok(html.includes("aspect-ratio:3/4"));
  assert.ok(html.includes("object-fit:contain"));
});

test("table data survives and its horizontal scroller is keyboard reachable", () => {
  const html = markdownToHtml("| A | B |\n| --- | --- |\n| 1 | 2 |");
  assert.equal((html.match(/<td /g) ?? []).length, 2);
  assert.ok(html.includes('tabindex="0"'));
  assert.ok(html.includes('role="region"'));
  assert.ok(html.includes('aria-label="'));
});

test("manual decorative alt stays empty and descriptions are not recycled as captions", () => {
  assert.equal(getBannerAlt("TITLE_SENTINEL", ""), "");
  assert.equal(getBannerCaption({ excerpt: "EXCERPT_SENTINEL", subtitle: "SUBTITLE_SENTINEL" }), null);
});

test("source dimensions are preserved and invalid metadata never reserves an invalid ratio", () => {
  assert.deepEqual(getBannerDimensions({ width: 320, height: 640 }), { width: 320, height: 640 });
  assert.deepEqual(getBannerDimensions({ width: 0, height: 640 }), {});
  assert.deepEqual(getBannerDimensions({ width: Number.NaN, height: 640 }), {});
});
