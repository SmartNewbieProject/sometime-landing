import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContentHome } from "./ContentHome";
import { contentSummary } from "../../_lib/content-presentation";
import BlogIndexPage, { generateMetadata as blogMetadata } from "../../blog/page";
import CardNewsIndexPage, { generateMetadata as cardMetadata } from "../../card-news/page";
import CommunityIndexPage, { generateMetadata as communityMetadata } from "../../community/page";
import {
  CONTENT_PAGE_SIZE,
  contentListHref,
  contentDisplayTitle,
  getContentListState,
  getCardNewsPreviews,
  getContentCategories,
  getContentPage,
  type ContentPreview,
} from "./content-list";

function fixture(count: number): ContentPreview[] {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index),
    href: `/blog/${index}`,
    title: String(index),
    description: "",
    image: "",
    label: index % 2 === 0 ? "tips" : "story",
    source: "story",
  }));
}

for (const count of [0, 1, 6, 10, 35, 45, 55]) {
  test(`pagination reaches every item once for a ${count}-item archive`, () => {
    const items = fixture(count);
    const first = getContentPage(items, { category: "", page: 1 });
    assert.equal(first.pageCount, Math.ceil(count / CONTENT_PAGE_SIZE));
    const visited: string[] = [];
    for (let page = 1; page <= first.pageCount; page += 1) {
      const result = getContentPage(items, { category: "", page });
      assert.equal(result.page, page);
      assert.ok(result.items.length <= CONTENT_PAGE_SIZE);
      assert.equal(result.start, (page - 1) * CONTENT_PAGE_SIZE);
      visited.push(...result.items.map((item) => item.id));
    }
    assert.deepEqual(visited, items.map((item) => item.id));
    assert.equal(new Set(visited).size, count);
  });
}

test("display titles split only source title separators and preserve unsplit titles", () => {
  for (const source of ["LEAD｜SUFFIX", " LEAD ｜ SUFFIX ｜ EXTRA", "LEAD | SUFFIX", "LEAD\t|\tSUFFIX"]) {
    assert.equal(contentDisplayTitle(source), "LEAD");
  }
  for (const source of ["LEAD|SUFFIX", "LEAD |SUFFIX", "UNSPLIT_SENTINEL", "｜SUFFIX", ""]) {
    assert.equal(contentDisplayTitle(source), source);
  }
});

test("list heading uses its compact display title while the link retains the source title", () => {
  const item = { ...fixture(1)[0], title: "LEAD_SENTINEL｜SUFFIX_SENTINEL" };
  const html = renderArchive([item], 1);
  assert.match(html, /<h2[^>]*>LEAD_SENTINEL<\/h2>/);
  assert.ok(html.includes(`aria-label="${item.title}"`));
  assert.ok(html.includes(`title="${item.title}"`));
  assert.equal(item.title, "LEAD_SENTINEL｜SUFFIX_SENTINEL");
});

test("categories expose only populated source labels and their exact counts", () => {
  assert.deepEqual(getContentCategories([]), []);
  assert.deepEqual(getContentCategories(fixture(7)), [
    { label: "tips", count: 4 },
    { label: "story", count: 3 },
  ]);
});

test("changing category resets the page and preserves source order", () => {
  const items = fixture(35);
  const state = getContentListState({ category: "story" });
  assert.deepEqual(state, { category: "story", page: 1 });
  const first = getContentPage(items, state);
  assert.equal(first.total, 17);
  assert.deepEqual(first.items.map((item) => item.id), ["1", "3", "5", "7", "9", "11"]);
  const nextUrl = new URL(contentListHref("/blog", { ...state, page: 2 }), "https://example.test");
  const nextState = getContentListState(Object.fromEntries(nextUrl.searchParams));
  assert.equal(nextState.category, "story");
  assert.deepEqual(getContentPage(items, nextState).items.map((item) => item.id), ["13", "15", "17", "19", "21", "23"]);
});

test("all-category selection restores all items after filtering", () => {
  const state = getContentListState({ category: "" });
  assert.deepEqual(state, { category: "", page: 1 });
  assert.equal(getContentPage(fixture(35), state).total, 35);
});

test("a shortened or empty list never leaves an unreachable page", () => {
  assert.deepEqual(getContentPage([], { category: "", page: 9 }), {
    items: [], page: 1, pageCount: 0, start: 0, total: 0,
  });
  const result = getContentPage(fixture(7), { category: "", page: 9 });
  assert.equal(result.page, 2);
  assert.deepEqual(result.items.map((item) => item.id), ["6"]);
});


test("untrusted page query values normalize to a valid first page", () => {
  for (const page of [undefined, "", "-1", "0", "1.5", "NaN", "Infinity", "9007199254740992", ["2", "3"]]) {
    assert.equal(getContentListState({ page }).page, 1);
  }
  assert.equal(getContentListState({ page: "2" }).page, 2);
  assert.equal(getContentListState({ category: ["tips", "story"] }).category, "");
});

test("pagination URLs retain encoded categories and omit the first-page default", () => {
  assert.equal(contentListHref("/blog", { category: "", page: 1 }), "/blog");
  assert.equal(contentListHref("/blog", { category: "", page: 2 }), "/blog?page=2");
  const state = { category: "A & B/학교", page: 3 };
  const url = new URL(contentListHref("/stories", state), "https://example.test");
  assert.deepEqual(getContentListState(Object.fromEntries(url.searchParams)), state);
});

function renderArchive(items: ContentPreview[], page: number, category = "") {
  return renderToStaticMarkup(createElement(ContentHome, {
    activeSource: "story", eyebrow: "E", title: "T", description: "D",
    path: "/blog", items, state: { page, category },
  }));
}

