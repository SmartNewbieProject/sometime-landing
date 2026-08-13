export const APEX_CANONICAL_ORIGIN = "https://some-in-univ.com";
export const APEX_CANONICAL_PATHS = ["/safety", "/verification"] as const;

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function isApexCanonicalPath(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  return APEX_CANONICAL_PATHS.some((path) => path === normalized);
}

export function getCanonicalRedirect(
  host: string | undefined,
  pathname: string,
  search: string,
): string | null {
  if (!host || host.toLowerCase() !== "info.some-in-univ.com") return null;
  const normalized = normalizePath(pathname);
  if (!isApexCanonicalPath(normalized)) return null;
  return `${APEX_CANONICAL_ORIGIN}${normalized}${search}`;
}
