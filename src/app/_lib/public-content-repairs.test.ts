import assert from "node:assert/strict";
import test from "node:test";
import {
  CARD_NEWS_TEXT_REMOVALS,
  repairCardNews,
} from "./public-content-repairs";

test("approved strategic blocks are removed once from their exact records", () => {
  assert.equal(CARD_NEWS_TEXT_REMOVALS.length, 2);

  for (const removal of CARD_NEWS_TEXT_REMOVALS) {
    const source = {
      id: removal.id,
      body: `retained before\n\n${removal.blocks.join("\n\n")}\n\nretained after`,
    };
    const repaired = repairCardNews(source);

    assert.ok(removal.blocks.every((block) => !repaired.body?.includes(block)));
    assert.ok(repaired.body?.includes("retained before"));
    assert.ok(repaired.body?.includes("retained after"));
    assert.deepEqual(repairCardNews(repaired), repaired);
  }
});

test("strategic repairs never alter unrelated or mandated legal notices", () => {
  const unrelated = { id: "unrelated", body: "editorial body" };
  const legalNotice = {
    id: "01a0122f-ad89-7163-b359-4c4e49ae3ba0",
    body: "consumer refund and privacy notice",
  };

  assert.strictEqual(repairCardNews(unrelated), unrelated);
  assert.strictEqual(repairCardNews(legalNotice), legalNotice);
});
