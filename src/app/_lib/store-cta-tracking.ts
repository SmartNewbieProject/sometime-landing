"use client";

import mixpanel from "mixpanel-browser";
import {
  buildStoreAttribution,
  buildStoreUrl,
  createUuidV7,
  getOrCreateLandingAttributionId,
  type Store,
  type StoreCtaSurface,
} from "./store-links";

let initialized = false;

export function initializeLandingMixpanel() {
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token || initialized) return;

  mixpanel.init(token, {
    autocapture: false,
    track_pageview: false,
    persistence: "localStorage",
  });
  initialized = true;
}

export function trackLandingPageView() {
  initializeLandingMixpanel();
  if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) return;

  const urlAttributionId =
    typeof window !== "undefined"
      ? new URL(window.location.href).searchParams.get("attribution_id")
      : null;
  const attributionId = getOrCreateLandingAttributionId(urlAttributionId);
  if (attributionId) mixpanel.identify(attributionId);

  mixpanel.track("Landing_Page_Viewed", {
    attribution_id: attributionId ?? undefined,
    path: typeof window !== "undefined" ? window.location.pathname : undefined,
    utm_source: urlAttributionParam("utm_source"),
    utm_medium: urlAttributionParam("utm_medium"),
    utm_campaign: urlAttributionParam("utm_campaign"),
  });
}

function urlAttributionParam(key: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URL(window.location.href).searchParams.get(key) ?? undefined;
}

export function trackStoreCtaClick({
  store,
  surface,
  href,
  legacyLocation: _legacyLocation,
  legacyType: _legacyType,
}: {
  store: Store;
  surface: StoreCtaSurface;
  href?: string;
  legacyLocation?: string;
  legacyType?: string;
}): string {
  initializeLandingMixpanel();

  const clickUrl = new URL(href ?? buildStoreUrl({ store, surface }));
  const attribution = buildStoreAttribution(surface);
  const attributionId =
    clickUrl.searchParams.get("attribution_id") ?? getOrCreateLandingAttributionId() ?? createUuidV7();
  const touchId = clickUrl.searchParams.get("touch_id") ?? createUuidV7();

  clickUrl.searchParams.set("attribution_id", attributionId);
  clickUrl.searchParams.set("touch_id", touchId);

  mixpanel.track("Store_CTA_Clicked", {
    attribution_id: attributionId,
    touch_id: touchId,
    utm_link_id: clickUrl.searchParams.get("utm_link_id") ?? undefined,
    surface,
    store,
    utm_source: clickUrl.searchParams.get("utm_source") ?? attribution.utm_source,
    utm_medium: clickUrl.searchParams.get("utm_medium") ?? attribution.utm_medium,
    utm_campaign: clickUrl.searchParams.get("utm_campaign") ?? attribution.utm_campaign,
  });
  return clickUrl.toString();
}

type StoreAnchorClickEvent = {
  preventDefault: () => void;
  currentTarget: { href: string };
  button?: number;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
};

export function openStoreCtaInNewTab(
  event: StoreAnchorClickEvent,
  input: { store: Store; surface: StoreCtaSurface },
) {
  const href = trackStoreCtaClick({ ...input, href: event.currentTarget.href });
  event.currentTarget.href = href;

  if (event.button !== undefined && event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  window.open(href, "_blank", "noopener,noreferrer");
}
