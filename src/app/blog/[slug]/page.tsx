import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { JsonLd } from "../../_components/public-content/JsonLd";
import { ContentBreadcrumb } from "../../_components/public-content/ContentBreadcrumb";
import { ContentBanner } from "../../_components/public-content/ContentBanner";
import { ReadingProgress } from "../../_components/public-content/ReadingProgress";
import { FaqAccordion } from "../../_components/public-content/FaqAccordion";
import {
  formatDate,
  getBlogArticle,
  pickBlogBannerImage,
  textExcerpt,
} from "../../_lib/public-content";
import { defaultDetailFaqs, faqPageJsonLd, splitContentAndFaq } from "../../_lib/faq";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "../../_lib/seo";
import { getBannerAlt } from "../../_lib/banner-a11y";

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
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getBlogArticle(decodeURIComponent(slug));
  if (!article) notFound();

  const image = pickBlogBannerImage(article);
  const description = textExcerpt(article.excerpt ?? article.content);
  const path = `/blog/${encodeURIComponent(article.slug)}`;
  const { body, faqs: inlineFaqs } = splitContentAndFaq(article.content);
  const faqs = inlineFaqs.length > 0 ? inlineFaqs : defaultDetailFaqs("story");

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
          {article.excerpt || article.subtitle ? (
            <p className="mt-5 text-lg leading-8 text-[#5f5567]">
              {article.excerpt ?? article.subtitle}
            </p>
          ) : null}
          <p className="mt-6 text-sm font-bold text-[#9a8fa2]">
            <span>{article.author?.name ?? "썸타임 에디터"}</span>
            {" · "}
            <time dateTime={article.publishedAt ?? undefined}>
              {formatDate(article.publishedAt)}
            </time>
          </p>
        </div>

        <ContentBanner
          src={image}
          title={article.title}
          seed={article.id}
          subtitle={article.subtitle}
          excerpt={article.excerpt}
        />

        <MarkdownBody content={body} />

        <div className="mt-14">
          <FaqAccordion
            items={faqs}
            title={inlineFaqs.length > 0 ? "이 글 FAQ" : "함께 알아두면 좋아요"}
            description={
              inlineFaqs.length > 0
                ? "이 글에서 짚어 본 질문들입니다."
                : "학교 인증 소개팅을 시작하기 전에 자주 묻는 이야기예요."
            }
          />
        </div>
      </article>
    </ContentShell>
  );
}
