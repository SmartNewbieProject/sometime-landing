import assert from "node:assert/strict";
import test from "node:test";
import { canonicalUniversityPath } from "./university-canonical";

test("redirects an alias code to the canonical university path", () => {
  assert.equal(
    canonicalUniversityPath("DKJU", { university: { code: "KNU" }, canonicalCode: "KNU" }),
    "/university/KNU",
  );
});

test("keeps a canonical university code on the current path", () => {
  assert.equal(
    canonicalUniversityPath("DJU", { university: { code: "DJU" } }),
    null,
  );
});
