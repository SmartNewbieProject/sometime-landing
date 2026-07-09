import { cache } from "react";

const API_BASE_URL =
  process.env.SOMETIME_PUBLIC_CONTENT_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.some-in-univ.com/api";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://info.some-in-univ.com";

export type MediaAsset = {
  url?: string;
  alt?: string;
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
    headers: { Accept: "application/json" },
  });

  if (!response.ok) return null;
  return (await response.json()) as T;
}

export const getBlogArticles = cache(async () => {
  const payload = await fetchJson<ApiList<SometimeArticleListItem>>(
    "/sometime-articles?limit=24",
  );
  return payload?.items ?? payload?.data ?? [];
});

export const getBlogArticle = cache(async (slug: string) => {
  return fetchJson<SometimeArticle>(`/sometime-articles/${encodeURIComponent(slug)}`);
});

export const getCardNewsList = cache(async () => {
  const payload = await fetchJson<ApiList<CardNews>>(
    "/posts/card-news?limit=24&includeReadState=false",
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

export function pickImage(...assets: Array<MediaAsset | string | null | undefined>) {
  for (const asset of assets) {
    if (!asset) continue;
    const url = typeof asset === "string" ? asset : asset.url;
    if (!url) continue;
    if (url.includes("d2riz12x19cmzu.cloudfront.net/resources/sometime-story.png")) {
      continue;
    }
    return url;
  }
  return "/preview_title.png";
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
