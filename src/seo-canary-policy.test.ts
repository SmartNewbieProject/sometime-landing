import assert from "node:assert/strict";
import test from "node:test";
import {
  APEX_CANONICAL_ORIGIN,
  APEX_CANONICAL_STATIC_PATHS,
  getCanonicalRedirect,
  isApexCanonicalPath,
  isInternalRenderRequest,
  VERCEL_APP_RENDER_HOST,
} from "./seo-canary-policy";

test("all indexable public route families are apex canonical", () => {
  assert.deepEqual(APEX_CANONICAL_STATIC_PATHS, [
    "/",
    "/about",
    "/blog",
    "/card-news",
    "/stories",
    "/community-guidelines",
    "/download",
    "/faq",
    "/press",
    "/privacy/easy",
    "/safety",
    "/university",
    "/verification",
  ]);

  for (const path of [
    "/",
    "/about",
    "/blog/naver-224354328060",
    "/card-news/019fef9b-88cc-7a75-9294-4dbdd9d71d9c",
    "/community/019fef9b-88cc-7a75-9294-4dbdd9d71d9c",
    "/university/DJU",
    "/privacy/easy/",
  ]) {
    assert.equal(isApexCanonicalPath(path), true, path);
  }
});

test("app-only and non-indexable routes stay outside the SEO redirect set", () => {
  for (const path of [
    "/auth/login",
    "/community",
    "/community/love-court",
    "/community/write",
    "/event",
    "/event/summer",
    "/_next/static/chunk.js",
    "/images/intro.png",
    "/random-campus-keyword-page",
  ]) {
    assert.equal(isApexCanonicalPath(path), false, path);
  }
});

test("direct info requests redirect one hop and preserve public query parameters", () => {
  assert.equal(
    getCanonicalRedirect("info.some-in-univ.com", "/community", "?source=gsc"),
    `${APEX_CANONICAL_ORIGIN}/stories?source=gsc`,
  );
  assert.equal(
    getCanonicalRedirect("info.some-in-univ.com", "/blog/article", "?source=gsc"),
    `${APEX_CANONICAL_ORIGIN}/blog/article?source=gsc`,
  );
  assert.equal(
    getCanonicalRedirect("info.some-in-univ.com", "/", ""),
    `${APEX_CANONICAL_ORIGIN}/`,
  );
  assert.equal(
    getCanonicalRedirect("info.some-in-univ.com", "/sitemap.xml", ""),
    `${APEX_CANONICAL_ORIGIN}/sitemap.xml`,
  );
});

test("direct info requests cannot forge a proxy bypass marker", () => {
  assert.equal(
    getCanonicalRedirect(
      "info.some-in-univ.com",
      "/blog/article",
      "?__apex_proxy=1&source=gsc",
    ),
    `${APEX_CANONICAL_ORIGIN}/blog/article?source=gsc`,
  );
  assert.equal(getCanonicalRedirect("some-in-univ.com", "/blog/article", ""), null);
});

test("legacy university aliases redirect directly to the canonical apex code", () => {
  assert.equal(
    getCanonicalRedirect("info.some-in-univ.com", "/university/DKJU", "?source=gsc"),
    `${APEX_CANONICAL_ORIGIN}/university/KNU?source=gsc`,
  );
  assert.equal(
    getCanonicalRedirect("info.some-in-univ.com", "/university/DJU", ""),
    `${APEX_CANONICAL_ORIGIN}/university/DJU`,
  );

  const aliases = new Map([
    ["KYGKYU", "SELKGU"], ["KYGKHU", "SELKHU"], ["DKJU", "KNU"],
    ["KYGDGU", "SELDGU"], ["TU", "DMU"], ["KYGMJU", "SELMJU"],
    ["KYGEUL", "EJU"], ["KYGJBU", "JOBU"], ["KYGCAU", "SELCAU"],
    ["KYGCUK", "SELCUK"], ["KYGSKUW", "SELSKK"], ["GJUE", "DKJE"],
    ["0000393", "0000392"], ["0002747", "0002746"], ["KYGHUFS", "SELHFS"],
  ]);
  for (const [alias, canonical] of aliases) {
    assert.equal(
      getCanonicalRedirect("info.some-in-univ.com", `/university/${alias}`, ""),
      `${APEX_CANONICAL_ORIGIN}/university/${canonical}`,
      alias,
    );
  }
});

