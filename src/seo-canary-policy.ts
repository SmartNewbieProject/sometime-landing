export const APEX_CANONICAL_ORIGIN = "https://some-in-univ.com";
const RETIRED_APEX_PROXY_PARAM = "__apex_proxy";

export const APEX_CANONICAL_STATIC_PATHS = [
  "/",
  "/about",
  "/blog",
  "/card-news",
  "/community",
  "/community-guidelines",
  "/download",
  "/faq",
  "/press",
  "/privacy/easy",
  "/safety",
  "/verification",
] as const;

const APEX_CANONICAL_DYNAMIC_PREFIXES = [
  "/blog/",
  "/card-news/",
  "/community/",
  "/university/",
] as const;

const UNIVERSITY_CANONICAL_ALIASES = new Map<string, string>([
  ["KYGKYU", "SELKGU"],
  ["KYGKHU", "SELKHU"],
  ["DKJU", "KNU"],
  ["KYGDGU", "SELDGU"],
  ["TU", "DMU"],
  ["KYGMJU", "SELMJU"],
  ["KYGEUL", "EJU"],
  ["KYGJBU", "JOBU"],
  ["KYGCAU", "SELCAU"],
  ["KYGCUK", "SELCUK"],
  ["KYGSKUW", "SELSKK"],
  ["GJUE", "DKJE"],
  ["0000393", "0000392"],
  ["0002747", "0002746"],
  ["KYGHUFS", "SELHFS"],
]);

const staticPaths = new Set<string>(APEX_CANONICAL_STATIC_PATHS);
const APP_ONLY_PATHS = new Set([
  "/card-news/grid",
  "/community/love-court",
  "/community/write",
  "/community/videos",
  "/community/questions",
]);
const APP_ONLY_PREFIXES = [
  "/community/article/",
  "/community/love-court/",
  "/community/my/",
  "/community/questions/",
  "/community/report/",
  "/community/update/",
] as const;

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function isApexCanonicalPath(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  if (APP_ONLY_PATHS.has(normalized)) return false;
  if (APP_ONLY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return false;
  if (staticPaths.has(normalized)) return true;
  return APEX_CANONICAL_DYNAMIC_PREFIXES.some((prefix) =>
    normalized.startsWith(prefix),
  );
}

export function getCanonicalRedirect(
  host: string | undefined,
  pathname: string,
  search: string,
): string | null {
  if (!host || host.toLowerCase() !== "info.some-in-univ.com") return null;

  const searchParams = new URLSearchParams(search);
  searchParams.delete(RETIRED_APEX_PROXY_PARAM);
  const normalized = normalizePath(pathname);
  if (normalized !== "/sitemap.xml" && !isApexCanonicalPath(normalized)) return null;

  const universityMatch = normalized.match(/^\/university\/([^/]+)$/);
  const requestedCode = universityMatch?.[1];
  const canonicalCode = requestedCode
    ? UNIVERSITY_CANONICAL_ALIASES.get(decodeURIComponent(requestedCode))
    : undefined;
  const canonicalPath = canonicalCode
    ? `/university/${encodeURIComponent(canonicalCode)}`
    : normalized;
  const canonicalSearch = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  return `${APEX_CANONICAL_ORIGIN}${canonicalPath}${canonicalSearch}`;
}
