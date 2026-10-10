import assert from "node:assert/strict";
import test from "node:test";
import mixpanel from "mixpanel-browser";
import { trackLandingPageView } from "./store-cta-tracking";

// 모듈 상태(첫 조회 여부)를 쓰므로 이 파일은 프로세스당 한 번만 첫 조회를 만든다.
test("only the first page view of a load carries the external referrer", (t) => {
  const previousToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  t.after(() => {
    if (previousToken === undefined) delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    else process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = previousToken;
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
  });

  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = "test-token";
  const stored = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: new URL("https://some-in-univ.com/blog/after-blind-date-contact"),
      localStorage: {
        getItem: (key: string) => stored.get(key) ?? null,
        setItem: (key: string, value: string) => { stored.set(key, value); },
      },
    },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { referrer: "https://search.naver.com/search.naver?query=private" },
  });

  t.mock.method(mixpanel, "init", () => {});
  t.mock.method(mixpanel, "identify", () => {});
  const track = t.mock.method(mixpanel, "track", () => {});

  trackLandingPageView({ pathname: "/blog/after-blind-date-contact", search: "" });
  trackLandingPageView({ pathname: "/blog/another", search: "" });

  const first = track.mock.calls[0].arguments[1];
  assert.equal(first?.is_entry_view, true);
  assert.equal(first?.referrer_channel, "seo");
  assert.equal(first?.referrer_source, "naver");

  const second = track.mock.calls[1].arguments[1];
  assert.equal(second?.is_entry_view, false);
  assert.equal(second?.referrer_channel, undefined);
  assert.equal(second?.referrer_source, undefined);

  for (const call of track.mock.calls) {
    assert.equal(JSON.stringify(call.arguments[1]).includes("private"), false);
  }
});
