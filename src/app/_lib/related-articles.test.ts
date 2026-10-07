import assert from "node:assert/strict";
import test from "node:test";
import { pickRelatedArticles } from "./related-articles";
import type { SometimeArticleListItem } from "./public-content";

const article = (slug: string, category: string, publishedAt: string | null) =>
  ({ id: slug, slug, category, publishedAt }) as SometimeArticleListItem;

test("related articles prefer the same category, then newest, and exclude self, naver- mirrors, jp- and undated posts", () => {
  const list = [
    article("current", "tips", "2026-10-01T00:00:00Z"),
    article("naver-1", "tips", "2026-10-09T00:00:00Z"),
    article("jp-1", "tips", "2026-10-09T00:00:00Z"),
    article("draft", "tips", null),
    article("tips-old", "tips", "2026-08-01T00:00:00Z"),
    article("tips-new", "tips", "2026-09-01T00:00:00Z"),
    article("safety-new", "safety", "2026-10-05T00:00:00Z"),
    article("safety-old", "safety", "2026-07-01T00:00:00Z"),
  ];
  const slugs = pickRelatedArticles(list, { slug: "current", category: "tips" }).map((a) => a.slug);
  assert.deepEqual(slugs, ["tips-new", "tips-old", "safety-new"]);
});

test("related articles are empty when nothing else is published", () => {
  assert.deepEqual(pickRelatedArticles([article("only", "tips", "2026-10-01T00:00:00Z")], { slug: "only", category: "tips" }), []);
});
