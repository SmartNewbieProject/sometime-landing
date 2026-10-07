export const UNIVERSITY_SITEMAP_LIMIT = 18;
export const UNIVERSITY_SITEMAP_MIN_VERIFIED_COUNT = 20;

// Significant public-content revisions, not build/request timestamps.
// Advance the affected entry alongside a content change; app/API-owned pages
// retain their own version until that owner's release is verified.
export const STATIC_SITEMAP_LASTMOD = {
  "/": "2026-10-08T02:51:00+09:00",
  "/blog": "2026-09-08T00:00:00+09:00",
  "/stories": "2026-09-08T00:00:00+09:00",
  "/card-news": "2026-09-08T00:00:00+09:00",
  "/faq": "2026-09-08T00:00:00+09:00",
  "/safety": "2026-07-22T17:33:19.000Z",
  "/verification": "2026-07-22T17:33:19.000Z",
  "/privacy/easy": "2026-09-08T00:00:00+09:00",
  "/community-guidelines": "2026-09-08T00:00:00+09:00",
  "/press": "2026-09-08T00:00:00+09:00",
  "/about": "2026-09-08T00:00:00+09:00",
  "/download": "2026-09-08T00:00:00+09:00",
  "/university": "2026-09-08T00:00:00+09:00",
} as const;

// Mirrors of Naver posts carry X-Robots-Tag: noindex (app vercel.json /blog/naver-:id), and jp-
// posts belong to the Japan site. A sitemap must not submit URLs that tell Google not to index.
const NON_SITEMAP_BLOG_SLUG_PREFIXES = ["naver-", "jp-"] as const;

export function isSitemapBlogSlug(slug: string | null | undefined): slug is string {
  if (!slug) return false;
  return !NON_SITEMAP_BLOG_SLUG_PREFIXES.some((prefix) => slug.startsWith(prefix));
}

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
