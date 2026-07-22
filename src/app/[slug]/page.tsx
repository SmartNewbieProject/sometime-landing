import { notFound, permanentRedirect } from "next/navigation";
import { getBlogArticle } from "../_lib/public-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyBlogSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getBlogArticle(decodeURIComponent(slug));
  if (!article) notFound();

  permanentRedirect(`/blog/${encodeURIComponent(article.slug)}`);
}
