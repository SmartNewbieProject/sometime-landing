import assert from "node:assert/strict";
import test from "node:test";
import { readingMinutes } from "./reading-time";

test("empty or markup-only bodies have no reading time instead of an invented one", () => {
  assert.equal(readingMinutes(""), null);
  assert.equal(readingMinutes(null), null);
  assert.equal(readingMinutes("![alt](/x.png)\n\n---\n"), null);
});

test("reading time counts visible characters at 500 per minute, rounded up, minimum 1", () => {
  assert.equal(readingMinutes("가".repeat(10)), 1);
  assert.equal(readingMinutes("가".repeat(500)), 1);
  assert.equal(readingMinutes("가".repeat(501)), 2);
  assert.equal(readingMinutes(`## 제목\n\n[링크 텍스트](https://example.test/${"a".repeat(2000)}) ${"가".repeat(1000)}`), 3);
});
