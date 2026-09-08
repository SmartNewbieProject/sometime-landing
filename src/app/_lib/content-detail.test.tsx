import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import CardNewsPage, { generateMetadata } from "../card-news/[id]/page";
import CommunityPage from "../community/[id]/page";
import BlogPage from "../blog/[slug]/page";
import { NAVER_TABLE_RECOVERIES } from "./naver-table-recovery";
import { ContentMedia } from "../_components/public-content/ContentMedia";

function renderDetail(element: ReactNode) {
  return renderToStaticMarkup(<PathnameContext.Provider value="/card-news">{element}</PathnameContext.Provider>);
}

test("confirmed duplicate has a permanent canonical redirect", async () => {
  await assert.rejects(CardNewsPage({ params: Promise.resolve({ id: "518873ef-fe1e-4f6c-994c-f1b542544a82" }) }), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.ok("digest" in error);
    assert.ok(String(error.digest).includes("/card-news/019fef4b-e4d8-7f40-aa12-00d7fb0b649f;308;"));
    return true;
  });
});

test("detail media reserves supplied proportions or a stable contain frame, never zero dimensions", () => {
  const known = renderDetail(<ContentMedia src="https://example.test/image.png" fill={false} width={320} height={640} />);
  const unknown = renderDetail(<ContentMedia src="https://example.test/image.png" fill={false} />);
  assert.ok(known.includes("aspect-ratio:320 / 640"));
  assert.ok(unknown.includes("aspect-ratio:3 / 4"));
  for (const html of [known, unknown]) {
    assert.ok(html.includes("object-fit:contain"));
    assert.ok(!html.includes('width="0"'));
    assert.ok(!html.includes('height="0"'));
  }
});

test("actual detail pages retain all source blocks, archive dates and uncropped media", async (t) => {
  let payload: Record<string, unknown> = {};
  const requests: string[] = [];
  t.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
    requests.push(String(input));
    return new Response(JSON.stringify(payload), { headers: { "Content-Type": "application/json" } });
  });

  payload = {
    id: "01a06231-88c0-78c6-845c-f1806bb15ebb", title: "TITLE_SENTINEL", layoutMode: "longform", publishedAt: null,
    body: "# TITLE_SENTINEL\n\nBODY_SENTINEL\n\n## FAQ\n\n### QUESTION_SENTINEL\n\nANSWER_SENTINEL\n\n## TAIL_SENTINEL\n\n[button:ACTION_SENTINEL](/profile/photo-management)",
    sections: [{ order: 0, content: "SECTION_SENTINEL", imageUrl: "https://example.test/portrait.png" }],
  };
  const card = renderDetail(await CardNewsPage({ params: Promise.resolve({ id: String(payload.id) }) }));
  assert.equal((card.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(card.includes('data-content-archive="true"'));
  assert.ok(card.includes('dateTime="2026-09-05"'));
  for (const sentinel of ["BODY_SENTINEL", "ANSWER_SENTINEL", "TAIL_SENTINEL", "SECTION_SENTINEL"]) assert.ok(card.includes(sentinel));
  assert.ok(card.includes('href="/profile/photo-management"'));
  assert.ok(card.includes('href="https://example.test/portrait.png"'));
  assert.ok(card.includes("object-fit:contain"));
  assert.ok(card.includes("aspect-ratio:3 / 4"));
  assert.ok(!card.includes("landing_content_detail"));

  payload = { id: "019fef4b-e4d8-7f40-aa12-00d7fb0b649f", title: "TITLE_SENTINEL", body: "BODY_SENTINEL" };
  const metadata = await generateMetadata({ params: Promise.resolve({ id: "518873ef-fe1e-4f6c-994c-f1b542544a82" }) });
  assert.ok(String(metadata.alternates?.canonical).endsWith(`/card-news/${payload.id}`));
  assert.ok(requests.at(-1)?.endsWith(`/card-news/${payload.id}`));

  payload = { id: "COMMUNITY_SENTINEL", title: "TITLE_SENTINEL", content: "BODY_SENTINEL", publishedAt: null, images: [{ imageUrl: "https://example.test/portrait.png" }] };
  const community = renderDetail(await CommunityPage({ params: Promise.resolve({ id: String(payload.id) }) }));
  assert.ok(!community.includes("<time"));
  assert.ok(community.includes('alt="TITLE_SENTINEL'));
  assert.ok(community.includes('href="/stories"'));

  const slug = "naver-224335480066";
  payload = { id: "BLOG_SENTINEL", slug, title: "TITLE_SENTINEL", category: "tips", content: `${NAVER_TABLE_RECOVERIES[slug].tables[0].heading}\n\n## TAIL_SENTINEL\nBODY_SENTINEL`, publishedAt: null };
  const blog = renderDetail(await BlogPage({ params: Promise.resolve({ slug }) }));
  assert.ok(blog.includes("<table>"));
  assert.ok(blog.includes("TAIL_SENTINEL"));
  assert.ok(!blog.includes("<time"));
});
