import { buildLlmsTxt } from "../_lib/llms-txt";
import { getAllBlogArticles, getAllCardNews } from "../_lib/public-content";

export const revalidate = 300;

export async function GET() {
  const [articles, cardNews] = await Promise.all([getAllBlogArticles(), getAllCardNews()]);

  return new Response(buildLlmsTxt({ articles, cardNews }), {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
