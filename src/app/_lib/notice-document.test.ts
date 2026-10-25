import assert from "node:assert/strict";
import test from "node:test";
import { buildNoticeDocument, type NoticeHtml } from "./notice-document";

const notice: NoticeHtml = {
  safeHtml: '<div class="page"><img src="https://cdn.example.com/card-news/notices/a.webp" alt=""></div>',
  safeCss: ".page{color:#191F28}",
  revision: 1,
  policyVersion: 1,
  country: "kr",
  allowedImagePrefixes: ["https://cdn.example.com/card-news/notices/"],
};

test("검증된 공지는 CSS 와 이미지 허용 CSP 를 담은 문서가 된다", () => {
  const doc = buildNoticeDocument(notice);

  assert.ok(doc?.includes(".page{color:#191F28}"));
  assert.ok(doc?.includes("img-src https://cdn.example.com/card-news/notices/;"));
  assert.ok(doc?.includes("script-src 'none'"));
  assert.ok(doc?.includes('<html lang="ko">'));
});

test("문서를 탈출하는 태그나 이벤트 속성이 있으면 문서를 만들지 않는다", () => {
  assert.equal(buildNoticeDocument({ ...notice, safeHtml: "<script>x</script>" }), null);
  assert.equal(buildNoticeDocument({ ...notice, safeHtml: '<img onerror="x">' }), null);
  assert.equal(buildNoticeDocument({ ...notice, safeCss: "</style><script>" }), null);
  assert.equal(buildNoticeDocument({ ...notice, allowedImagePrefixes: ["http://x.com/"] }), null);
  assert.equal(buildNoticeDocument(null), null);
});
