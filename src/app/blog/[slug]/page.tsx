import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { JsonLd } from "../../_components/public-content/JsonLd";
import { ContentBreadcrumb } from "../../_components/public-content/ContentBreadcrumb";
import { ContentBanner } from "../../_components/public-content/ContentBanner";
import { ArticleHeader } from "../../_components/public-content/ArticleHeader";
import { RelatedArticles } from "../../_components/public-content/RelatedArticles";
import { ReadingProgress } from "../../_components/public-content/ReadingProgress";
import {
  formatDate,
  getAllBlogArticles,
  getBlogArticle,
  pickBlogBannerImage,
  textExcerpt,
} from "../../_lib/public-content";
import { faqPageJsonLd, splitContentAndFaq } from "../../_lib/faq";
import { contentSummary, detailEndAction } from "../../_lib/content-presentation";
import { recoverNaverTables } from "../../_lib/naver-table-recovery";
import { readingMinutes } from "../../_lib/reading-time";
import { pickRelatedArticles } from "../../_lib/related-articles";
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

// 이어서 읽기는 보조 영역이다. 목록을 못 불러와도 글 본문은 보여 주되 원인은 로그로 남긴다.
async function loadRelatedArticles(article: { slug: string; category: string }) {
  try {
    return pickRelatedArticles(await getAllBlogArticles(), article);
  } catch (error) {
    console.error(`Related articles failed to load for /blog/${article.slug}`, error);
    return [];
  }
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
  const related = await loadRelatedArticles(article);

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

      <article className="mx-auto w-full max-w-[728px] px-6 pb-20 pt-10 sm:pt-16">
        <ContentBreadcrumb
          items={[
            { href: "/", label: "홈" },
            { href: "/blog", label: "스토리" },
            { label: article.title },
          ]}
        />

        <ArticleHeader
          category={article.category}
          title={article.title}
          subtitle={summary || undefined}
          authorName={article.author?.name ?? "썸타임 에디터"}
          publishedAt={article.publishedAt}
          publishedLabel={publishedDate}
          readingMinutes={readingMinutes(content)}
        />

        {!content.includes(image) ? <ContentBanner
          {...getBannerDimensions(article.thumbnail?.url === image ? article.thumbnail : article.coverImage?.url === image ? article.coverImage : null)}
          src={image}
          title={article.title}
          seed={article.id}
          alt={article.thumbnail?.url === image ? article.thumbnail.alt : article.coverImage?.url === image ? article.coverImage.alt : undefined}
        /> : null}

        <MarkdownBody content={content} />

        <aside aria-label="앱 안내" className="mt-12 flex flex-col gap-4 border-y border-[#EEE8FF] py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-bold leading-[1.5] tracking-[-0.02em] text-[#201823]">
            썸타임
            <span className="block text-[15px] font-medium text-[#625A68]">학교 인증 표시를 확인하는 대학생 소개팅 앱</span>
          </p>
          <Link href="/download" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#7A4AE2] px-5 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-[#5B35B5]">
            앱 다운로드
          </Link>
        </aside>

        <RelatedArticles articles={related} />

        <nav aria-label="이 글 다음으로" className="mt-8">
          <a href={endAction.href} className="inline-flex min-h-11 items-center font-semibold text-[#5B35B5] underline underline-offset-4">{endAction.label}</a>
        </nav>
      </article>
    </ContentShell>
  );
}
