import assert from "node:assert/strict";
import test from "node:test";
import {
  formatFoundPartnerLine,
  formatStoreRatingLine,
  parseCoupleReviews,
  parseReviewSummary,
  parseStoreReviews,
} from "./public-reviews";

const summaryPayload = {
  data: {
    stores: { appStore: { average: 4.4, count: 508 }, playStore: { average: 4.19, count: 282 } },
    keywords: [{ key: "peers", label: "또래 대학생", count: 39 }],
    keywordBase: 279,
    foundPartner: { count: 1031 },
  },
};

test("summary: 평점 줄과 인연 줄을 앱과 같은 문장으로 만든다", () => {
  const summary = parseReviewSummary(summaryPayload);
  assert.equal(formatStoreRatingLine(summary), "App Store 4.4점(508개), Google Play 4.2점(282개)");
  assert.equal(
    formatFoundPartnerLine(summary.foundPartnerCount ?? 0),
    "2025년 5월부터 지금까지 1,031명이 썸타임에서 인연을 찾아 떠났어요",
  );
});

test("summary: 인연 수가 없거나 0이면 줄을 숨긴다", () => {
  const rest = { ...summaryPayload.data, foundPartner: undefined };
  assert.equal(parseReviewSummary(rest).foundPartnerCount, null);
  assert.equal(parseReviewSummary({ ...rest, foundPartner: { count: 0 } }).foundPartnerCount, null);
});

test("summary: 스토어 평점이 없으면 대체값 없이 던진다", () => {
  assert.throws(() => parseReviewSummary({ stores: { appStore: null, playStore: null } }));
});

test("store: 커뮤니티 글(작성자 있음)은 빼고 스토어 후기만 남긴다", () => {
  const reviews = parseStoreReviews({
    items: [
      { id: "a", source: "APP_STORE", rating: 5, title: " ", body: " 좋아요 ", createdAt: "2026-11-13T02:00:00Z" },
      { id: "b", source: "COMMUNITY", rating: null, title: "글", body: "본문", author: { nickname: "까치" }, createdAt: "2026-11-13T02:00:00Z" },
      { id: "c", source: "PLAY_STORE", rating: 2, title: null, body: "구슬이 비싸요", createdAt: "2026-11-12T02:00:00Z" },
    ],
  });
  assert.deepEqual(
    reviews.map((review) => [review.id, review.title, review.body]),
    [
      ["a", null, "좋아요"],
      ["c", null, "구슬이 비싸요"],
    ],
  );
});

test("store: 스토어 후기가 하나도 없으면 던진다", () => {
  assert.throws(() => parseStoreReviews({ items: [] }));
});

test("couple: 짧은 글과 학교를 모르는 글은 뺀다", () => {
  const reviews = parseCoupleReviews({
    items: [
      { id: "1", body: "ㅎㅎㅎㅎㅎㅎㅎ", author: { university: { name: "A대학교" } }, partnerUniversity: { name: "B대학교" } },
      { id: "2", body: "진지하게 만나보고 싶은 사람을 만났어요", author: { university: { name: "A대학교" } }, partnerUniversity: { name: "B대학교" } },
      { id: "3", body: "진지하게 만나보고 싶은 사람을 만났어요", author: { university: null }, partnerUniversity: { name: "B대학교" } },
    ],
  });
  assert.deepEqual(reviews, [
    { id: "2", body: "진지하게 만나보고 싶은 사람을 만났어요", authorUniversity: "A대학교", partnerUniversity: "B대학교" },
  ]);
});
