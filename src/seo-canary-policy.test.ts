import assert from "node:assert/strict";
import test from "node:test";
import {
  APEX_CANONICAL_ORIGIN,
  APEX_CANONICAL_STATIC_PATHS,
  getCanonicalRedirect,
  isApexCanonicalPath,
} from "./seo-canary-policy";

test("all indexable public route families are apex canonical", () => {
  assert.deepEqual(APEX_CANONICAL_STATIC_PATHS, [
    "/",
    "/about",
    "/blog",
    "/card-news",
    "/community",
    "/community-guidelines",
    "/download",
    "/faq",
    "/press",
    "/privacy/easy",
    "/safety",
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
