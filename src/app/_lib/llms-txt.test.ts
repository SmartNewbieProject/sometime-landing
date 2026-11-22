import assert from "node:assert/strict";
import test from "node:test";
import { buildLlmsFullTxt, buildLlmsTxt } from "./llms-txt";
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

test("llms.txt drops operational policy/terms notices by title and includes satellite hubs", () => {
  const text = buildLlmsTxt({
    articles: [],
    cardNews: [
      { id: "policy-1", title: "개인정보처리방침이 바뀌어요 (12월 2일 시행)", publishedAt: "2026-11-18T00:00:00Z" },
      { id: "editorial-2", title: "썸타임 데이터 리포트", publishedAt: "2026-11-18T00:00:00Z" },
    ],
  });

  assert.ok(!text.includes("policy-1"));
  assert.ok(text.includes("/card-news/editorial-2"));
  assert.ok(text.includes("https://some-in-univ.com/rotation"));
  assert.ok(text.includes("https://some-in-univ.com/sajuniv"));
  assert.ok(text.includes("https://some-in-univ.com/feed.xml"));
  assert.ok(text.includes("https://some-in-univ.com/llms-full.txt"));
});

test("llms-full.txt includes full feature sections and FAQs for GEO ingestion", () => {
  const full = buildLlmsFullTxt({ articles: [], cardNews: [] });
  assert.ok(full.includes("# 주요 서비스 상세 안내 (Full Context)"));
  assert.ok(full.includes("https://some-in-univ.com/korea-japan-matching"));
  assert.ok(full.includes("https://some-in-univ.com/block-acquaintances"));
  assert.ok(full.includes("일본어를 못해도 썸타임 한일 매칭을 이용할 수 있나요?"));
  assert.ok(full.includes("지인 차단을 쓰면 내 연락처가 서버에 그대로 저장되나요?"));
});
