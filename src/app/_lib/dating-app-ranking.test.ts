import assert from "node:assert/strict";
import test from "node:test";
import { buildSnapshot, parseChart, parseLookup, RANKING_APP_IDS, SOMETIME_APP_ID, splitTrackName } from "./dating-app-ranking";

const names: Record<string, string> = {
  [SOMETIME_APP_ID]: "썸타임: 대학생 소개팅·캠퍼스 미팅",
  "1661759931": "연픽 - 대학생 소개팅, 미팅",
  "6444236865": "클럽트웬티 - 대학생 미팅, 소개팅",
  "1261209014": "위피 - 동네친구가 필요할 때",
  "1058232900": "글램 : 탈퇴하세요, 함께 - 소개팅 데이트 만남",
  "1191259452": "스카이피플(스피): 인증 기반 프리미엄 소개팅앱",
};
const lookupPayload = {
  results: RANKING_APP_IDS.map((id, i) => ({
    trackId: Number(id),
    trackName: names[id],
    averageUserRating: 4 + i / 10,
    userRatingCount: 1000 * (i + 1),
    trackViewUrl: `https://apps.apple.com/kr/app/x/id${id}?uo=4`,
  })),
};
const chartOf = (ids: string[], extra: Record<string, string> = {}) => ({
  feed: {
    entry: [...ids, ...Array.from({ length: 20 }, (_, i) => `9${i}`)].map((id) => ({
      id: { attributes: { "im:id": id } },
      "im:name": { label: names[id] ?? extra[id] ?? `앱 ${id}` },
    })),
  },
});

test("표시명을 이름과 한 줄 소개로 나눈다", () => {
  assert.deepEqual(splitTrackName("연픽 - 대학생 소개팅, 미팅"), { name: "연픽", tagline: "대학생 소개팅, 미팅" });
  assert.deepEqual(splitTrackName("스카이피플(스피): 인증 기반 프리미엄 소개팅앱"), { name: "스카이피플", tagline: "인증 기반 프리미엄 소개팅앱" });
  assert.deepEqual(splitTrackName("글램 : 탈퇴하세요, 함께 - 소개팅 데이트 만남"), { name: "글램", tagline: "탈퇴하세요, 함께 - 소개팅 데이트 만남" });
});

test("대학생 앱은 표시명에 '대학생'을 내건 앱만", () => {
  const byId = parseLookup(lookupPayload);
  assert.deepEqual(
    RANKING_APP_IDS.filter((id) => byId.get(id)!.isCollege),
    [SOMETIME_APP_ID, "1661759931", "6444236865"],
  );
});

test("오늘 순위로 정렬하고, 대학생 앱 중 가장 높은 앱을 고른다", () => {
  const snap = buildSnapshot(parseLookup(lookupPayload), parseChart(chartOf(["1261209014", "1058232900", SOMETIME_APP_ID])), "2026-11-17T00:00:00Z");
  assert.deepEqual(snap.apps.map((a) => [a.name, a.chartRank]).slice(0, 3), [["위피", 1], ["글램", 2], ["썸타임", 3]]);
  assert.equal(snap.collegeLeader?.id, SOMETIME_APP_ID);
  // 100위 밖은 평가 수 많은 순
  assert.deepEqual(snap.apps.slice(3).map((a) => a.chartRank), [null, null, null]);
  assert.ok(snap.apps[3].ratingCount >= snap.apps[4].ratingCount);
});

test("다른 대학생 앱이 더 높으면 그 앱이 leader 다 (썸타임 1위를 지어내지 않는다)", () => {
  const snap = buildSnapshot(parseLookup(lookupPayload), parseChart(chartOf(["1661759931", SOMETIME_APP_ID])), "2026-11-17T00:00:00Z");
  assert.equal(snap.collegeLeader?.id, "1661759931");
});

test("비교 6개 밖의 대학생 앱이 더 높아도 그 앱이 leader 다", () => {
  const snap = buildSnapshot(parseLookup(lookupPayload), parseChart(chartOf(["77", SOMETIME_APP_ID], { "77": "새앱 - 대학생 소개팅" })), "2026-11-17T00:00:00Z");
  assert.deepEqual(snap.collegeLeader, { id: "77", name: "새앱 - 대학생 소개팅", rank: 1 });
});

test("대학생 앱이 하나도 차트에 없으면 leader 는 null", () => {
  const snap = buildSnapshot(parseLookup(lookupPayload), parseChart(chartOf(["1261209014"])), "2026-11-17T00:00:00Z");
  assert.equal(snap.collegeLeader, null);
});

test("lookup 에 앱이 빠지거나 차트가 비면 던진다", () => {
  assert.throws(() => parseLookup({ results: lookupPayload.results.slice(1) }));
  assert.throws(() => parseChart({ feed: { entry: [] } }));
});
