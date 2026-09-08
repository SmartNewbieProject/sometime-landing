import assert from "node:assert/strict";
import { test } from "node:test";
import { contentSummary, detailEndAction } from "./content-presentation";
import { recoverNaverTables, NAVER_TABLE_RECOVERIES } from "./naver-table-recovery";
import { markdownToHtml } from "../_components/public-content/MarkdownBody";

test("summaries remove syntax and retain at most two sentences within 140 characters", () => {
  const summary = contentSummary("## **FIRST_SENTINEL**. [SECOND_SENTINEL](/next). THIRD_SENTINEL. " + "LONG_SENTINEL ".repeat(40));
  assert.ok(summary.length <= 140);
  assert.ok(!/[#*\[\]]/.test(summary));
  assert.ok(summary.includes("FIRST_SENTINEL"));
  assert.ok(!summary.includes("THIRD_SENTINEL"));
  assert.equal(contentSummary("![IMG](/image.png)\n---"), "");
});

test("summary falls back to body when the supplied preview is empty", () => {
  assert.ok(contentSummary("", "BODY_SENTINEL.").includes("BODY_SENTINEL"));
});

test("detail actions route operational intent away from acquisition", () => {
  assert.equal(detailEndAction("card-news", "환불 정책").href, "mailto:notify@smartnewb.com");
  assert.equal(new URL(detailEndAction("card-news", "이용약관 변경").href).hostname, "ruby-composer-6d2.notion.site");
  assert.equal(detailEndAction("card-news", "오류 안내").href, "mailto:notify@smartnewb.com");
  assert.equal(detailEndAction("story", "학교 인증").href, "/verification");
  assert.equal(detailEndAction("community", "POST_SENTINEL").href, "/stories");
  assert.equal(detailEndAction("card-news", "NOTICE_SENTINEL", "notice").href, "mailto:notify@smartnewb.com");
  assert.equal(detailEndAction("story", "로테이션 소개팅 모집").href, "/rotation");
  assert.equal(detailEndAction("card-news", "이벤트 모집", "campaign").href, "/card-news");
  assert.equal(detailEndAction("card-news", "CAMPAIGN_SENTINEL", "campaign").href, "/card-news");
});

test("all recovered tables retain the original cell matrix in rendered HTML", () => {
  for (const [slug, recovery] of Object.entries(NAVER_TABLE_RECOVERIES)) {
    const input = recovery.tables.map((table) => `${table.heading}\n\n`).join("") + "## END_SENTINEL\nTAIL_SENTINEL";
    const output = recoverNaverTables(slug, input);
    const html = markdownToHtml(output);
    assert.equal((html.match(/<table>/g) ?? []).length, recovery.tables.length);
    assert.ok(output.endsWith("## END_SENTINEL\nTAIL_SENTINEL"));
    assert.equal(recoverNaverTables(slug, output), output);
    for (const table of recovery.tables) {
      const escape = (cell: string) => cell.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      for (const row of table.rows) for (const cell of row) assert.ok(html.includes(`>${escape(cell)}</`));
    }
  }
});

test("recovery never replaces populated source sections or applies to unknown articles", () => {
  const slug = Object.keys(NAVER_TABLE_RECOVERIES)[0];
  const heading = NAVER_TABLE_RECOVERIES[slug].tables[0].heading;
  const content = `${heading}\n\nSOURCE_SENTINEL\n\n## END_SENTINEL`;
  assert.equal(recoverNaverTables(slug, content), content);
  assert.equal(recoverNaverTables("unknown", `${heading}\n\n## END_SENTINEL`), `${heading}\n\n## END_SENTINEL`);
});

test("missing table before a known following paragraph is inserted without losing that paragraph", () => {
  for (const [slug, recovery] of Object.entries(NAVER_TABLE_RECOVERIES)) {
    for (const table of recovery.tables.filter((table) => table.followingBlock)) {
      const tail = `${table.followingBlock}\n\nTAIL_SENTINEL`;
      const content = `${table.heading}\n\n${tail}`;
      const output = recoverNaverTables(slug, content);
      assert.ok(output.includes("| --- |"));
      assert.ok(output.endsWith(tail));
      assert.equal(recoverNaverTables(slug, output), output);
    }
  }
});
