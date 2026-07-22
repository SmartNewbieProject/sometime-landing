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
  const urlAttributionId = searchParams.get("attribution_id");
  const attributionId = getOrCreateLandingAttributionId(urlAttributionId);
  if (attributionId) mixpanel.identify(attributionId);

  mixpanel.track("Landing_Page_Viewed", {
    attribution_id: attributionId ?? undefined,
    path: normalizedPathname ?? undefined,
    query_string: searchParams.toString() || undefined,
    path_with_query:
      normalizedPathname && searchParams.toString()
        ? `${normalizedPathname}?${searchParams.toString()}`
        : normalizedPathname ?? undefined,
    utm_source: searchParams.get("utm_source") ?? undefined,
    utm_medium: searchParams.get("utm_medium") ?? undefined,
    utm_campaign: searchParams.get("utm_campaign") ?? undefined,
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
    clickUrl.searchParams.get("attribution_id") ?? getOrCreateLandingAttributionId() ?? createUuidV7();
  const touchId = clickUrl.searchParams.get("touch_id") ?? createUuidV7();

  const attributedClickUrl = new URL(
    appendStoreClickIds({ href: clickUrl.toString(), store, attributionId, touchId }),
  );

  mixpanel.track("Store_CTA_Clicked", {
    attribution_id: attributionId,
    touch_id: touchId,
    utm_link_id: attributedClickUrl.searchParams.get("utm_link_id") ?? undefined,
    surface,
    store,
    utm_source: attributedClickUrl.searchParams.get("utm_source") ?? attribution.utm_source,
    utm_medium: attributedClickUrl.searchParams.get("utm_medium") ?? attribution.utm_medium,
    utm_campaign: attributedClickUrl.searchParams.get("utm_campaign") ?? attribution.utm_campaign,
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

  if (event.button !== undefined && event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  window.open(href, "_blank", "noopener,noreferrer");
}
