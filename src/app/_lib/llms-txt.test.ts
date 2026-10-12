import assert from "node:assert/strict";
import test from "node:test";
import { buildLlmsTxt } from "./llms-txt";
import type { CardNews, SometimeArticleListItem } from "./public-content";

function article(slug: string, publishedAt: string | null): SometimeArticleListItem {
  return {
    id: slug,
    slug,
    status: "published",
    category: "story",
    title: `글 ${slug}`,
    subtitle: null,
    excerpt: "요약\n두 줄",
    publishedAt,
    updatedAt: null,
  };
}

test("llms.txt lists only indexable blog posts, newest first", () => {
  const text = buildLlmsTxt({
    articles: [
      article("old", "2026-08-01T00:00:00Z"),
      article("naver-1", "2026-09-01T00:00:00Z"),
      article("jp-1", "2026-09-01T00:00:00Z"),
      article("draft", null),
      article("new", "2026-09-07T00:00:00Z"),
    ],
    cardNews: [],
  });

  assert.ok(text.startsWith("# 썸타임\n"));
  assert.ok(!text.includes("naver-1") && !text.includes("jp-1") && !text.includes("draft"));
  assert.ok(text.indexOf("/blog/new") < text.indexOf("/blog/old"));
  assert.ok(text.includes("- [글 new](https://some-in-univ.com/blog/new): 요약 두 줄"));
  assert.ok(!text.includes("## 카드뉴스"));
});

test("llms.txt keeps editorial card-news and drops notices, campaigns and duplicates", () => {
  const card = (id: string): CardNews => ({ id, title: id, publishedAt: "2026-09-01T00:00:00Z" });
  const text = buildLlmsTxt({
    articles: [],
    cardNews: [
      card("editorial-id"),
      card("01a0122f-ad89-7163-b359-4c4e49ae3ba0"), // notice
      card("01a06231-88c0-78c6-845c-f1806bb15ebb"), // campaign
      card("518873ef-fe1e-4f6c-994c-f1b542544a82"), // duplicate of a canonical record
    ],
  });

  assert.ok(text.includes("/card-news/editorial-id"));
  assert.ok(!text.includes("01a0122f") && !text.includes("01a06231") && !text.includes("518873ef"));
});
