import test from "node:test";
import assert from "node:assert/strict";
import {
  buildJaLlmsTxt,
  buildJaMetadata,
  JA_EXCHANGE_FAQS,
  JA_HOME_FAQS,
  JA_SAFETY_FAQS,
} from "./ja-content";

test("buildJaMetadata sets ja canonical and bidirectional ko/ja hreflang", () => {
  const meta = buildJaMetadata({
    title: "Sometime（サムタイム）｜韓国の友達・言語交換アプリ",
    description: "日韓の大学生・20代が自動翻訳チャットでつながる交流アプリ。",
    path: "/ja",
    koAlternatePath: "/",
    keywords: ["韓国の友達 アプリ", "日韓交流 アプリ"],
  });

  assert.equal(meta.alternates?.canonical, "https://some-in-univ.com/ja");
  assert.deepEqual(meta.alternates?.languages, {
    ja: "https://some-in-univ.com/ja",
    ko: "https://some-in-univ.com",
    "x-default": "https://some-in-univ.com",
  });
  assert.equal(meta.openGraph?.locale, "ja_JP");
});

test("buildJaLlmsTxt lists all Japanese canonical pages and store links", () => {
  const txt = buildJaLlmsTxt();
  assert.ok(txt.includes("https://some-in-univ.com/ja"));
  assert.ok(txt.includes("https://some-in-univ.com/ja/korean-language-exchange"));
  assert.ok(txt.includes("https://some-in-univ.com/ja/safety"));
  assert.ok(txt.includes("apps.apple.com/jp/app/id6746120889"));
  assert.ok(txt.includes("SmartNewbie"));
});

test("Japanese FAQ collections are populated", () => {
  assert.ok(JA_HOME_FAQS.length >= 4);
  assert.ok(JA_EXCHANGE_FAQS.length >= 4);
  assert.ok(JA_SAFETY_FAQS.length >= 4);
});
