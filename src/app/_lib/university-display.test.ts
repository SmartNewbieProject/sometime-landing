import assert from "node:assert/strict";
import test from "node:test";
import { universityDisplayName } from "./university-display";

test("a university whose name is unique keeps its plain name", () => {
  assert.equal(universityDisplayName({ name: "한밭대학교", code: "HBU", region: "DJN" }), "한밭대학교");
});

test("campuses sharing a name are told apart by region", () => {
  assert.equal(
    universityDisplayName({ name: "단국대학교", code: "KYGDKU", region: "KYG" }),
    "단국대학교(경기도)",
  );
  assert.equal(
    universityDisplayName({ name: "단국대학교", code: "CADKU", region: "CAN" }),
    "단국대학교(천안시)",
  );
  assert.equal(
    universityDisplayName({ name: "가천대학교", code: "ICNGCU", region: "ICN" }),
    "가천대학교(인천광역시)",
  );
  assert.equal(
    universityDisplayName({ name: "상명대학교", code: "SELSMU", region: "SEL" }),
    "상명대학교(서울특별시)",
  );
});

test("a shared-name campus without a region label fails instead of repeating the plain name", () => {
  assert.throws(
    () => universityDisplayName({ name: "단국대학교", code: "CADKU", region: null }),
    /CADKU/,
  );
  assert.throws(
    () => universityDisplayName({ name: "단국대학교", code: "CADKU", region: "ZZZ" }),
    /no label/,
  );
});
