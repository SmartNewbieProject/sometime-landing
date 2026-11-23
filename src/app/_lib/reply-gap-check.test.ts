import test from "node:test";
import assert from "node:assert/strict";
import {
  REPLY_GAP_FAQS,
  REPLY_GAP_QUESTIONS,
  scoreReplyGapCheck,
} from "./reply-gap-check";

test("reply-gap-check has 7 questions and 4 FAQs", () => {
  assert.equal(REPLY_GAP_QUESTIONS.length, 7);
  assert.equal(REPLY_GAP_FAQS.length, 4);
});

test("scoreReplyGapCheck maps boundary scores to the right result band", () => {
  assert.equal(scoreReplyGapCheck([0, 0, 0, 0, 0, 0, 0]).band.id, "reset");
  assert.equal(scoreReplyGapCheck([1, 1, 1, 0, 0, 0, 0]).band.id, "reset");
  assert.equal(scoreReplyGapCheck([2, 2, 0, 0, 0, 0, 0]).band.id, "check");
  assert.equal(scoreReplyGapCheck([2, 2, 2, 0, 0, 0, 0]).band.id, "check");
  assert.equal(scoreReplyGapCheck([2, 2, 2, 1, 0, 0, 0]).band.id, "schedule");
  assert.equal(scoreReplyGapCheck([2, 2, 2, 2, 2, 0, 0]).band.id, "schedule");
  assert.equal(scoreReplyGapCheck([2, 2, 2, 2, 2, 1, 0]).band.id, "strong");
  assert.equal(scoreReplyGapCheck([2, 2, 2, 2, 2, 2, 2]).band.id, "strong");
});
