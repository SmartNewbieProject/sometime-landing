import { getAllBlogArticles, getBlogArticle, BLOG_INDEX_URL, blogArticleUrl } from "../../_lib/public-content";
import type { SometimeArticle, SometimeArticleListItem } from "../../_lib/public-content";

export const revalidate = 300;

const RSS_LIMIT = 30;
const RSS_CONTENT_TYPE = "application/rss+xml; charset=utf-8";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRssDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toUTCString();
}

function fallbackArticle(summary: SometimeArticleListItem): SometimeArticle {
  return {
    ...summary,
    content: summary.excerpt ?? summary.subtitle ?? "",
    updatedAt: summary.publishedAt,
    seo: null,
  };
}

export async function GET() {
  const summaries = (await getAllBlogArticles())
    .filter(
      (article) =>
        Boolean(article.slug && article.publishedAt) &&
        !article.slug.startsWith("jp-"),
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).valueOf() - new Date(a.publishedAt ?? 0).valueOf(),
    )
    .slice(0, RSS_LIMIT);

  const articles = await Promise.all(
    summaries.map(async (summary) => {
      const detail = await getBlogArticle(summary.slug);
      return detail ?? fallbackArticle(summary);
    }),
  );

  const items = articles
    .map((article) => {
      const link = blogArticleUrl(article.slug);
      const publishedDate = toRssDate(article.publishedAt);
      if (!publishedDate) return null;

      const body = article.content || article.excerpt || article.subtitle || "";
      return [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <description>${escapeXml(body)}</description>`,
        `      <content:encoded>${escapeXml(body)}</content:encoded>`,
        `      <pubDate>${publishedDate}</pubDate>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        "    </item>",
      ].join("\n");
    })
    .filter((item): item is string => Boolean(item));

  const lastBuildDate =
    toRssDate(articles[0]?.publishedAt) ?? new Date().toUTCString();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>썸타임 공식 블로그</title>",
    `    <link>${BLOG_INDEX_URL}</link>`,
    "    <description>학교 인증, 연애 고민, 소개팅 팁, 캠퍼스 라이프를 전하는 썸타임 공식 블로그입니다.</description>",
    `    <atom:link href="${escapeXml(`${BLOG_INDEX_URL}/rss.xml`)}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    ...items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "Content-Type": RSS_CONTENT_TYPE,
    },
  });
}
