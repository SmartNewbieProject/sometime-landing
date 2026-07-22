import type { MetadataRoute } from "next";
import {
  getAllBlogArticles,
  getAllCardNews,
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
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/safety`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/verification`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy/easy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/community-guidelines`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/press`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/download`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const [articles, cardNews] = await Promise.all([
    getAllBlogArticles().catch(() => [] as Awaited<ReturnType<typeof getAllBlogArticles>>),
    getAllCardNews().catch(() => [] as Awaited<ReturnType<typeof getAllCardNews>>),
  ]);

  const blogEntries: MetadataRoute.Sitemap = articles
    .filter((article) => Boolean(article.slug) && !article.slug.startsWith("jp-"))
    .map((article) => ({
      url: `${SITE_URL}/blog/${encodeURIComponent(article.slug)}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  const cardNewsEntries: MetadataRoute.Sitemap = cardNews
    .filter((item) => Boolean(item.id))
    .map((item) => ({
      url: `${SITE_URL}/card-news/${item.id}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...blogEntries, ...cardNewsEntries];
}
