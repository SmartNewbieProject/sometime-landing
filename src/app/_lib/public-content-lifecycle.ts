export type PublicContentIntent = "editorial" | "notice" | "campaign";

export type PublicContentArchive = {
  label: "종료된 행사" | "종료된 캠페인";
  /** Source-stated event or participation end date, as YYYY-MM-DD. */
  endedOn: string;
};

export type PublicContentScopeReview = {
  reason: "pricing-rationale" | "campaign-instructions";
  resolution: "removed-from-public-response";
  repairArtifact: "src/app/_lib/public-content-repairs.ts";
};

export type PublicContentLifecycle = {
  intent: PublicContentIntent;
  archive?: PublicContentArchive;
  /** Another source record is authoritative for this duplicate. */
  canonicalId?: string;
  /** Resolved public-scope review with its reversible local repair artifact. */
  scopeReview?: PublicContentScopeReview;
};

const LIFECYCLE_BY_CARD_NEWS_ID = {
  // Source title and body state the 2026-09-05 event date.
  "01a06231-88c0-78c6-845c-f1806bb15ebb": {
    intent: "campaign",
    archive: { label: "종료된 행사", endedOn: "2026-09-05" },
  },
  // Consumer-facing legal and operational notices remain public records.
  "01a0122f-ad89-7163-b359-4c4e49ae3ba0": { intent: "notice" },
  "019fc652-600c-7864-812c-e603e791e9af": { intent: "notice" },
  "019fbd19-4538-770b-ad58-2b8c92c221d6": { intent: "notice" },
  "019f78e5-60f3-758d-97d7-3168ea4afb25": { intent: "notice" },
  "019ef7ed-babd-7860-a5eb-740c2e4892bc": { intent: "notice" },
  "019c8677-d138-79c0-837e-a5d6be809910": { intent: "notice" },
  "019c235f-3942-7bf1-9130-0ae116ba8d28": { intent: "notice" },
  // Source table states participation through 2026-08-14 23:59.
  "019fa76a-a7c3-76dc-8052-a1e5f8a7db61": {
    intent: "campaign",
    archive: { label: "종료된 캠페인", endedOn: "2026-08-14" },
  },
  // Source body states the 2026-07-31 event date.
  "019f6480-13b3-7686-9630-5ba94d3b1a16": {
    intent: "campaign",
    archive: { label: "종료된 행사", endedOn: "2026-07-31" },
  },
  // The earlier record has the same body, description, and source image, and
  // retains the report title plus existing reads/likes. Keep it canonical.
  "518873ef-fe1e-4f6c-994c-f1b542544a82": {
    intent: "editorial",
    canonicalId: "019fef4b-e4d8-7f40-aa12-00d7fb0b649f",
  },
  // Records stay public; only approved strategic blocks are locally removed.
  "019cad1b-7df2-7fae-a002-74ac08e16fce": {
    intent: "notice",
    scopeReview: {
      reason: "pricing-rationale",
      resolution: "removed-from-public-response",
      repairArtifact: "src/app/_lib/public-content-repairs.ts",
    },
  },
  "6b21fae4-26e1-4c85-a72a-0768a633ddce": {
    intent: "campaign",
    scopeReview: {
      reason: "campaign-instructions",
      resolution: "removed-from-public-response",
      repairArtifact: "src/app/_lib/public-content-repairs.ts",
    },
  },
} as const satisfies Record<string, PublicContentLifecycle>;

const DEFAULT_LIFECYCLE: PublicContentLifecycle = { intent: "editorial" };

/**
 * Presentation metadata for audited card-news records. This helper does not
 * infer expiry from age and does not filter, mutate, or rewrite provider data.
 */
export function getCardNewsLifecycle(id: string): PublicContentLifecycle {
  return LIFECYCLE_BY_CARD_NEWS_ID[id as keyof typeof LIFECYCLE_BY_CARD_NEWS_ID]
    ?? DEFAULT_LIFECYCLE;
}
