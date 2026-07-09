import { cache } from "react";

const API_BASE_URL =
  process.env.SOMETIME_PUBLIC_CONTENT_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.some-in-univ.com/api";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://info.some-in-univ.com";

/** 로컬 브랜드 폴백 — CDN 403/미존재 시 사용 (preview_title 9MB 회피) */
export const IMAGE_FALLBACKS = [
  "/images/intro1.png",
  "/images/intro2.png",
  "/images/intro3.png",
  "/images/pick-some.png",
  "/images/pepero.jpg",
  "/images/happy-some.png",
] as const;

/** 접근 불가·플레이스홀더로 알려진 URL 조각 */
const BROKEN_URL_MARKERS = [
  "resources/sometime-story.png",
  "resources/sometime-story",
];

export type MediaAsset = {
  url?: string;
  alt?: string;
  type?: string;
};

export type SometimeArticle = {
  id: string;
  slug: string;
  status: string;
  category: string;
  title: string;
  subtitle: string | null;
  content: string;
  excerpt: string | null;
  thumbnail?: MediaAsset | null;
  coverImage?: MediaAsset | null;
  author?: { name?: string } | null;
  viewCount?: number;
  shareCount?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords?: string[];
  } | null;
  publishedAt: string | null;
  updatedAt: string | null;
};

export type SometimeArticleListItem = Pick<
  SometimeArticle,
  | "id"
  | "slug"
  | "status"
  | "category"
  | "title"
  | "subtitle"
  | "excerpt"
  | "thumbnail"
  | "coverImage"
  | "author"
  | "viewCount"
  | "publishedAt"
>;

export type CardNewsSection = {
  id?: string;
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
};

export type CardNews = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  backgroundImage?: MediaAsset | null;
  sections?: CardNewsSection[];
  sectionCount?: number;
  readCount?: number;
  likeCount?: number;
  publishedAt?: string | null;
  layoutMode?: string | null;
  body?: string | null;
};

export type CommunityPostImage = {
  id?: string;
  imageUrl?: string | null;
  url?: string | null;
  displayOrder?: number;
};

export type CommunityPost = {
  id: string;
  title: string;
  content?: string | null;
  description?: string | null;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  publishedAt?: string | null;
  customBackgroundUrl?: string | null;
  images?: CommunityPostImage[] | null;
  author?: {
    name?: string;
    universityDetails?: { name?: string };
  } | null;
};

type ApiList<T> = {
  items?: T[];
  data?: T[];
  meta?: {
    currentPage?: number;
    itemsPerPage?: number;
    totalItems?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
  success?: boolean;
  nextCursor?: string | null;
  hasMore?: boolean;
};

/** sometime-articles public API max limit */
const ARTICLE_PAGE_LIMIT = 50;

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
        // multi-schema API 기본 국가
        "X-Country": "kr",
      },
    });

    if (!response.ok) return null;
    const json = (await response.json()) as T & { success?: boolean; errorCode?: string };
    // Nest 검증 실패 등이 200 아닌 경우 처리. 일부 에러 envelope 방어.
    if (json && typeof json === "object" && "success" in json && json.success === false) {
      return null;
    }
    return json as T;
  } catch {
    return null;
  }
}

function listItems<T>(payload: ApiList<T> | null | undefined): T[] {
  if (!payload) return [];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

export const getBlogArticles = cache(async (limit = 48) => {
  const safeLimit = Math.min(Math.max(limit, 1), ARTICLE_PAGE_LIMIT);
  const payload = await fetchJson<ApiList<SometimeArticleListItem>>(
    `/sometime-articles?limit=${safeLimit}&page=1`,
  );
  return listItems(payload);
});

/** 사이트맵 등 전량 수집 — page 단위로 순회 (limit max 50) */
export async function getAllBlogArticles(): Promise<SometimeArticleListItem[]> {
  const all: SometimeArticleListItem[] = [];
  let page = 1;

  while (page <= 20) {
    const payload = await fetchJson<ApiList<SometimeArticleListItem>>(
      `/sometime-articles?limit=${ARTICLE_PAGE_LIMIT}&page=${page}`,
    );
    const items = listItems(payload);
    all.push(...items);

    const hasNext =
      payload?.meta?.hasNextPage === true || items.length === ARTICLE_PAGE_LIMIT;
    if (!hasNext || items.length === 0) break;
    page += 1;
  }

  return all;
}

export const getBlogArticle = cache(async (slug: string) => {
  return fetchJson<SometimeArticle>(`/sometime-articles/${encodeURIComponent(slug)}`);
});

export const getCardNewsList = cache(async (limit = 48) => {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const payload = await fetchJson<ApiList<CardNews>>(
    `/posts/card-news?limit=${safeLimit}&includeReadState=false`,
  );
  return listItems(payload);
});

/** 카드뉴스 커서 페이지네이션 전량 (사이트맵용) */
export async function getAllCardNews(): Promise<CardNews[]> {
  const all: CardNews[] = [];
  let cursor: string | null = null;
  let guard = 0;

  while (guard < 30) {
    const qs = new URLSearchParams({
      limit: "50",
      includeReadState: "false",
    });
    if (cursor) qs.set("cursor", cursor);

    const payload = await fetchJson<ApiList<CardNews>>(`/posts/card-news?${qs.toString()}`);
    const items = listItems(payload);
    all.push(...items);

    if (!payload?.hasMore || !payload.nextCursor || items.length === 0) break;
    cursor = payload.nextCursor;
    guard += 1;
  }

  return all;
}

export const getCardNews = cache(async (id: string) => {
  return fetchJson<CardNews>(`/posts/card-news/${encodeURIComponent(id)}`);
});

export const getHotCommunityPosts = cache(async () => {
  const payload = await fetchJson<ApiList<CommunityPost>>("/articles/hot");
  return listItems(payload);
});

export const getCommunityPost = cache(async (id: string) => {
  return fetchJson<CommunityPost>(`/articles/details/${encodeURIComponent(id)}`);
});

/** 본문 마크다운/HTML에서 첫 번째 이미지 URL */
export function extractFirstContentImage(content?: string | null): string | undefined {
  if (!content) return undefined;
  const md = content.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/);
  if (md?.[1]) return md[1];
  const html = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  return html?.[1];
}

