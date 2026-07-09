import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { ContentMedia } from "../../_components/public-content/ContentMedia";
import {
  formatDate,
  getBlogArticle,
  pickImageFor,
  SITE_URL,
  textExcerpt,
} from "../../_lib/public-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticle(decodeURIComponent(slug));
  if (!article) return {};

  const title = article.seo?.metaTitle ?? article.title;
  const description =
    article.seo?.metaDescription ?? textExcerpt(article.excerpt ?? article.content);
  const image = pickImageFor(article.id, article.coverImage, article.thumbnail);

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/${encodeURIComponent(article.slug)}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/blog/${encodeURIComponent(article.slug)}`,
      images: [{ url: image.startsWith("http") ? image : `${SITE_URL}${image}` }],
      publishedTime: article.publishedAt ?? undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getBlogArticle(decodeURIComponent(slug));
  if (!article) notFound();

  const image = pickImageFor(article.id, article.coverImage, article.thumbnail);

  return (
    <ContentShell>
      <article className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-20">
        <div className="mb-8">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#8a5cff]">
            {article.category}
          </p>
          <h1 className="font-wantedSans text-4xl font-black leading-tight tracking-tight text-[#201823] sm:text-6xl">
            {article.title}
          </h1>
          {article.excerpt || article.subtitle ? (
            <p className="mt-5 text-lg leading-8 text-[#5f5567]">
              {article.excerpt ?? article.subtitle}
            </p>
          ) : null}
          <p className="mt-6 text-sm font-bold text-[#9a8fa2]">
            {article.author?.name ?? "썸타임 에디터"} · {formatDate(article.publishedAt)}
          </p>
        </div>

        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[32px] bg-[#f4edf8] shadow-[0_24px_90px_rgba(76,47,100,0.16)]">
          <ContentMedia src={image} seed={article.id} className="object-cover" priority sizes="(min-width: 900px) 800px, 100vw" />
        </div>

        <MarkdownBody content={article.content} />
      </article>
    </ContentShell>
  );
}
