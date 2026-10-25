// HTML 공지 문서 조립. 앱 sometimes-app/src/features/card-news/lib/notice-document.ts 의 웹 축약판이다.
// HTML/CSS 검증은 서버(notice-html-policy.ts)가 맡고, 여기서는 봉투와 문서 탈출만 막는다.
export type NoticeHtml = {
  safeHtml: string;
  safeCss: string;
  revision: number;
  policyVersion: number;
  country: "kr" | "jp";
  allowedImagePrefixes: string[];
};

const MAX_HTML_BYTES = 256 * 1024;
const MAX_CSS_BYTES = 12 * 1024;

const REDUCED_MOTION_CSS =
  "@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-delay:0s!important;animation-iteration-count:1!important}}";

const isHttpsPrefix = (value: unknown) => {
  if (typeof value !== "string" || !value.endsWith("/") || /[\s'"<>;\\]/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash;
  } catch {
    return false;
  }
};

const hasForbiddenAttributes = (html: string) => {
  const tags = html.match(/<[a-z][a-z0-9]*\b(?:[^<>"']|"[^"]*"|'[^']*')*>/gi) ?? [];
  return tags.some((tag) => /\b(href|srcset|on[a-z]+)\s*=/i.test(tag.replace(/"[^"]*"|'[^']*'/g, '""')));
};

export function buildNoticeDocument(notice: NoticeHtml | null | undefined): string | null {
  if (
    !notice ||
    notice.policyVersion !== 1 ||
    !["kr", "jp"].includes(notice.country) ||
    typeof notice.safeHtml !== "string" ||
    typeof notice.safeCss !== "string" ||
    Buffer.byteLength(notice.safeHtml) > MAX_HTML_BYTES ||
    Buffer.byteLength(notice.safeCss) > MAX_CSS_BYTES ||
    !Array.isArray(notice.allowedImagePrefixes) ||
    notice.allowedImagePrefixes.length > 8 ||
    !notice.allowedImagePrefixes.every(isHttpsPrefix) ||
    /<\s*\/?\s*(script|style|html|head|body|meta|base|link|iframe|object|embed|svg|math|form)\b/i.test(notice.safeHtml) ||
    hasForbiddenAttributes(notice.safeHtml) ||
    /</.test(notice.safeCss)
  )
    return null;
  const images = notice.allowedImagePrefixes.join(" ") || "'none'";
  const csp = `default-src 'none'; script-src 'none'; connect-src 'none'; img-src ${images}; style-src 'unsafe-inline'; font-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`;
  return `<!doctype html><html lang="${notice.country === "jp" ? "ja" : "ko"}"><head><meta http-equiv="Content-Security-Policy" content="${csp.replace(/"/g, "&quot;")}"><meta charset="utf-8"><meta name="referrer" content="no-referrer"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${notice.safeCss}\nhtml{font-size:16px}body{margin:0;padding:16px;overflow-wrap:anywhere;font-family:system-ui,sans-serif}img{max-width:100%;height:auto}table{max-width:100%}${REDUCED_MOTION_CSS}</style></head><body>${notice.safeHtml}</body></html>`;
}
