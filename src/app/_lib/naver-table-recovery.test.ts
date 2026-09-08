import assert from "node:assert/strict";
import test from "node:test";
import { markdownToHtml } from "../_components/public-content/MarkdownBody";
import { NAVER_TABLE_RECOVERIES, recoverNaverTables } from "./naver-table-recovery";

const slug = "naver-224335105946";
const recovery = NAVER_TABLE_RECOVERIES[slug];
const heading = "## 대학생 소개팅 앱별 사진 공개 방식 비교";
const tail = "## 결국 중요한 건 선택할 수 있느냐\n\nTAIL_SENTINEL";

// Parsed from the original public Naver table SE-419f5c93-c052-4413-88cf-6ec9f124f5a3,
// published 2026-07-03 11:09 KST, retrieved 2026-09-08 KST at recovery.sourceUrl.
// Normalize only surrounding HTML whitespace and the U+200B empty placeholder.
const sourceRows = [
  ["", "사진 공개형", "블라인드형", "비고"],
  ["썸타임", "O", "O", "선택 가능"],
  ["연픽", "X", "O", "사진 없이 이용"],
  ["클럽트웬티", "O", "X", "사진 공개형"],
  ["하루야", "X", "O", "사진 없이 이용"],
  ["두근두근캠퍼스", "O", "X", "매칭시 1:1 공개"],
  ["캠퍼스팅", "O", "X", "단계별 공개"],
];

test("photo comparison recovery retains the original source matrix and provenance", () => {
  assert.equal(recovery.sourceUrl, "https://m.blog.naver.com/smartnewb/224335105946");
  assert.equal(recovery.retrievedAt, "2026-09-08");
  assert.equal(recovery.tables.length, 1);
  assert.equal(recovery.tables[0].heading, heading);
  assert.deepEqual(recovery.tables[0].rows, sourceRows);

  const input = `BEFORE_SENTINEL\n\n${heading}\n\n${tail}`;
  const output = recoverNaverTables(slug, input);
  const html = markdownToHtml(output);
  assert.equal((html.match(/<table>/g) ?? []).length, 1);
  assert.equal((html.match(/<th\s/g) ?? []).length, 4);
  assert.equal((html.match(/<td\s/g) ?? []).length, 24);
  const renderedRows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((row) =>
    [...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/g)].map((cell) => cell[1]),
  );
  assert.deepEqual(renderedRows, sourceRows);
  assert.ok(html.includes(`href="${recovery.sourceUrl}"`));
  assert.ok(output.startsWith(`BEFORE_SENTINEL\n\n${heading}\n\n`));
  assert.ok(output.endsWith(tail));
  assert.equal(recoverNaverTables(slug, output), output);
});

test("photo comparison recovery preserves populated sections and unrelated articles", () => {
  for (const body of ["EXISTING_SENTINEL", "| A | B |\n| --- | --- |\n| C | D |"] ) {
    const input = `${heading}\n\n${body}\n\n${tail}`;
    assert.equal(recoverNaverTables(slug, input), input);
  }
  const input = `${heading}\n\n${tail}`;
  assert.equal(recoverNaverTables("unrelated", input), input);
});
