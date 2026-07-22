export const UNIVERSITY_SITEMAP_LIMIT = 18;
export const UNIVERSITY_SITEMAP_MIN_VERIFIED_COUNT = 20;

export const STATIC_SITEMAP_LASTMOD = {
  "/": "2025-07-28T13:56:11.000Z",
  "/blog": "2026-07-22T16:24:51.000Z",
  "/card-news": "2026-07-09T14:25:08.000Z",
  "/faq": "2026-07-09T15:46:09.000Z",
  "/safety": "2026-07-22T17:33:19.000Z",
  "/verification": "2026-07-22T17:33:19.000Z",
  "/privacy/easy": "2026-07-19T08:07:45.000Z",
  "/community-guidelines": "2026-07-19T08:07:45.000Z",
  "/press": "2026-07-19T08:07:45.000Z",
  "/about": "2026-07-19T11:22:01.000Z",
  "/download": "2026-07-22T18:03:42.000Z",
  "/university": "2026-07-22T17:33:19.000Z",
} as const;

export type StaticSitemapPath = keyof typeof STATIC_SITEMAP_LASTMOD;

function isValidDate(value: Date) {
  return Number.isFinite(value.valueOf());
}

export function parseOptionalDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return isValidDate(parsed) ? parsed : null;
}

export function getStaticSitemapLastmod(path: StaticSitemapPath): Date {
  return new Date(STATIC_SITEMAP_LASTMOD[path]);
}

export function maxLastmod(
  ...candidates: Array<Date | string | null | undefined>
): Date | null {
  const parsed = candidates
    .map((candidate) =>
      candidate instanceof Date ? candidate : parseOptionalDate(candidate ?? null),
    )
    .filter((candidate): candidate is Date => Boolean(candidate && isValidDate(candidate)));

  if (parsed.length === 0) return null;

  return parsed.reduce((latest, candidate) =>
    candidate.valueOf() > latest.valueOf() ? candidate : latest,
  );
}

export function resolveContentLastmod({
  updatedAt,
  publishedAt,
  fallback,
}: {
  updatedAt?: string | null;
  publishedAt?: string | null;
  fallback: Date | string;
}): Date {
  return (
    parseOptionalDate(updatedAt) ??
    parseOptionalDate(publishedAt) ??
    (fallback instanceof Date ? fallback : new Date(fallback))
  );
}
