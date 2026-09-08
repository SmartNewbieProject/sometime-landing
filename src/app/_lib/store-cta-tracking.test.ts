import assert from "node:assert/strict";
import test from "node:test";
import mixpanel from "mixpanel-browser";
import {
  openStoreCtaInNewTab,
  resolveLandingEnvironment,
  trackLandingPageView,
  trackStoreCtaClick,
} from "./store-cta-tracking";
import { buildStoreUrl } from "./store-links";

const ATTRIBUTION_ID = "018f0000-0000-7000-8000-000000000001";

test("page views keep allowlisted incoming attribution without collecting the raw query", (t) => {
  const previousToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const previousVercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  t.after(() => {
    if (previousToken === undefined) delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    else process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = previousToken;
    if (previousVercelEnv === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = previousVercelEnv;
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  });

  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = "test-token";
  process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
  const stored = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: new URL("https://sometime-landing-feature.vercel.app/download"),
      localStorage: {
        getItem: (key: string) => stored.get(key) ?? null,
        setItem: (key: string, value: string) => { stored.set(key, value); },
      },
    },
  });

  const init = t.mock.method(mixpanel, "init", () => {});
  const identify = t.mock.method(mixpanel, "identify", () => {});
  const track = t.mock.method(mixpanel, "track", () => {});
  trackLandingPageView({
    pathname: "/download",
    search: `utm_source=newsletter&utm_medium=email&utm_campaign=fall&utm_content=hero&utm_term=dating&utm_id=launch&attribution_id=${ATTRIBUTION_ID}&email=private%40example.com&query=sensitive`,
  });

  assert.equal(init.mock.callCount(), 1);
  assert.equal(init.mock.calls[0].arguments[0], "test-token");
  assert.deepEqual(init.mock.calls[0].arguments[1]?.property_blacklist, [
    "$current_url",
    "$referrer",
    "$initial_referrer",
  ]);
  assert.equal(identify.mock.calls[0].arguments[0], ATTRIBUTION_ID);
  const [eventName, properties] = track.mock.calls[0].arguments;
  assert.equal(eventName, "Landing_Page_Viewed");
  assert.equal(properties?.env, "preview");
  assert.equal(properties?.page, "/download");
  assert.equal(properties?.page_path, "/download");
  assert.equal(properties?.page_host, "sometime-landing-feature.vercel.app");
  assert.equal(properties?.incoming_utm_source, "newsletter");
  assert.equal(properties?.incoming_utm_medium, "email");
  assert.equal(properties?.incoming_utm_campaign, "fall");
  assert.equal(properties?.incoming_utm_content, "hero");
  assert.equal(properties?.incoming_utm_term, "dating");
  assert.equal(properties?.incoming_utm_id, "launch");
  assert.equal(properties?.attribution_id, ATTRIBUTION_ID);
  assert.equal(properties?.query_string, undefined);
  assert.equal(properties?.path_with_query, undefined);
  assert.equal(properties?.email, undefined);
  assert.equal(properties?.query, undefined);
});

