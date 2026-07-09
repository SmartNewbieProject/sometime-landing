import type { MetadataRoute } from "next";
import {
  getBlogArticles,
  getCardNewsList,
  getHotCommunityPosts,
  SITE_URL,
} from "./_lib/public-content";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/card-news`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/community`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/event`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const [articles, cardNews, communityPosts] = await Promise.all([
    getBlogArticles(100).catch(() => []),
    getCardNewsList(100).catch(() => []),
    getHotCommunityPosts().catch(() => []),
  ]);

  const blogEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${encodeURIComponent(article.slug)}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const cardNewsEntries: MetadataRoute.Sitemap = cardNews.map((item) => ({
    url: `${SITE_URL}/card-news/${item.id}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const communityEntries: MetadataRoute.Sitemap = communityPosts.map((post) => ({
    url: `${SITE_URL}/community/${post.id}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries, ...cardNewsEntries, ...communityEntries];
}
