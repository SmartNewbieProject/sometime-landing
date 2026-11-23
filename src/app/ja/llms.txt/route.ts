import { buildJaLlmsTxt } from "../../_lib/ja-content";

export const revalidate = 300;

export async function GET() {
  return new Response(buildJaLlmsTxt(), {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
