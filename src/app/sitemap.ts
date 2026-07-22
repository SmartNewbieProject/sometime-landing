import type { MetadataRoute } from "next";
import {
  getAllBlogArticles,
  getAllCardNews,
  getTopKrUniversities,
  getUniversityPage,
  SITE_URL,
} from "./_lib/public-content";
import {
  getStaticSitemapLastmod,
  maxLastmod,
  resolveContentLastmod,
  UNIVERSITY_SITEMAP_LIMIT,
  UNIVERSITY_SITEMAP_MIN_VERIFIED_COUNT,
} from "./_lib/sitemap-helpers";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, cardNews, topUniversities] = await Promise.all([
    getAllBlogArticles().catch(() => [] as Awaited<ReturnType<typeof getAllBlogArticles>>),
    getAllCardNews().catch(() => [] as Awaited<ReturnType<typeof getAllCardNews>>),
    getTopKrUniversities(20).catch(() => [] as Awaited<ReturnType<typeof getTopKrUniversities>>),
  ]);

  const latestBlogLastmod =
    maxLastmod(
      getStaticSitemapLastmod("/blog"),
      ...articles.map((article) =>
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
  ];

  const blogEntries: MetadataRoute.Sitemap = articles
    .filter((article) => Boolean(article.slug) && !article.slug.startsWith("jp-"))
    .map((article) => ({
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
    .filter((item) => Boolean(item.id))
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

  const universityEntries: MetadataRoute.Sitemap = (
    await Promise.all(
      topUniversities.slice(0, 20).map(async (university) => {
        const page = await getUniversityPage(university.code);
        const verifiedCount = page?.stats.verifiedCount ?? 0;
        if (!page || verifiedCount < UNIVERSITY_SITEMAP_MIN_VERIFIED_COUNT) return null;

        return {
          url: `${SITE_URL}/university/${encodeURIComponent(page.university.code)}`,
          lastModified: getStaticSitemapLastmod("/university"),
          changeFrequency: "weekly" as const,
          priority: 0.65,
        };
      }),
    )
  )
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .slice(0, UNIVERSITY_SITEMAP_LIMIT);

  return [...staticEntries, ...blogEntries, ...cardNewsEntries, ...universityEntries];
}