test("server HTML exposes every archive page and its actual article anchors without JavaScript", () => {
  const items = fixture(45);
  const visited: string[] = [];
  for (let page = 1; page <= 8; page += 1) {
    const html = renderArchive(items, page);
    const hrefs = [...html.matchAll(/href="(\/blog\/\d+)"/g)].map((match) => match[1]);
    visited.push(...hrefs);
    assert.ok(hrefs.length <= CONTENT_PAGE_SIZE);
    assert.match(html, /aria-current="page"/);
    if (page < 8) assert.ok(html.includes(`href="/blog?page=${page + 1}"`));
  }
  assert.deepEqual(visited, items.map((item) => item.href));
  assert.equal(new Set(visited).size, items.length);
});

test("the category form works through GET and resets page by omitting its parameter", () => {
  const html = renderArchive(fixture(35), 2, "tips");
  assert.match(html, /<form[^>]*action="\/blog"[^>]*method="get"/);
  assert.match(html, /<select[^>]*name="category"/);
  assert.ok(!html.includes('name="page"'));
  assert.ok(html.includes('href="/blog?category=tips&amp;page=3"'));
  assert.ok(!html.includes('value="safety"'));
});

test("page metadata self-canonicalizes paginated archives and does not index filtered facets", async () => {
  for (const [path, generate] of [["/blog", blogMetadata], ["/card-news", cardMetadata], ["/stories", communityMetadata]] as const) {
    const metadata = await generate({ searchParams: Promise.resolve({ page: "2" }) });
    assert.equal(metadata.alternates?.canonical, `https://some-in-univ.com${path}?page=2`);
    const filtered = await generate({ searchParams: Promise.resolve({ category: "tips" }) });
    assert.ok(filtered.robots && typeof filtered.robots === "object");
    assert.equal(filtered.robots.index, false);
  }
});

test("out-of-range archive requests redirect to the data-resolved canonical page", async (t) => {
  let count = 7;
  t.mock.method(globalThis, "fetch", async () => Response.json({
    items: Array.from({ length: count }, (_, index) => ({
      id: String(index), slug: String(index), title: String(index), category: "tips",
      author: { universityDetails: { name: "tips" } },
    })),
  }));

  for (const [path, render, generate] of [
    ["/blog", BlogIndexPage, blogMetadata],
    ["/card-news", CardNewsIndexPage, cardMetadata],
    ["/stories", CommunityIndexPage, communityMetadata],
  ] as const) {
    const category = path === "/card-news"
      ? getCardNewsPreviews([{ id: "0", title: "0" }])[0].label
      : "tips";
    for (const scenario of [
      { count: 7, category: "", page: 2 },
      { count: 7, category, page: 2 },
      { count: 0, category: "", page: 1 },
    ]) {
      count = scenario.count;
      const destination = contentListHref(path, scenario);
      await assert.rejects(
        render({ searchParams: Promise.resolve({ page: "999", category: scenario.category }) }),
        (error: unknown) => {
          assert.ok(error instanceof Error && "digest" in error);
          assert.equal(error.digest, `NEXT_REDIRECT;replace;${destination};307;`);
          return true;
        },
      );
      const query = new URL(destination, "https://some-in-univ.com").searchParams;
      const metadata = await generate({ searchParams: Promise.resolve(Object.fromEntries(query)) });
      assert.equal(metadata.alternates?.canonical, `https://some-in-univ.com${destination}`);
    }
  }
});

test("source-derived list summaries bound imported 490-character previews and remove markup", () => {
  const summary = contentSummary(`## ${"A B ".repeat(123)} ![ALT](/x.png)`);
  assert.ok(summary.length <= 140);
  assert.ok(!summary.includes("##"));
  assert.ok(!summary.includes("!["));
});

test("card-news aliases consolidate before category counts and pagination", () => {
  const alias = "518873ef-fe1e-4f6c-994c-f1b542544a82";
  const canonical = "019fef4b-e4d8-7f40-aa12-00d7fb0b649f";
  const items = getCardNewsPreviews([{ id: alias, title: "ALIAS" }, { id: canonical, title: "CANONICAL" }]);
  assert.deepEqual(items.map((item) => item.id), [canonical]);
  assert.deepEqual(items.map((item) => item.href), [`/card-news/${canonical}`]);
  assert.equal(getContentCategories(items)[0].count, 1);
  assert.equal(getContentPage(items, { category: "", page: 1 }).total, 1);
  assert.equal(getCardNewsPreviews([{ id: alias, title: "ALIAS" }])[0].href, `/card-news/${canonical}`);
});

test("archived card-news uses lifecycle dates without promoting source urgency", () => {
  const ids = ["01a06231-88c0-78c6-845c-f1806bb15ebb", "019fa76a-a7c3-76dc-8052-a1e5f8a7db61", "019f6480-13b3-7686-9630-5ba94d3b1a16"];
  const items = getCardNewsPreviews(ids.map((id) => ({ id, title: "URGENCY_SENTINEL", subtitle: "OFFER_SENTINEL" })));
  assert.deepEqual(items.map((item) => item.archive?.endedOn), ["2026-09-05", "2026-08-14", "2026-07-31"]);
  for (const item of items) {
    assert.notEqual(item.title, "URGENCY_SENTINEL");
    assert.equal(item.description, "");
  }
  const html = renderArchive(items.map((item) => ({ ...item, image: "" })), 1);
  assert.match(html, /dateTime="2026-09-05"/);
  assert.ok(!html.includes("URGENCY_SENTINEL"));
  assert.ok(!html.includes("OFFER_SENTINEL"));
});
