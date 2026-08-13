import assert from "node:assert/strict";
import test from "node:test";
import {
  APEX_CANONICAL_ORIGIN,
  APEX_CANONICAL_PATHS,
  getCanonicalRedirect,
  isApexCanonicalPath,
} from "./seo-canary-policy";

test("only safety and verification are apex canonical", () => {
  assert.deepEqual(APEX_CANONICAL_PATHS, ["/safety", "/verification"]);
  assert.equal(isApexCanonicalPath("/safety"), true);
  assert.equal(isApexCanonicalPath("/verification/"), true);
  assert.equal(isApexCanonicalPath("/about"), false);
});

test("info canary URLs redirect one hop to the exact apex path", () => {
  assert.equal(
    getCanonicalRedirect("info.some-in-univ.com", "/safety", "?source=gsc"),
    `${APEX_CANONICAL_ORIGIN}/safety?source=gsc`,
  );
  assert.equal(
    getCanonicalRedirect("info.some-in-univ.com", "/verification", ""),
    `${APEX_CANONICAL_ORIGIN}/verification`,
  );
});

test("apex and non-canary info paths do not redirect", () => {
  assert.equal(getCanonicalRedirect("some-in-univ.com", "/safety", ""), null);
  assert.equal(getCanonicalRedirect("info.some-in-univ.com", "/about", ""), null);
});
