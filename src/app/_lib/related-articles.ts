import { isSitemapBlogSlug } from "./sitemap-helpers";
import type { SometimeArticleListItem } from "./public-content";

/**
 * 글 끝 "이어서 읽기" 후보. 같은 분류를 먼저, 부족하면 최신 글로 채운다.
 * 현재 글, 사이트맵에 올리지 않는 글(naver- 미러·jp-), 발행일 없는 글은 뺀다.
 */
export function pickRelatedArticles(
  articles: SometimeArticleListItem[],
  current: Pick<SometimeArticleListItem, "slug" | "category">,
  limit = 3,
): SometimeArticleListItem[] {
  const newestFirst = articles
    .filter((a) => a.slug !== current.slug && isSitemapBlogSlug(a.slug) && a.publishedAt)
    .sort((a, b) => Date.parse(b.publishedAt as string) - Date.parse(a.publishedAt as string));
  const sameCategory = newestFirst.filter((a) => a.category === current.category);
  const others = newestFirst.filter((a) => a.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}
