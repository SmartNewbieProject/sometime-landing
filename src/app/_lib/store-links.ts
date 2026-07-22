export type Store = "ios" | "android";

export type StoreCtaSurface =
  | "landing_home_hero"
  | "landing_home_header"
  | "landing_home_mobile"
  | "landing_home_floating"
  | "landing_home_footer"
  | "landing_content_hub"
  | "landing_download_hub"
  | "landing_public_guide"
  | "landing_university"
  | "landing_content_sticky"
  | "landing_content_footer"
  | "landing_event"
  | "landing_gift_message";

export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ?? "https://apps.apple.com/kr/app/id6746120889";
export const GOOGLE_PLAY_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ??
  "https://play.google.com/store/apps/details?id=com.smartnewb.sometimes";

const STORE_URLS: Record<Store, string> = {
  ios: APP_STORE_URL,
  android: GOOGLE_PLAY_URL,
};
const UTM_LINK_IDS: Record<Store, string | undefined> = {
  ios: process.env.NEXT_PUBLIC_STORE_CTA_IOS_UTM_LINK_ID,
  android: process.env.NEXT_PUBLIC_STORE_CTA_ANDROID_UTM_LINK_ID,
};

export const buildStoreAttribution = (surface: StoreCtaSurface) => ({
  utm_source: `web_${surface}`,
  utm_medium: "organic",
  utm_campaign: "seo_public_pages",
});

export function buildStoreUrl({ store, surface }: { store: Store; surface: StoreCtaSurface }): string {
  const url = new URL(STORE_URLS[store]);
  const attribution = buildStoreAttribution(surface);

  url.searchParams.set("store", store);
  url.searchParams.set("surface", surface);
  for (const [key, value] of Object.entries(attribution)) url.searchParams.set(key, value);

  const utmLinkId = UTM_LINK_IDS[store];
  if (utmLinkId) url.searchParams.set("utm_link_id", utmLinkId);

  if (store === "ios") {
    url.searchParams.set("ct", attribution.utm_source);
    url.searchParams.set("mt", "8");
  } else {
    url.searchParams.set(
      "referrer",
      new URLSearchParams({ ...attribution, surface }).toString(),
    );
  }

  return url.toString();
}

export function createUuidV7(): string {
  const bytes = new Uint8Array(16);
  const randomUuid = globalThis.crypto?.randomUUID?.();

  if (randomUuid) {
    const hex = randomUuid.replaceAll("-", "");
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
    }
  } else {
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  }

  let timestamp = Date.now();
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = timestamp % 256;
    timestamp = Math.floor(timestamp / 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const LANDING_ATTRIBUTION_KEY = "sometimes_landing_attribution_id";

/** URL attribution_id > localStorage 캐시 > 신규 발급 순. 발급값은 localStorage 영속. SSR 시 null. */
export function getOrCreateLandingAttributionId(urlAttributionId?: string | null): string | null {
  if (typeof window === "undefined") return null;
  try {
    // URL 로 넘어온 값(캠페인 링크) 최우선 — 저장 후 반환
    if (urlAttributionId) {
      window.localStorage.setItem(LANDING_ATTRIBUTION_KEY, urlAttributionId);
      return urlAttributionId;
    }
    const cached = window.localStorage.getItem(LANDING_ATTRIBUTION_KEY);
    if (cached) return cached;
    const fresh = createUuidV7();
    window.localStorage.setItem(LANDING_ATTRIBUTION_KEY, fresh);
    return fresh;
  } catch {
    return null; // localStorage 차단 환경 — 조용히 null (임의 대체 금지)
  }
}
