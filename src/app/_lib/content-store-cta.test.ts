import assert from "node:assert/strict";
import test from "node:test";
import { resolveContentStoreCta } from "./content-store-cta";

test("comparison intent wins for competitor and app-comparison content", () => {
  assert.equal(resolveContentStoreCta({ title: "연픽과 썸타임 비교" }).kind, "comparison");
  assert.equal(resolveContentStoreCta({ title: "대학생 소개팅 앱 추천" }).kind, "comparison");
});

test("trust and campus content receive distinct install copy", () => {
  assert.equal(resolveContentStoreCta({ title: "학교 인증과 지인 차단 안내" }).kind, "trust");
  assert.equal(resolveContentStoreCta({ title: "대전 캠퍼스 과팅 가이드" }).kind, "campus");
});

test("relationship content falls back to the relationship CTA", () => {
  assert.equal(resolveContentStoreCta({ title: "첫 만남 대화가 어색할 때" }).kind, "relationship");
});
