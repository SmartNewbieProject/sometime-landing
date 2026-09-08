"use client";

import mixpanel from "mixpanel-browser";
import {
  appendStoreClickIds,
  buildStoreAttribution,
  buildStoreUrl,
  createUuidV7,
  getOrCreateLandingAttributionId,
  type Store,
  type StoreCtaSurface,
} from "./store-links";

let initialized = false;

const TRACKING_VALUE_LIMIT = 255;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type LandingEnvironment = "production" | "preview" | "local";

export function resolveLandingEnvironment(hostname?: string): LandingEnvironment {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") return "production";
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return "preview";
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "development") return "local";

  if (
    hostname === "some-in-univ.com" ||
    hostname === "www.some-in-univ.com" ||
    hostname === "info.some-in-univ.com" ||
    hostname === "sometime-landing.vercel.app"
  ) {
    return "production";
  }
  if (hostname?.endsWith(".vercel.app")) return "preview";
  return "local";
}

function trackedQueryValue(searchParams: URLSearchParams, key: string): string | undefined {
  return searchParams.get(key)?.slice(0, TRACKING_VALUE_LIMIT) || undefined;
}

function incomingAttribution(searchParams: URLSearchParams) {
  return {
    incoming_utm_source: trackedQueryValue(searchParams, "utm_source"),
    incoming_utm_medium: trackedQueryValue(searchParams, "utm_medium"),
    incoming_utm_campaign: trackedQueryValue(searchParams, "utm_campaign"),
    incoming_utm_content: trackedQueryValue(searchParams, "utm_content"),
    incoming_utm_term: trackedQueryValue(searchParams, "utm_term"),
    incoming_utm_id: trackedQueryValue(searchParams, "utm_id"),
  };
}

function validClickId(value: string | null): string | undefined {
  return value && UUID.test(value) ? value : undefined;
}

function storeDestination(url: URL, store: Store) {
  const destinationAppId =
    store === "android"
      ? url.searchParams.get("id") ?? undefined
      : url.pathname.match(/\/id(\d+)/)?.[1];

  return {
    destination_url: `${url.origin}${url.pathname}`,
    destination_host: url.host,
    destination_path: url.pathname,
    destination_app_id: destinationAppId,
  };
}

export function initializeLandingMixpanel() {
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token || initialized) return;

  mixpanel.init(token, {
    autocapture: false,
    track_pageview: false,
    persistence: "localStorage",
    property_blacklist: ["$current_url", "$referrer", "$initial_referrer"],
  });
  initialized = true;
}

export function trackLandingPageView({
  pathname,
  search,
}: {
  pathname?: string | null;
  search?: string | null;
} = {}) {
  initializeLandingMixpanel();
  if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) return;

  const normalizedPathname =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : undefined);
  const normalizedSearch =
    search ?? (typeof window !== "undefined" ? window.location.search : undefined) ?? "";
  const searchParams = new URLSearchParams(normalizedSearch.replace(/^\?/, ""));
  const urlAttributionId = validClickId(searchParams.get("attribution_id"));
  const attributionId = getOrCreateLandingAttributionId(urlAttributionId);
  if (attributionId) mixpanel.identify(attributionId);

  const page = typeof window !== "undefined" ? window.location : undefined;
  mixpanel.track("Landing_Page_Viewed", {
    env: resolveLandingEnvironment(page?.hostname),
    attribution_id: attributionId ?? undefined,
    page: normalizedPathname ?? undefined,
    page_path: normalizedPathname ?? undefined,
    page_host: page?.host,
    ...incomingAttribution(searchParams),
  });
}

export function trackStoreCtaClick(input: {
  store: Store;
  surface: StoreCtaSurface;
  href?: string;
  legacyLocation?: string;
  legacyType?: string;
}): string {
  const { store, surface, href } = input;
  initializeLandingMixpanel();

  const clickUrl = new URL(href ?? buildStoreUrl({ store, surface }));
  const attribution = buildStoreAttribution(surface);
  const attributionId =
    validClickId(clickUrl.searchParams.get("attribution_id")) ??
    getOrCreateLandingAttributionId() ??
    createUuidV7();
  const touchId = validClickId(clickUrl.searchParams.get("touch_id")) ?? createUuidV7();

  const attributedClickUrl = new URL(
    appendStoreClickIds({ href: clickUrl.toString(), store, attributionId, touchId }),
  );

  if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) return attributedClickUrl.toString();

  const page = typeof window !== "undefined" ? window.location : undefined;
  const incoming = new URLSearchParams(page?.search ?? "");
  mixpanel.track("Store_CTA_Clicked", {
    env: resolveLandingEnvironment(page?.hostname),
    attribution_id: attributionId,
    touch_id: touchId,
    utm_link_id: trackedQueryValue(attributedClickUrl.searchParams, "utm_link_id"),
    page: page?.pathname,
    page_path: page?.pathname,
    page_host: page?.host,
    position: surface,
    surface,
    store,
    ...storeDestination(attributedClickUrl, store),
    ...incomingAttribution(incoming),
    outbound_utm_source:
      trackedQueryValue(attributedClickUrl.searchParams, "utm_source") ?? attribution.utm_source,
    outbound_utm_medium:
      trackedQueryValue(attributedClickUrl.searchParams, "utm_medium") ?? attribution.utm_medium,
    outbound_utm_campaign:
      trackedQueryValue(attributedClickUrl.searchParams, "utm_campaign") ?? attribution.utm_campaign,
  });
  return attributedClickUrl.toString();
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
  // Let the anchor's target and the browser's modifier-key behavior navigate.
}