test("store clicks separate inbound campaign and outbound placement with a canonical destination", (t) => {
  const previousToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const previousVercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  t.after(() => {
    if (previousToken === undefined) delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    else process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = previousToken;
    if (previousVercelEnv === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = previousVercelEnv;
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  });

  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = "test-token";
  process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
  const stored = new Map<string, string>([["sometimes_landing_attribution_id", ATTRIBUTION_ID]]);
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: new URL("https://info.some-in-univ.com/download?utm_source=newsletter&utm_medium=email&utm_campaign=fall&utm_content=top"),
      localStorage: {
        getItem: (key: string) => stored.get(key) ?? null,
        setItem: (key: string, value: string) => { stored.set(key, value); },
      },
    },
  });

  t.mock.method(mixpanel, "init", () => {});
  const track = t.mock.method(mixpanel, "track", () => {});
  const href = new URL(buildStoreUrl({ store: "ios", surface: "landing_download_hub" }));
  href.searchParams.set("utm_content", "x".repeat(500));
  const destination = trackStoreCtaClick({
    store: "ios",
    surface: "landing_download_hub",
    href: href.toString(),
  });

  const [eventName, properties] = track.mock.calls[0].arguments;
  assert.equal(eventName, "Store_CTA_Clicked");
  assert.equal(properties?.env, "production");
  assert.equal(properties?.page, "/download");
  assert.equal(properties?.page_path, "/download");
  assert.equal(properties?.position, "landing_download_hub");
  assert.equal(properties?.surface, "landing_download_hub");
  assert.equal(properties?.store, "ios");
  assert.equal(properties?.page_host, "info.some-in-univ.com");
  assert.equal(properties?.destination_url, "https://apps.apple.com/kr/app/id6746120889");
  assert.ok(String(properties?.destination_url).length < 255);
  assert.equal(properties?.destination_host, "apps.apple.com");
  assert.equal(properties?.destination_path, "/kr/app/id6746120889");
  assert.equal(properties?.destination_app_id, "6746120889");
  assert.equal(properties?.incoming_utm_source, "newsletter");
  assert.equal(properties?.incoming_utm_medium, "email");
  assert.equal(properties?.incoming_utm_campaign, "fall");
  assert.equal(properties?.incoming_utm_content, "top");
  assert.equal(properties?.outbound_utm_source, "web_landing_download_hub");
  assert.equal(properties?.outbound_utm_medium, "organic");
  assert.equal(properties?.outbound_utm_campaign, "seo_public_pages");
  assert.equal(properties?.utm_source, undefined);
  assert.equal(properties?.destination_query, undefined);
  assert.notEqual(properties?.destination_url, destination);

  const url = new URL(destination);
  assert.equal(url.searchParams.get("attribution_id"), properties?.attribution_id);
  assert.equal(url.searchParams.get("touch_id"), properties?.touch_id);
  assert.equal(url.hostname, "apps.apple.com");
});

test("native anchor navigation is preserved while click identifiers are appended", (t) => {
  const previousToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  t.after(() => {
    if (previousToken === undefined) delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    else process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = previousToken;
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  });
  Reflect.deleteProperty(globalThis, "window");

  const init = t.mock.method(mixpanel, "init", () => {});
  const track = t.mock.method(mixpanel, "track", () => {});
  for (const gesture of [{}, { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const preventDefault = t.mock.fn();
    const anchor = { href: buildStoreUrl({ store: "android", surface: "landing_content_detail" }) };
    openStoreCtaInNewTab({ currentTarget: anchor, preventDefault, ...gesture }, {
      store: "android",
      surface: "landing_content_detail",
    });
    assert.equal(preventDefault.mock.callCount(), 0);
    const clicked = new URL(anchor.href);
    const referrer = new URLSearchParams(clicked.searchParams.get("referrer") ?? "");
    assert.equal(clicked.hostname, "play.google.com");
    assert.ok(clicked.searchParams.get("touch_id"));
    assert.equal(referrer.get("touch_id"), clicked.searchParams.get("touch_id"));
  }
  assert.equal(init.mock.callCount(), 0);
  assert.equal(track.mock.callCount(), 0);
});

test("environment classification prefers Vercel and safely falls back to the browser host", (t) => {
  const previousVercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  t.after(() => {
    if (previousVercelEnv === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = previousVercelEnv;
  });

  process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
  assert.equal(resolveLandingEnvironment("localhost"), "production");
  process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
  assert.equal(resolveLandingEnvironment("info.some-in-univ.com"), "preview");
  process.env.NEXT_PUBLIC_VERCEL_ENV = "development";
  assert.equal(resolveLandingEnvironment("example.com"), "local");
  delete process.env.NEXT_PUBLIC_VERCEL_ENV;
  assert.equal(resolveLandingEnvironment("some-in-univ.com"), "production");
  assert.equal(resolveLandingEnvironment("www.some-in-univ.com"), "production");
  assert.equal(resolveLandingEnvironment("info.some-in-univ.com"), "production");
  assert.equal(resolveLandingEnvironment("branch.vercel.app"), "preview");
  assert.equal(resolveLandingEnvironment("localhost"), "local");
  assert.equal(resolveLandingEnvironment("unknown.example"), "local");
});
