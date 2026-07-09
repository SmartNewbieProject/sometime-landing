/** info → some-in-univ.com 유입 링크 빌더 */

export const APP_WEB_ORIGIN = "https://some-in-univ.com";

export type TrialPlacement =
  | "detail_bottom"
  | "faq_bottom"
  | "list_cta"
  | "home_cta";

export type TrialContentType = "story" | "card-news" | "faq" | "home";

/**
 * 비로그인 썸메이트(가상 인연) 체험 진입 URL.
 * - /auth/login = public acquisition shell
 * - tab=chat = 채팅(썸메이트) 탭
 */
export function buildSomemateTrialUrl(options: {
  contentType: TrialContentType;
  contentId?: string;
  placement: TrialPlacement;
}): string {
  const url = new URL(`${APP_WEB_ORIGIN}/auth/login`);
  url.searchParams.set("tab", "chat");
  url.searchParams.set("utm_source", "info");
  url.searchParams.set("utm_medium", "content");
  url.searchParams.set("utm_campaign", "somemate_trial");
  url.searchParams.set(
    "utm_content",
    [options.contentType, options.contentId ?? "hub", options.placement].join("__"),
  );
  url.searchParams.set("from", "info");
  return url.toString();
}
