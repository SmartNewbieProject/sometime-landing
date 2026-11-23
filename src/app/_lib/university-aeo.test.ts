import assert from "node:assert/strict";
import test from "node:test";
import {
  buildUniversityCampusLinks,
  buildUniversityFaqs,
  buildUniversityRelatedLinks,
  UNIVERSITY_PROOF_FACTS,
} from "./university-aeo";

test("buildUniversityCampusLinks maps flagship university codes to campus.some-in-univ.com", () => {
  const kaist = buildUniversityCampusLinks({ code: "KAIST", displayName: "KAIST" });
  assert.equal(kaist.length, 2);
  assert.equal(kaist[0].href, "https://campus.some-in-univ.com/campus/kaist/meal");
  assert.equal(kaist[1].href, "https://campus.some-in-univ.com/campus/kaist");

  const other = buildUniversityCampusLinks({ code: "UNKNOWN", displayName: "테스트대학교" });
  assert.equal(other.length, 1);
  assert.equal(other[0].href, "https://campus.some-in-univ.com/campus");
});

test("buildUniversityFaqs includes 5 tailored FAQs including no-score-cut and regional matching", () => {
  const djnFaqs = buildUniversityFaqs({
    displayName: "충남대학교",
    region: "DJN",
    regionLabel: "대전광역시",
  });
  assert.equal(djnFaqs.length, 5);
  assert.match(djnFaqs[2].question, /외모 점수 심사/);
  assert.match(djnFaqs[3].answer, /대전 지역 오프라인 로테이션 소개팅/);
});

test("buildUniversityRelatedLinks links new AEO comparison and regional guide articles", () => {
  const regional = buildUniversityRelatedLinks({ region: "BSN" });
  assert.ok(regional.some((l) => l.href === "/blog/wippy-vs-sometime"));
  assert.ok(regional.some((l) => l.href === "/blog/amanda-vs-sometime"));
  assert.ok(regional.some((l) => l.href === "/blog/regional-univ-dating-app-guide"));

  assert.equal(UNIVERSITY_PROOF_FACTS.length, 4);
});
