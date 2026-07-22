import assert from "node:assert/strict";
import test from "node:test";
import {
  getStaticSitemapLastmod,
  maxLastmod,
  resolveContentLastmod,
  STATIC_SITEMAP_LASTMOD,
  UNIVERSITY_SITEMAP_LIMIT,
  UNIVERSITY_SITEMAP_MIN_VERIFIED_COUNT,
} from "./sitemap-helpers";

test("static sitemap dates are explicit stable content versions", () => {
  assert.equal(STATIC_SITEMAP_LASTMOD["/download"], "2026-07-22T18:03:42.000Z");
  assert.equal(STATIC_SITEMAP_LASTMOD["/university"], "2026-07-22T17:33:19.000Z");
  assert.equal(UNIVERSITY_SITEMAP_LIMIT, 18);
  assert.equal(UNIVERSITY_SITEMAP_MIN_VERIFIED_COUNT, 20);
});

test("resolveContentLastmod prefers updatedAt over publishedAt", () => {
  const date = resolveContentLastmod({
    updatedAt: "2026-07-20T04:00:00.000Z",
    publishedAt: "2026-07-18T04:00:00.000Z",
    fallback: getStaticSitemapLastmod("/blog"),
  });

  assert.equal(date.toISOString(), "2026-07-20T04:00:00.000Z");
});

test("resolveContentLastmod falls back to publishedAt when updatedAt is missing", () => {
  const date = resolveContentLastmod({
    updatedAt: null,
    publishedAt: "2026-07-18T04:00:00.000Z",
    fallback: getStaticSitemapLastmod("/blog"),
  });

  assert.equal(date.toISOString(), "2026-07-18T04:00:00.000Z");
});

test("maxLastmod returns the latest valid candidate", () => {
  const latest = maxLastmod(
    "2026-07-18T04:00:00.000Z",
    null,
    getStaticSitemapLastmod("/faq"),
    "2026-07-21T12:30:00.000Z",
  );

  assert.ok(latest);
  assert.equal(latest?.toISOString(), "2026-07-21T12:30:00.000Z");
});
