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
};

async function fetchJson<T>(path: string): Promise<T | null> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 300 },
    headers: {
      Accept: "application/json",
      // multi-schema API 기본 국가
      "X-Country": "kr",
    },
  });

  if (!response.ok) return null;
  return (await response.json()) as T;
}

export const getBlogArticles = cache(async (limit = 48) => {
  const payload = await fetchJson<ApiList<SometimeArticleListItem>>(
    `/sometime-articles?limit=${limit}`,
  );
  return payload?.items ?? payload?.data ?? [];
});

export const getBlogArticle = cache(async (slug: string) => {
  return fetchJson<SometimeArticle>(`/sometime-articles/${encodeURIComponent(slug)}`);
});

export const getCardNewsList = cache(async (limit = 48) => {
  const payload = await fetchJson<ApiList<CardNews>>(
    `/posts/card-news?limit=${limit}&includeReadState=false`,
  );
  return payload?.items ?? payload?.data ?? [];
});

export const getCardNews = cache(async (id: string) => {
  return fetchJson<CardNews>(`/posts/card-news/${encodeURIComponent(id)}`);
});

export const getHotCommunityPosts = cache(async () => {
  const payload = await fetchJson<ApiList<CommunityPost>>("/articles/hot");
  return payload?.items ?? payload?.data ?? [];
});

export const getCommunityPost = cache(async (id: string) => {
  return fetchJson<CommunityPost>(`/articles/details/${encodeURIComponent(id)}`);
});

function extractMarkdownImage(content?: string | null): string | undefined {
  if (!content) return undefined;
  const match = content.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/);
  return match?.[1];
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