function extractMarkdownImage(content?: string | null): string | undefined {
  return extractFirstContentImage(content);
}

function isUsableImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (
    !trimmed.startsWith("https://") &&
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("/")
  ) {
    return false;
  }
  return !BROKEN_URL_MARKERS.some((marker) => trimmed.includes(marker));
}

export function fallbackImage(seed = ""): string {
  if (!seed) return IMAGE_FALLBACKS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return IMAGE_FALLBACKS[hash % IMAGE_FALLBACKS.length];
}

/**
 * 여러 후보 중 사용 가능한 첫 이미지 URL.
 * seed가 있으면 폴백을 콘텐츠별로 다른 로컬 에셋으로 분산.
 */
export function pickImage(
  ...assets: Array<MediaAsset | string | null | undefined>
): string {
  for (const asset of assets) {
    if (!asset) continue;
    const url = typeof asset === "string" ? asset : asset.url;
    if (!url || !isUsableImageUrl(url)) continue;
    return url.trim();
  }
  return fallbackImage();
}

export function pickImageFor(
  seed: string,
  ...assets: Array<MediaAsset | string | null | undefined>
): string {
  for (const asset of assets) {
    if (!asset) continue;
    const url = typeof asset === "string" ? asset : asset.url;
    if (!url || !isUsableImageUrl(url)) continue;
    return url.trim();
  }
  return fallbackImage(seed);
}

/** 커뮤니티 게시글 커버 후보 (bg → 첨부 이미지 → 본문 마크다운 이미지) */
export function communityImageCandidates(
  post: CommunityPost,
): Array<string | MediaAsset | null | undefined> {
  const attachmentUrls = (post.images ?? [])
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((img) => img.imageUrl ?? img.url ?? null);

  return [
    post.customBackgroundUrl,
    ...attachmentUrls,
    extractMarkdownImage(post.content ?? post.description),
  ];
}

export function pickCommunityImage(post: CommunityPost): string {
  return pickImageFor(post.id, ...communityImageCandidates(post));
}

/**
 * 스토리 배너(OG용) — 업로드 시점 썸네일 우선
 * thumbnail → cover → seo.ogImage → 본문 첫 이미지 → 폴백
 */
export function pickBlogBannerImage(article: {
  id: string;
  thumbnail?: MediaAsset | null;
  coverImage?: MediaAsset | null;
  content?: string | null;
  seo?: { ogImage?: string } | null;
}): string {
  return pickImageFor(
    article.id,
    article.thumbnail,
    article.coverImage,
    article.seo?.ogImage,
    extractFirstContentImage(article.content),
  );
}

/**
 * 카드뉴스 배너(OG용) — 업로드 background 우선
 * backgroundImage → 첫 섹션 이미지 → 본문 이미지 → 폴백
 */
export function pickCardNewsBannerImage(item: {
  id: string;
  backgroundImage?: MediaAsset | null;
  sections?: CardNewsSection[] | null;
  body?: string | null;
  description?: string | null;
}): string {
  const sectionImages = (item.sections ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((section) => section.imageUrl);

  return pickImageFor(
    item.id,
    item.backgroundImage,
    ...sectionImages,
    extractFirstContentImage(item.body ?? item.description),
  );
}

/** OG 전용 — 절대 URL이 필요한 곳에서 absoluteUrl과 함께 사용 */
export function resolveBannerForOg(seed: string, ...assets: Array<MediaAsset | string | null | undefined>) {
  return pickImageFor(seed, ...assets);
}

export function formatDate(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function textExcerpt(value?: string | null, fallback = "") {
  const text = (value ?? fallback)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]+\]\([^)]*\)/g, "")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}
