import { formatDate, pickImageFor, type CardNews } from "../../_lib/public-content";
import { contentSummary } from "../../_lib/content-presentation";
import { getCardNewsLifecycle, type PublicContentArchive } from "../../_lib/public-content-lifecycle";

export type ContentPreview = {
  id: string;
  href: string;
  title: string;
  description: string;
  image: string;
  label: string;
  meta?: string;
  source: "story" | "card-news" | "community";
  archive?: PublicContentArchive;
};

const archiveTitles: Record<string, string> = {
  "01a06231-88c0-78c6-845c-f1806bb15ebb": "9월 5일 소개팅 행사 기록",
  "019fa76a-a7c3-76dc-8052-a1e5f8a7db61": "매칭 후기 캠페인 기록",
  "019f6480-13b3-7686-9630-5ba94d3b1a16": "대전 대학생 로테이션 소개팅 행사 기록",
};

export function getCardNewsPreviews(items: CardNews[]): ContentPreview[] {
  const ids = new Set(items.map((item) => item.id));
  return items.filter((item) => {
    const { canonicalId } = getCardNewsLifecycle(item.id);
    return !canonicalId || !ids.has(canonicalId);
  }).map((item) => {
    const { archive, canonicalId } = getCardNewsLifecycle(item.id);
    return {
      id: canonicalId ?? item.id,
      href: `/card-news/${canonicalId ?? item.id}`,
      image: pickImageFor(item.id, item.backgroundImage, ...(item.sections ?? []).map((section) => section.imageUrl)),
      label: item.layoutMode === "longform" ? "소식·안내" : "이미지 카드",
      title: archive ? (archiveTitles[item.id] ?? `${archive.endedOn} ${archive.label} 기록`) : item.title,
      description: archive ? "" : contentSummary(item.subtitle),
      meta: formatDate(item.publishedAt),
      source: "card-news",
      archive,
    };
  });
}

export const CONTENT_PAGE_SIZE = 6;

/** Compact display only; callers retain the untouched source title for metadata. */
export function contentDisplayTitle(title: string): string {
  const lead = title.split(/｜|\s+\|\s+/u)[0].trim();
  return lead || title;
}

export type ContentListState = { category: string; page: number };
export type ContentListSearchParams = Record<string, string | string[] | undefined>;
export type ContentListPageProps = { searchParams: Promise<ContentListSearchParams> };

export function getContentListState(params: ContentListSearchParams): ContentListState {
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  return {
    category: typeof params.category === "string" ? params.category : "",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
}

export function contentListHref(path: string, state: ContentListState): string {
  const query = new URLSearchParams();
  if (state.category) query.set("category", state.category);
  if (state.page > 1) query.set("page", String(state.page));
  return query.size ? `${path}?${query}` : path;
}

export function getContentCategories(items: ContentPreview[]) {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (item.label) counts.set(item.label, (counts.get(item.label) ?? 0) + 1);
  }
  return Array.from(counts, ([label, count]) => ({ label, count }));
}

export function getContentPage(items: ContentPreview[], state: ContentListState) {
  const filtered = state.category ? items.filter((item) => item.label === state.category) : items;
  const pageCount = Math.ceil(filtered.length / CONTENT_PAGE_SIZE);
  const page = Math.min(state.page, Math.max(1, pageCount));
  const start = (page - 1) * CONTENT_PAGE_SIZE;
  return {
    items: filtered.slice(start, start + CONTENT_PAGE_SIZE),
    page,
    pageCount,
    start,
    total: filtered.length,
  };
}