test("direct hits on the public vercel.app host redirect to the same apex path", () => {
  for (const [path, search, expected] of [
    ["/", "", `${APEX_CANONICAL_ORIGIN}/`],
    ["/blog/yeonpick-vs-sometime", "?utm_source=gsc", `${APEX_CANONICAL_ORIGIN}/blog/yeonpick-vs-sometime?utm_source=gsc`],
    ["/blog", "", `${APEX_CANONICAL_ORIGIN}/blog`],
    ["/card-news/019fef9b-88cc-7a75-9294-4dbdd9d71d9c", "", `${APEX_CANONICAL_ORIGIN}/card-news/019fef9b-88cc-7a75-9294-4dbdd9d71d9c`],
    ["/university/DKJU", "", `${APEX_CANONICAL_ORIGIN}/university/KNU`],
    ["/community", "?source=gsc", `${APEX_CANONICAL_ORIGIN}/stories?source=gsc`],
    ["/sitemap.xml", "", `${APEX_CANONICAL_ORIGIN}/sitemap.xml`],
    ["/faq", "", `${APEX_CANONICAL_ORIGIN}/faq`],
  ] as const) {
    assert.equal(
      getCanonicalRedirect(VERCEL_APP_RENDER_HOST, path, search, false),
      expected,
      path,
    );
  }

  assert.equal(
    getCanonicalRedirect(
      VERCEL_APP_RENDER_HOST,
      "/blog/article",
      "?__apex_proxy=1&source=gsc",
      false,
    ),
    `${APEX_CANONICAL_ORIGIN}/blog/article?source=gsc`,
  );
});

test("render host keeps serving when the request arrived through a Vercel rewrite", () => {
  for (const path of [
    "/",
    "/blog",
    "/blog/yeonpick-vs-sometime",
    "/blog/rss.xml",
    "/card-news/019fef9b-88cc-7a75-9294-4dbdd9d71d9c",
    "/university/DJU",
    "/community",
    "/sitemap.xml",
    "/feed.xml",
  ]) {
    assert.equal(
      getCanonicalRedirect(VERCEL_APP_RENDER_HOST, path, "", true),
      null,
      path,
    );
  }
});

test("non-canonical paths never redirect on the render host", () => {
  for (const path of [
    "/community/write",
    "/community/love-court",
    "/feed.xml",
    "/api/message/abc",
    "/event/summer",
  ]) {
    assert.equal(
      getCanonicalRedirect(VERCEL_APP_RENDER_HOST, path, "", false),
      null,
      path,
    );
  }
});

test("the legacy info host redirects canonical paths even for rewrite-proxied requests", () => {
  assert.equal(
    getCanonicalRedirect("info.some-in-univ.com", "/blog/article", "", true),
    `${APEX_CANONICAL_ORIGIN}/blog/article`,
  );
});

test("internal render detection requires the vercel marker pair", () => {
  const headersOf = (pairs: Record<string, string>) => ({
    get: (key: string) => pairs[key.toLowerCase()] ?? null,
    has: (key: string) => key.toLowerCase() in pairs,
  });

  assert.equal(
    isInternalRenderRequest(
      headersOf({
        "x-vercel-is-internal-rewrite": "true:1790578660",
        "x-vercel-is-internal-rewrite-signature": "abc123",
      }),
    ),
    true,
  );
  assert.equal(isInternalRenderRequest(headersOf({})), false);
  assert.equal(
    isInternalRenderRequest(
      headersOf({ "x-vercel-is-internal-rewrite": "true:1790578660" }),
    ),
    false,
  );
  assert.equal(
    isInternalRenderRequest(
      headersOf({
        "x-vercel-is-internal-rewrite": "false:1790578660",
        "x-vercel-is-internal-rewrite-signature": "abc123",
      }),
    ),
    false,
  );
});
