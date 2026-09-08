import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { JsonLd } from "../../_components/public-content/JsonLd";
import { ContentBreadcrumb } from "../../_components/public-content/ContentBreadcrumb";
import { ContentBanner } from "../../_components/public-content/ContentBanner";
import { ReadingProgress } from "../../_components/public-content/ReadingProgress";
import {
  formatDate,
  getBlogArticle,
  pickBlogBannerImage,
  textExcerpt,
} from "../../_lib/public-content";
import { faqPageJsonLd, splitContentAndFaq } from "../../_lib/faq";
import { contentSummary, detailEndAction } from "../../_lib/content-presentation";
import { recoverNaverTables } from "../../_lib/naver-table-recovery";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "../../_lib/seo";
import { getBannerAlt, getBannerDimensions } from "../../_lib/banner-a11y";

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
  const image = pickBlogBannerImage(article);
  const path = `/blog/${encodeURIComponent(article.slug)}`;

  return buildPageMetadata({
    title,
    description,
    path,
    image,
    imageAlt: getBannerAlt(article.title),
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    keywords: article.seo?.keywords,
    authors: article.author?.name ? [article.author.name] : ["썸타임 에디터"],
    section: article.category,
    noIndex: article.slug.startsWith("jp-"),
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getBlogArticle(decodeURIComponent(slug));
  if (!article) notFound();

  const image = pickBlogBannerImage(article);
  const description = textExcerpt(article.excerpt ?? article.content);
  const path = `/blog/${encodeURIComponent(article.slug)}`;
  const content = recoverNaverTables(article.slug, article.content);
  const { faqs: inlineFaqs } = splitContentAndFaq(content);
  const summary = contentSummary(article.excerpt || article.subtitle, content);
  const publishedDate = formatDate(article.publishedAt);
  const endAction = detailEndAction("story", article.title);

  return (
    <ContentShell>
      <ReadingProgress />
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
          ...(inlineFaqs.length > 0 ? [faqPageJsonLd(inlineFaqs)] : []),
        ]}
      />

      <article className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-20">
        <ContentBreadcrumb
          items={[
            { href: "/", label: "홈" },
            { href: "/blog", label: "스토리" },
            { label: article.title },
          ]}
        />

        <div className="mb-8">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#8a5cff]">
            {article.category}
          </p>
          <h1 className="font-wantedSans text-4xl font-black leading-tight tracking-tight text-[#201823] sm:text-6xl">
            {article.title}
          </h1>
          {summary ? (
            <p className="mt-5 text-lg leading-8 text-[#5f5567]">
              {summary}
            </p>
          ) : null}
          <p className="mt-6 text-sm font-bold text-[#9a8fa2]">
            <span>{article.author?.name ?? "썸타임 에디터"}</span>
            {publishedDate ? <>{" · "}<time dateTime={article.publishedAt ?? undefined}>{publishedDate}</time></> : null}
          </p>
        </div>

        {!content.includes(image) ? <ContentBanner
          {...getBannerDimensions(article.thumbnail?.url === image ? article.thumbnail : article.coverImage?.url === image ? article.coverImage : null)}
          src={image}
          title={article.title}
          seed={article.id}
          alt={article.thumbnail?.url === image ? article.thumbnail.alt : article.coverImage?.url === image ? article.coverImage.alt : undefined}
        /> : null}

        <MarkdownBody content={content} />

        <nav aria-label="이 글 다음으로" className="mt-10 border-t border-[#EEE8FF] pt-6">
          <a href={endAction.href} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{endAction.label}</a>
        </nav>
      </article>
    </ContentShell>
  );
}
