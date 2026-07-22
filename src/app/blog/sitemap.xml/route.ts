import {
  BLOG_INDEX_URL,
  blogArticleUrl,
  getAllBlogArticles,
} from "../../_lib/public-content";

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
  const now = new Date().toISOString();
  const articles = await getAllBlogArticles();
  const urls = [
    `  <url>\n    <loc>${escapeXml(BLOG_INDEX_URL)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`,
    ...articles
      .filter(
        (article) => Boolean(article.slug) && !article.slug.startsWith("jp-"),
      )
      .map(
        (article) =>
          `  <url>\n    <loc>${escapeXml(blogArticleUrl(article.slug))}</loc>\n    <lastmod>${escapeXml(article.publishedAt ?? now)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
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
