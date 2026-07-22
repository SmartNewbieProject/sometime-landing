const APP_STORE_LOOKUP_URL =
  "https://itunes.apple.com/lookup?id=6746120889&country=kr";

export type AppStoreRating = {
  ratingValue: number;
  ratingCount: number;
  version: string;
  storeUrl: string;
};

type LookupResult = {
  averageUserRating?: unknown;
  userRatingCount?: unknown;
  version?: unknown;
  trackViewUrl?: unknown;
};

export function parseAppStoreRating(payload: unknown): AppStoreRating | null {
  if (!payload || typeof payload !== "object" || !("results" in payload)) return null;

  const results = (payload as { results?: unknown }).results;
  if (!Array.isArray(results) || results.length === 0) return null;

  const result = results[0] as LookupResult;
  if (
    typeof result.averageUserRating !== "number" ||
    !Number.isFinite(result.averageUserRating) ||
    typeof result.userRatingCount !== "number" ||
    !Number.isInteger(result.userRatingCount) ||
    result.userRatingCount <= 0 ||
    typeof result.version !== "string" ||
    typeof result.trackViewUrl !== "string"
  ) {
    return null;
  }

  return {
    ratingValue: Number(result.averageUserRating.toFixed(2)),
    ratingCount: result.userRatingCount,
    version: result.version,
    storeUrl: result.trackViewUrl,
  };
}

export async function getAppStoreRating(): Promise<AppStoreRating | null> {
  try {
    const response = await fetch(APP_STORE_LOOKUP_URL, {
      next: { revalidate: 60 * 60 * 24 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return parseAppStoreRating(await response.json());
  } catch {
    return null;
  }
}
