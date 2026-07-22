import assert from "node:assert/strict";
import test from "node:test";
import {
  APP_STORE_URL,
  appendStoreClickIds,
  buildStoreUrl,
  createUuidV7,
  getOrCreateLandingAttributionId,
  GOOGLE_PLAY_URL,
} from "./store-links";

const UUID_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
test("store CTA URLs use official stores and preserve the attribution contract", () => {
  for (const store of ["ios", "android"] as const) {
    const url = new URL(buildStoreUrl({ store, surface: "landing_home_hero" }));

    assert.equal(url.hostname, store === "ios" ? "apps.apple.com" : "play.google.com");
    assert.equal(url.searchParams.get("store"), store);
    assert.equal(url.searchParams.get("surface"), "landing_home_hero");
    assert.equal(url.searchParams.get("utm_source"), "web_landing_home_hero");
    assert.equal(url.searchParams.get("utm_medium"), "organic");
    assert.equal(url.searchParams.get("utm_campaign"), "seo_public_pages");
  }
});

test("Android click identifiers are embedded in the Play Install Referrer", () => {
  const url = new URL(
    appendStoreClickIds({
      href: buildStoreUrl({ store: "android", surface: "landing_content_detail" }),
      store: "android",
      attributionId: "018f0000-0000-7000-8000-000000000001",
      touchId: "018f0000-0000-7000-8000-000000000002",
    }),
  );
  const referrer = new URLSearchParams(url.searchParams.get("referrer") ?? "");

  assert.equal(referrer.get("attribution_id"), "018f0000-0000-7000-8000-000000000001");
  assert.equal(referrer.get("touch_id"), "018f0000-0000-7000-8000-000000000002");
});

test("canonical official store URLs stay stable for entity and schema signals", () => {
  assert.equal(APP_STORE_URL, "https://apps.apple.com/kr/app/id6746120889");
  assert.equal(GOOGLE_PLAY_URL, "https://play.google.com/store/apps/details?id=com.smartnewb.sometimes");
});

test("click identifiers are valid UUIDv7 values", () => {
  assert.match(createUuidV7(), UUID_V7);
  assert.notEqual(createUuidV7(), createUuidV7());
});

test("getOrCreateLandingAttributionId returns null on the SSR path (no window)", () => {
  assert.equal(typeof globalThis.window, "undefined");
  assert.equal(getOrCreateLandingAttributionId(), null);
});

test("store URL builder never sends users through the removed 404 redirect", () => {
  assert.doesNotMatch(
    buildStoreUrl({ store: "ios", surface: "landing_download_hub" }),
    /api\.some-in-univ\.com\/api\/go/,
  );
});
