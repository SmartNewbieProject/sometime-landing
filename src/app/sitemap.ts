import type { MetadataRoute } from "next";
import { getCardNewsLifecycle } from "./_lib/public-content-lifecycle";
import {
  getAllBlogArticles,
  getAllCardNews,
  SITE_URL,
} from "./_lib/public-content";
import { getListedUniversities } from "./_lib/university-listing";
import {
  getStaticSitemapLastmod,
  isSitemapBlogSlug,
  maxLastmod,
  resolveContentLastmod,
} from "./_lib/sitemap-helpers";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, cardNews, listedUniversities] = await Promise.all([
    getAllBlogArticles(),
    getAllCardNews(),
    getListedUniversities(),
  ]);

  const sitemapArticles = articles.filter((article) => isSitemapBlogSlug(article.slug));

  const latestBlogLastmod =
    maxLastmod(
      getStaticSitemapLastmod("/blog"),
      ...sitemapArticles.map((article) =>
        resolveContentLastmod({
          updatedAt: article.updatedAt,
          publishedAt: article.publishedAt,
          fallback: getStaticSitemapLastmod("/blog"),
        }),
      ),
    ) ?? getStaticSitemapLastmod("/blog");

  const latestCardNewsLastmod =
    maxLastmod(
      getStaticSitemapLastmod("/card-news"),
      ...cardNews.map((item) =>
        resolveContentLastmod({
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
          fallback: getStaticSitemapLastmod("/card-news"),
        }),
      ),
    ) ?? getStaticSitemapLastmod("/card-news");

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: getStaticSitemapLastmod("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestBlogLastmod,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/card-news`,
      lastModified: latestCardNewsLastmod,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/stories`,
      lastModified: getStaticSitemapLastmod("/stories"),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: getStaticSitemapLastmod("/faq"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/safety`,
      lastModified: getStaticSitemapLastmod("/safety"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/verification`,
      lastModified: getStaticSitemapLastmod("/verification"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy/easy`,
      lastModified: getStaticSitemapLastmod("/privacy/easy"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/community-guidelines`,
      lastModified: getStaticSitemapLastmod("/community-guidelines"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/press`,
      lastModified: getStaticSitemapLastmod("/press"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: getStaticSitemapLastmod("/about"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/download`,
      lastModified: getStaticSitemapLastmod("/download"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/university`,
      lastModified: getStaticSitemapLastmod("/university"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = sitemapArticles.map((article) => ({
      url: `${SITE_URL}/blog/${encodeURIComponent(article.slug)}`,
      lastModified: resolveContentLastmod({
        updatedAt: article.updatedAt,
        publishedAt: article.publishedAt,
        fallback: getStaticSitemapLastmod("/blog"),
      }),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  const cardNewsEntries: MetadataRoute.Sitemap = cardNews
    .filter((item) => Boolean(item.id) && !getCardNewsLifecycle(item.id).canonicalId)
    .map((item) => ({
      url: `${SITE_URL}/card-news/${item.id}`,
      lastModified: resolveContentLastmod({
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
        fallback: getStaticSitemapLastmod("/card-news"),
      }),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const universityEntries: MetadataRoute.Sitemap = listedUniversities.map((university) => ({
    url: `${SITE_URL}/university/${encodeURIComponent(university.code)}`,
    lastModified: getStaticSitemapLastmod("/university"),
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  return [...staticEntries, ...blogEntries, ...cardNewsEntries, ...universityEntries];
}
