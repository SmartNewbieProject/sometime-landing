import assert from "node:assert/strict";
import test from "node:test";
import { classifyReferrer } from "./referrer-channel";

const HOST = "some-in-univ.com";

test("search engine referrers become seo with a fixed source name", () => {
  assert.deepEqual(classifyReferrer("https://www.google.com/", HOST), { channel: "seo", source: "google" });
  assert.deepEqual(classifyReferrer("https://www.google.co.kr/", HOST), { channel: "seo", source: "google" });
  assert.deepEqual(classifyReferrer("https://search.naver.com/search.naver?query=x", HOST), { channel: "seo", source: "naver" });
  assert.deepEqual(classifyReferrer("https://m.search.naver.com/", HOST), { channel: "seo", source: "naver" });
  assert.deepEqual(classifyReferrer("https://search.daum.net/search?q=x", HOST), { channel: "seo", source: "daum" });
  assert.deepEqual(classifyReferrer("android-app://com.google.android.googlequicksearchbox/", HOST), { channel: "seo", source: "google" });
});

test("ai hosts win over the search engine that owns the domain", () => {
  assert.deepEqual(classifyReferrer("https://gemini.google.com/app", HOST), { channel: "ai_search", source: "gemini" });
  assert.deepEqual(classifyReferrer("https://chatgpt.com/", HOST), { channel: "ai_search", source: "chatgpt" });
  assert.deepEqual(classifyReferrer("https://clova-x.naver.com/", HOST), { channel: "ai_search", source: "clova-x" });
});

test("non-search hosts on a search engine domain are not seo", () => {
  assert.deepEqual(classifyReferrer("https://mail.google.com/", HOST), { channel: "referral" });
  assert.deepEqual(classifyReferrer("https://blog.naver.com/abc", HOST), { channel: "referral", source: "naver_blog" });
  assert.deepEqual(classifyReferrer("https://m.blog.naver.com/abc", HOST), { channel: "referral", source: "naver_blog" });
  assert.deepEqual(classifyReferrer("https://cafe.daum.net/x", HOST), { channel: "referral" });
});

test("social, community and own-site referrers", () => {
  assert.deepEqual(classifyReferrer("https://l.instagram.com/?u=x", HOST), { channel: "social", source: "instagram" });
  assert.deepEqual(classifyReferrer("https://l.threads.com/", HOST), { channel: "social", source: "threads" });
  assert.deepEqual(classifyReferrer("https://everytime.kr/123", HOST), { channel: "referral", source: "everytime" });
  assert.deepEqual(classifyReferrer("https://some-in-univ.com/blog/a", HOST), { channel: "internal" });
  assert.deepEqual(classifyReferrer("https://campus.some-in-univ.com/", HOST), { channel: "internal" });
  assert.deepEqual(classifyReferrer("https://preview-abc.vercel.app/x", "preview-abc.vercel.app:3000"), { channel: "internal" });
  assert.deepEqual(classifyReferrer("https://example.org/page", HOST), { channel: "referral" });
});

test("empty or broken referrers are reported as they are, not guessed", () => {
  assert.deepEqual(classifyReferrer("", HOST), { channel: "none" });
  assert.deepEqual(classifyReferrer(undefined, HOST), { channel: "none" });
  assert.deepEqual(classifyReferrer("not a url", HOST), { channel: "unparsed" });
});

test("the result never carries the raw url, host or query", () => {
  const result = classifyReferrer("https://search.naver.com/search.naver?query=private%40example.com", HOST);
  assert.equal(JSON.stringify(result).includes("private"), false);
  assert.equal(JSON.stringify(result).includes("search.naver.com"), false);
});
