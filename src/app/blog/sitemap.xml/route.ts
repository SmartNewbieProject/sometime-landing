import {
  BLOG_INDEX_URL,
  blogArticleUrl,
  getAllBlogArticles,
} from "../../_lib/public-content";
import {
  getStaticSitemapLastmod,
  maxLastmod,
  resolveContentLastmod,
} from "../../_lib/sitemap-helpers";

export const revalidate = 300;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getAllBlogArticles();
  const blogIndexLastmod = (
    maxLastmod(
      getStaticSitemapLastmod("/blog"),
      ...articles.map((article) =>
        resolveContentLastmod({
          updatedAt: article.updatedAt,
          publishedAt: article.publishedAt,
          fallback: getStaticSitemapLastmod("/blog"),
        }),
      ),
    ) ?? getStaticSitemapLastmod("/blog")
  ).toISOString();
  const urls = [
    `  <url>\n    <loc>${escapeXml(BLOG_INDEX_URL)}</loc>\n    <lastmod>${blogIndexLastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`,
    ...articles
      .filter(
        (article) => Boolean(article.slug) && !article.slug.startsWith("jp-"),
      )
      .map(
        (article) =>
          `  <url>\n    <loc>${escapeXml(blogArticleUrl(article.slug))}</loc>\n    <lastmod>${escapeXml(
            resolveContentLastmod({
              updatedAt: article.updatedAt,
              publishedAt: article.publishedAt,
              fallback: getStaticSitemapLastmod("/blog"),
            }).toISOString(),
          )}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
      ),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
