/**
 * document.referrer 를 고정 어휘 두 값으로만 줄인다. 원본 URL·호스트는 어디에도 남기지 않는다
 * (Mixpanel 의 $referrer 차단 정책 유지). 채널 값은 analytics/seo-organic-acquisition.md 의
 * utm_medium 어휘(seo, ai_search)와 맞춘다.
 */

export type ReferrerChannel =
  | "seo"
  | "ai_search"
  | "social"
  | "referral"
  | "internal"
  | "none"
  | "unparsed";

export type ReferrerClassification = {
  channel: ReferrerChannel;
  source?: string;
};

type HostRule = { pattern: RegExp; channel: ReferrerChannel; source: string };

// 앞선 규칙이 우선한다. AI 호스트(gemini.google.com, cue.search.naver.com)는 검색엔진보다 먼저 둔다.
const HOST_RULES: HostRule[] = [
  { pattern: /(^|\.)chatgpt\.com$/i, channel: "ai_search", source: "chatgpt" },
  { pattern: /(^|\.)chat\.openai\.com$/i, channel: "ai_search", source: "chatgpt" },
  { pattern: /(^|\.)perplexity\.ai$/i, channel: "ai_search", source: "perplexity" },
  { pattern: /(^|\.)claude\.ai$/i, channel: "ai_search", source: "claude" },
  { pattern: /(^|\.)gemini\.google\.com$/i, channel: "ai_search", source: "gemini" },
  { pattern: /(^|\.)copilot\.microsoft\.com$/i, channel: "ai_search", source: "copilot" },
  { pattern: /(^|\.)wrtn\.(ai|io)$/i, channel: "ai_search", source: "wrtn" },
  { pattern: /(^|\.)clova-x\.naver\.com$/i, channel: "ai_search", source: "clova-x" },
  { pattern: /(^|\.)cue\.search\.naver\.com$/i, channel: "ai_search", source: "clova-x" },
  { pattern: /(^|\.)grok\.com$/i, channel: "ai_search", source: "grok" },
  { pattern: /(^|\.)deepseek\.com$/i, channel: "ai_search", source: "deepseek" },

  { pattern: /^(www\.|m\.)?google\.[a-z.]+$/i, channel: "seo", source: "google" },
  { pattern: /(^|\.)search\.naver\.com$/i, channel: "seo", source: "naver" },
  { pattern: /^(www\.|m\.)?naver\.com$/i, channel: "seo", source: "naver" },
  { pattern: /^(search\.|www\.|m\.)?daum\.net$/i, channel: "seo", source: "daum" },
  { pattern: /(^|\.)bing\.com$/i, channel: "seo", source: "bing" },
  { pattern: /(^|\.)duckduckgo\.com$/i, channel: "seo", source: "duckduckgo" },
  { pattern: /(^|\.)zum\.com$/i, channel: "seo", source: "zum" },
  { pattern: /(^|\.)search\.yahoo\.(com|co\.jp)$/i, channel: "seo", source: "yahoo" },

  { pattern: /(^|\.)instagram\.com$/i, channel: "social", source: "instagram" },
  { pattern: /(^|\.)threads\.(com|net)$/i, channel: "social", source: "threads" },
  { pattern: /(^|\.)facebook\.com$/i, channel: "social", source: "facebook" },
  { pattern: /^(t\.co|x\.com|twitter\.com)$/i, channel: "social", source: "x" },
  { pattern: /(^|\.)youtube\.com$/i, channel: "social", source: "youtube" },

  { pattern: /^(m\.)?blog\.naver\.com$/i, channel: "referral", source: "naver_blog" },
  { pattern: /^(m\.)?cafe\.naver\.com$/i, channel: "referral", source: "naver_cafe" },
  { pattern: /^kin\.naver\.com$/i, channel: "referral", source: "naver_kin" },
  { pattern: /(^|\.)everytime\.kr$/i, channel: "referral", source: "everytime" },
];

const OWN_HOST = /(^|\.)some-in-univ\.com$/i;

// 구글 앱 검색 결과는 http 호스트 대신 android-app 스킴으로 들어온다.
const GOOGLE_APP_REFERRER = "android-app://com.google.android.googlequicksearchbox";

export function classifyReferrer(
  referrer: string | null | undefined,
  currentHost?: string,
): ReferrerClassification {
  const raw = referrer?.trim();
  if (!raw) return { channel: "none" };

  if (raw.toLowerCase().startsWith(GOOGLE_APP_REFERRER)) {
    return { channel: "seo", source: "google" };
  }

  let hostname: string;
  try {
    hostname = new URL(raw).hostname;
  } catch {
    return { channel: "unparsed" };
  }
  if (!hostname) return { channel: "unparsed" };

  if (OWN_HOST.test(hostname) || (currentHost && hostname === currentHost.split(":")[0])) {
    return { channel: "internal" };
  }

  for (const rule of HOST_RULES) {
    if (rule.pattern.test(hostname)) return { channel: rule.channel, source: rule.source };
  }
  return { channel: "referral" };
}
