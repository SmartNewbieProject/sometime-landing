import assert from "node:assert/strict";
import test from "node:test";
import mixpanel from "mixpanel-browser";
import { openStoreCtaInNewTab, trackLandingPageView, trackStoreCtaClick } from "./store-cta-tracking";
import { buildStoreUrl } from "./store-links";

test("store clicks initialize analytics, report their page and destination, and keep native navigation", (t) => {
  const previousToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  t.after(() => {
    if (previousToken === undefined) delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    else process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = previousToken;
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  });

  const order: string[] = [];
  const init = t.mock.method(mixpanel, "init", () => { order.push("init"); });
  const track = t.mock.method(mixpanel, "track", () => { order.push("track"); });
  const identify = t.mock.method(mixpanel, "identify", () => {});
  const open = t.mock.fn();
  const stored = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: new URL("https://some-in-univ.com/download?utm_source=newsletter&utm_medium=email&utm_campaign=fall"),
      localStorage: {
        getItem: (key: string) => stored.get(key) ?? null,
        setItem: (key: string, value: string) => { stored.set(key, value); },
      },
      open,
    },
  });

  delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const disabledHref = trackStoreCtaClick({ store: "ios", surface: "landing_download_hub" });
  assert.equal(new URL(disabledHref).hostname, "apps.apple.com");
  assert.deepEqual(order, []);

  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = "test-token";
  const destination = trackStoreCtaClick({ store: "ios", surface: "landing_download_hub" });
  assert.deepEqual(order, ["init", "track"]);
  assert.equal(init.mock.calls[0].arguments[0], "test-token");
  const [eventName, properties] = track.mock.calls[0].arguments;
  assert.equal(eventName, "Store_CTA_Clicked");
  assert.equal(properties?.page_path, "/download");
  assert.equal(properties?.page_host, "some-in-univ.com");
  assert.equal(properties?.destination_url, destination);
  assert.equal(properties?.surface, "landing_download_hub");
  assert.equal(properties?.store, "ios");
  assert.equal(properties?.incoming_utm_source, "newsletter");
  assert.equal(properties?.incoming_utm_medium, "email");
  assert.equal(properties?.incoming_utm_campaign, "fall");
  assert.equal(properties?.utm_source, "web_landing_download_hub");
  assert.equal(properties?.utm_medium, "organic");
  assert.equal(properties?.utm_campaign, "seo_public_pages");
  const url = new URL(destination);
  assert.equal(url.searchParams.get("attribution_id"), properties?.attribution_id);
  assert.equal(url.searchParams.get("touch_id"), properties?.touch_id);
  assert.equal(url.hostname, "apps.apple.com");

  for (const gesture of [{}, { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const preventDefault = t.mock.fn();
    const anchor = { href: buildStoreUrl({ store: "android", surface: "landing_content_detail" }) };
    openStoreCtaInNewTab({ currentTarget: anchor, preventDefault, ...gesture }, {
      store: "android", surface: "landing_content_detail",
    });
    assert.equal(preventDefault.mock.callCount(), 0);
    const clicked = new URL(anchor.href);
    const referrer = new URLSearchParams(clicked.searchParams.get("referrer") ?? "");
    assert.equal(clicked.hostname, "play.google.com");
    assert.ok(clicked.searchParams.get("touch_id"));
    assert.equal(referrer.get("touch_id"), clicked.searchParams.get("touch_id"));
  }
  assert.equal(open.mock.callCount(), 0);
  assert.equal(init.mock.callCount(), 1);
  assert.equal(track.mock.callCount(), 7);
  assert.ok(track.mock.calls.every(({ arguments: args }) => args[0] === "Store_CTA_Clicked"));

  window.location.search = "";
  trackStoreCtaClick({ store: "android", surface: "landing_download_final" });
  const directProperties = track.mock.calls.at(-1)?.arguments[1];
  assert.equal(directProperties?.surface, "landing_download_final");
  assert.equal(directProperties?.incoming_utm_source, undefined);
  assert.equal(directProperties?.incoming_utm_medium, undefined);
  assert.equal(directProperties?.incoming_utm_campaign, undefined);

  delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const eventCount = track.mock.callCount();
  const untracked = trackStoreCtaClick({ store: "ios", surface: "landing_download_hub" });
  trackLandingPageView();
  assert.equal(new URL(untracked).hostname, "apps.apple.com");
  assert.equal(track.mock.callCount(), eventCount);
  assert.equal(identify.mock.callCount(), 0);
});

test("store clicks work without an analytics token or browser window", (t) => {
  const previousToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  t.after(() => {
    if (previousToken !== undefined) process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = previousToken;
  });
  const init = t.mock.method(mixpanel, "init", () => {});
  const track = t.mock.method(mixpanel, "track", () => {});
  const href = trackStoreCtaClick({ store: "android", surface: "landing_download_hub" });
  assert.equal(new URL(href).hostname, "play.google.com");
  assert.equal(init.mock.callCount(), 0);
  assert.equal(track.mock.callCount(), 0);
});
