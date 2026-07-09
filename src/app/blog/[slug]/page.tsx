import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { ContentMedia } from "../../_components/public-content/ContentMedia";
import { JsonLd } from "../../_components/public-content/JsonLd";
import {
  formatDate,
  getBlogArticle,
  pickImageFor,
  textExcerpt,
} from "../../_lib/public-content";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "../../_lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticle(decodeURIComponent(slug));
  if (!article) return { robots: { index: false, follow: false } };

  const title = article.seo?.metaTitle ?? article.title;
  const description =
    article.seo?.metaDescription ?? textExcerpt(article.excerpt ?? article.content);
  const image = pickImageFor(article.id, article.coverImage, article.thumbnail);
  const path = `/blog/${encodeURIComponent(article.slug)}`;

  return buildPageMetadata({
    title,
    description,
    path,
    image,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    keywords: article.seo?.keywords,
    authors: article.author?.name ? [article.author.name] : ["썸타임 에디터"],
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getBlogArticle(decodeURIComponent(slug));
  if (!article) notFound();

  const image = pickImageFor(article.id, article.coverImage, article.thumbnail);
  const description = textExcerpt(article.excerpt ?? article.content);
  const path = `/blog/${encodeURIComponent(article.slug)}`;

  return (
    <ContentShell>
      <JsonLd
        data={[
          articleJsonLd({
            title: article.title,
            description,
            path,
            image,
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt,
            authorName: article.author?.name,
            section: article.category,
            keywords: article.seo?.keywords,
          }),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "스토리", path: "/blog" },
            { name: article.title, path },
          ]),
        ]}
      />

      <article className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-20">
        <nav aria-label="breadcrumb" className="mb-6 text-sm font-medium text-[#9a8fa2]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-[#7A4AE2]">
                홈
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/blog" className="hover:text-[#7A4AE2]">
                스토리
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="line-clamp-1 text-[#666]">{article.title}</li>
          </ol>
        </nav>

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
            <span itemProp="author">{article.author?.name ?? "썸타임 에디터"}</span>
            {" · "}
            <time dateTime={article.publishedAt ?? undefined}>
              {formatDate(article.publishedAt)}
            </time>
          </p>
        </div>

        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[32px] bg-[#f4edf8] shadow-[0_24px_90px_rgba(76,47,100,0.16)]">
          <ContentMedia
            src={image}
            seed={article.id}
            className="object-cover"
            priority
            sizes="(min-width: 900px) 800px, 100vw"
          />
        </div>

        <MarkdownBody content={article.content} />
      </article>
    </ContentShell>
  );
}
