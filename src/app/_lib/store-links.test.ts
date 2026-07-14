import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { buildStoreUrl, createUuidV7, getOrCreateLandingAttributionId } from "./store-links";

const UUID_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const ACTIVE_CTA_FILES = [
  "src/app/_components/desktop/TopSection.tsx",
  "src/app/_components/desktop/DownloadSection.tsx",
  "src/app/_components/mobile/section/Seventh.tsx",
  "src/app/_components/public-content/ContentHome.tsx",
  "src/app/_components/auth-login-landing/AuthLoginLandingSections.tsx",
  "src/app/event/page.tsx",
  "src/app/event/[shortId]/page.tsx",
];

test("store CTA URLs use the first-party redirect and preserve the attribution contract", () => {
  for (const store of ["ios", "android"] as const) {
    const url = new URL(buildStoreUrl({ store, surface: "landing_home_hero" }));

    assert.equal(url.hostname, "api.some-in-univ.com");
    assert.match(url.pathname, /\/api\/go\/(store-ios|store-android)$/);
    assert.equal(url.searchParams.get("store"), store);
    assert.equal(url.searchParams.get("surface"), "landing_home_hero");
    assert.equal(url.searchParams.get("utm_source"), "web_landing_home_hero");
    assert.equal(url.searchParams.get("utm_medium"), "organic");
    assert.equal(url.searchParams.get("utm_campaign"), "seo_public_pages");
  }
});

test("click identifiers are valid UUIDv7 values", () => {
  assert.match(createUuidV7(), UUID_V7);
  assert.notEqual(createUuidV7(), createUuidV7());
});

test("getOrCreateLandingAttributionId returns null on the SSR path (no window)", () => {
  assert.equal(typeof globalThis.window, "undefined");
  assert.equal(getOrCreateLandingAttributionId(), null);
});

test("active CTAs do not embed direct store URLs", () => {
  for (const relativePath of ACTIVE_CTA_FILES) {
    const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
    assert.doesNotMatch(source, /apps\.apple\.com|play\.google\.com/);
  }
});

