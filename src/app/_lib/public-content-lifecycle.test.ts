import assert from "node:assert/strict";
import test from "node:test";
import { getCardNewsLifecycle } from "./public-content-lifecycle";

test("fixed-date campaigns use source dates and remain visible as archives", () => {
  assert.deepEqual(
    getCardNewsLifecycle("01a06231-88c0-78c6-845c-f1806bb15ebb"),
    {
      intent: "campaign",
      archive: { label: "종료된 행사", endedOn: "2026-09-05" },
    },
  );
  assert.deepEqual(
    getCardNewsLifecycle("019fa76a-a7c3-76dc-8052-a1e5f8a7db61"),
    {
      intent: "campaign",
      archive: { label: "종료된 캠페인", endedOn: "2026-08-14" },
    },
  );
  assert.deepEqual(
    getCardNewsLifecycle("019f6480-13b3-7686-9630-5ba94d3b1a16"),
    {
      intent: "campaign",
      archive: { label: "종료된 행사", endedOn: "2026-07-31" },
    },
  );
});

test("customer and legal notices are classified without being hidden", () => {
  assert.deepEqual(
    getCardNewsLifecycle("01a0122f-ad89-7163-b359-4c4e49ae3ba0"),
    { intent: "notice" },
  );
  assert.deepEqual(
    getCardNewsLifecycle("019fbd19-4538-770b-ad58-2b8c92c221d6"),
    { intent: "notice" },
  );
});

test("ordinary stories remain editorial", () => {
  assert.deepEqual(getCardNewsLifecycle("unclassified-story"), {
    intent: "editorial",
  });
});

test("the earlier, engaged photo report is the canonical source record", () => {
  assert.deepEqual(
    getCardNewsLifecycle("518873ef-fe1e-4f6c-994c-f1b542544a82"),
    {
      intent: "editorial",
      canonicalId: "019fef4b-e4d8-7f40-aa12-00d7fb0b649f",
    },
  );
  assert.deepEqual(
    getCardNewsLifecycle("019fef4b-e4d8-7f40-aa12-00d7fb0b649f"),
    { intent: "editorial" },
  );
});

test("strategic scope repairs are resolved by an explicit local artifact", () => {
  assert.deepEqual(
    getCardNewsLifecycle("019cad1b-7df2-7fae-a002-74ac08e16fce"),
    {
      intent: "notice",
      scopeReview: {
        reason: "pricing-rationale",
        resolution: "removed-from-public-response",
        repairArtifact: "src/app/_lib/public-content-repairs.ts",
      },
    },
  );
  assert.deepEqual(
    getCardNewsLifecycle("6b21fae4-26e1-4c85-a72a-0768a633ddce"),
    {
      intent: "campaign",
      scopeReview: {
        reason: "campaign-instructions",
        resolution: "removed-from-public-response",
        repairArtifact: "src/app/_lib/public-content-repairs.ts",
      },
    },
  );
});
