"use client";

// X (Twitter) Ads Pixel helpers.
// Base pixel(config qxdc3)는 layout.tsx <head>에서 로드된다.
// Pixel id는 X Ads에서 발급된 확정값이라 하드코딩한다.
export const X_PIXEL_ID = "qxdc3";

// Events Manager의 "Download Tracker" 전환 이벤트 id (확정값, 2026-06-13 콘솔에서 확인).
// 픽셀 id처럼 클라이언트에 노출되는 공개 식별자라 기본값으로 둔다. env로 override 가능.
const X_DOWNLOAD_EVENT_ID =
  process.env.NEXT_PUBLIC_X_DOWNLOAD_EVENT_ID ?? "tw-qxdc3-qxdc6";

const TWCLID_KEY = "twclid";

declare global {
  interface Window {
    twq?: (...args: unknown[]) => void;
  }
}

/**
 * 랜딩 URL의 ?twclid= 를 1년짜리 first-party 쿠키로 보존한다.
 * CAPI에서 클릭과 전환을 매칭하는 식별자로 쓰인다.
 */
export function captureTwclid() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const twclid = params.get(TWCLID_KEY);
  if (!twclid) return;

  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${TWCLID_KEY}=${encodeURIComponent(
    twclid,
  )}; path=/; max-age=${oneYear}; SameSite=Lax; Secure`;
}

export function getTwclid(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)twclid=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * 다운로드/설치 인텐트 시점에 X 전환 이벤트를 발화한다.
 * conversion_id는 CAPI와 동일 값을 재사용해 Pixel/CAPI 중복 집계를 제거한다(dedup).
 * 반환값: 발화에 사용한 conversion_id (CAPI로 같이 보낼 용도) | null(미발화).
 */
export function fireXDownloadEvent(params?: {
  platform?: string;
  location?: string;
}): string | null {
  if (typeof window === "undefined" || typeof window.twq !== "function") {
    return null;
  }
  if (!X_DOWNLOAD_EVENT_ID) {
    // 전환 이벤트 id 미설정: 잘못된 id로 발화하지 않고 조용히 skip.
    console.warn(
      "[x-pixel] NEXT_PUBLIC_X_DOWNLOAD_EVENT_ID 미설정 — 전환 이벤트 미발화",
    );
    return null;
  }

  const conversionId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  window.twq("event", X_DOWNLOAD_EVENT_ID, {
    conversion_id: conversionId,
    contents: params
      ? [{ content_type: params.platform, content_name: params.location }]
      : undefined,
  });

  return conversionId;
}
