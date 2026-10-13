import assert from "node:assert/strict";
import test from "node:test";
import {
  formatHomeProofReviewMeta,
  formatHomeProofStats,
  HOME_PROOF_MATCHING_BODY,
  HOME_PROOF_TITLE,
  HOME_PROOF_VERIFICATION_BODY,
  type HomeProof,
  parseHomeProof,
} from "./home-proof";

const proof: HomeProof = {
  verifiedCountFloor: 3000,
  verifiedUniversityCountFloor: 270,
  asOf: "2026-10-05",
  reviews: [
    {
      id: "REVIEW#APP_STORE#1",
      source: "APP_STORE",
      rating: 5,
      body: "원문",
      author: { nickname: "닉네임", universityName: "충남대학교" },
    },
    { id: "REVIEW#PLAY_STORE#2", source: "PLAY_STORE", rating: 4, body: "두 번째", author: null },
  ],
};

test("accepts a well-formed home proof", () => {
  assert.deepEqual(parseHomeProof(proof), proof);
});

test("rejects a count below the display floor instead of inventing one", () => {
  assert.throws(() => parseHomeProof({ ...proof, verifiedCountFloor: 0 }), /verifiedCountFloor/);
  assert.throws(() => parseHomeProof({ ...proof, verifiedCountFloor: undefined }), /verifiedCountFloor/);
});

test("rejects a missing or malformed as-of date", () => {
  assert.throws(() => parseHomeProof({ ...proof, asOf: "10/05" }), /asOf/);
  assert.throws(() => parseHomeProof({ ...proof, asOf: undefined }), /asOf/);
});

test("rejects empty reviews and reviews without a store source, rating, or body", () => {
  assert.throws(() => parseHomeProof({ ...proof, reviews: [] }), /reviews/);
  assert.throws(
    () => parseHomeProof({ ...proof, reviews: [{ ...proof.reviews[0], source: "COMMUNITY" }] }),
    /reviews\[0\]/,
  );
  assert.throws(
    () => parseHomeProof({ ...proof, reviews: [{ ...proof.reviews[0], rating: null }] }),
    /reviews\[0\]/,
  );
  assert.throws(
    () => parseHomeProof({ ...proof, reviews: [{ ...proof.reviews[0], body: "  " }] }),
    /reviews\[0\]/,
  );
});

test("rejects a non-object payload", () => {
  assert.throws(() => parseHomeProof(null), /verifiedCountFloor/);
});

test("home proof copy stays in 해요체 and keeps the allowed facts", () => {
  assert.equal(HOME_PROOF_TITLE, "가입 전에 다들 궁금해하는 것");
  assert.equal(
    HOME_PROOF_VERIFICATION_BODY,
    "가입할 때 학교 고르고, 학교 메일이나 학생증·재학증명서로 인증하면 끝이에요.",
  );
  assert.equal(HOME_PROOF_MATCHING_BODY, "매칭이 열릴 때마다 한 명씩 무료로 추천해 줘요.");
});

test("count copy is cumulative and never says current users", () => {
  const line = formatHomeProofStats(proof);

  assert.equal(
    line,
    "학교 인증한 사람 3,000명+ · 대학 270곳+ (Google Play·App Store·웹 합산, 2026-10-05 기준)",
  );
  assert.doesNotMatch(line, /이용/);
});

test("review meta carries source, rating, and author without altering the body", () => {
  assert.equal(formatHomeProofReviewMeta(proof.reviews[0]), "App Store · 평점 5 · 닉네임 · 충남대학교");
  assert.equal(formatHomeProofReviewMeta(proof.reviews[1]), "Google Play · 평점 4");
});

test("rejects a missing or too-small university count instead of inventing one", () => {
  assert.throws(
    () => parseHomeProof({ ...proof, verifiedUniversityCountFloor: undefined }),
    /verifiedUniversityCountFloor/,
  );
  assert.throws(
    () => parseHomeProof({ ...proof, verifiedUniversityCountFloor: 9 }),
    /verifiedUniversityCountFloor/,
  );
});

test("university copy is a cumulative at-least statement", () => {
  const line = formatHomeProofStats(proof);

  assert.match(line, /대학 270곳\+/);
  assert.match(line, /Google Play·App Store·웹 합산/);
  assert.match(line, /2026-10-05 기준/);
  assert.doesNotMatch(line, /참여|이용/);
});
