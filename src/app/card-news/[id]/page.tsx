import type { Metadata } from "next";
import { Fragment } from "react";
import { normalizeSectionRichText } from "../../_lib/section-richtext";
import { notFound, permanentRedirect } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { ContentMedia } from "../../_components/public-content/ContentMedia";
import { JsonLd } from "../../_components/public-content/JsonLd";
import { ContentBreadcrumb } from "../../_components/public-content/ContentBreadcrumb";
import { ContentBanner } from "../../_components/public-content/ContentBanner";
import { ReadingProgress } from "../../_components/public-content/ReadingProgress";
import {
  type CardNewsSection,
  formatDate,
  getCardNews,
  pickCardNewsBannerImage,
  textExcerpt,
} from "../../_lib/public-content";
import { faqPageJsonLd, splitContentAndFaq } from "../../_lib/faq";
import { contentSummary, detailEndAction } from "../../_lib/content-presentation";
import { getCardNewsLifecycle } from "../../_lib/public-content-lifecycle";
import { repairCardNews } from "../../_lib/public-content-repairs";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "../../_lib/seo";
import { getBannerAlt, getBannerDimensions } from "../../_lib/banner-a11y";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const lifecycle = getCardNewsLifecycle(id);
  const sourceItem = await getCardNews(lifecycle.canonicalId ?? id);
  if (!sourceItem) return { robots: { index: false, follow: false } };
  const item = repairCardNews(sourceItem);

  const description = textExcerpt(item.description ?? item.subtitle ?? item.body);
  const image = pickCardNewsBannerImage(item);
  const path = `/card-news/${item.id}`;
  const sectionLabel = item.layoutMode === "longform" ? "롱폼" : "카드뉴스";

  return buildPageMetadata({
    title: item.title,
    description,
    path,
    image,
    imageAlt: getBannerAlt(item.title),
    type: "article",
    publishedTime: item.publishedAt,
    keywords: ["카드뉴스", "썸타임", "대학생", sectionLabel],
    section: sectionLabel,
  });
}

export default async function CardNewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lifecycle = getCardNewsLifecycle(id);
  if (lifecycle.canonicalId) permanentRedirect(`/card-news/${lifecycle.canonicalId}`);
  const sourceItem = await getCardNews(id);
  if (!sourceItem) notFound();
  const item = repairCardNews(sourceItem);

  const image = pickCardNewsBannerImage(item);
  const rawBody = item.body?.trim() ?? "";
  const { faqs: inlineFaqs } = splitContentAndFaq(rawBody);
  const summary = contentSummary(item.description || item.subtitle, rawBody);
  const publishedDate = formatDate(item.publishedAt);
  const endAction = detailEndAction("card-news", item.title, lifecycle.intent);
  const description = textExcerpt(item.description ?? item.subtitle ?? item.body);
  const path = `/card-news/${item.id}`;
  const sectionLabel = item.layoutMode === "longform" ? "롱폼" : "카드뉴스";

  return (
    <ContentShell>
      <ReadingProgress />
      <JsonLd
        data={[
          articleJsonLd({
            title: item.title,
            description,
            path,
            image,
            publishedTime: item.publishedAt,
            section: sectionLabel,
          }),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "카드뉴스", path: "/card-news" },
            { name: item.title, path },
          ]),
          ...(inlineFaqs.length > 0 ? [faqPageJsonLd(inlineFaqs)] : []),
        ]}
      />

      <article className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-20">
        <ContentBreadcrumb
          items={[
            { href: "/", label: "홈" },
            { href: "/card-news", label: "카드뉴스" },
            { label: item.title },
          ]}
        />

        <div className="mb-8">
          {lifecycle.archive ? (
            <aside role="note" data-content-archive className="mb-6 border-l-4 border-[#625A68] bg-[#f7f7f7] p-4 text-[#201823]">
              <p className="font-bold">{lifecycle.archive.label}{" · "}<time dateTime={lifecycle.archive.endedOn}>{formatDate(lifecycle.archive.endedOn)}</time></p>
              <p className="mt-2 text-sm leading-6">아래 내용은 당시 게시된 기록입니다. 현재 모집이나 혜택을 안내하는 글이 아닙니다.</p>
            </aside>
          ) : null}
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#8a5cff]">
            {item.layoutMode === "longform" ? "LONGFORM" : "CARD NEWS"}
          </p>
          <h1 className="font-wantedSans text-4xl font-black leading-tight tracking-tight text-[#201823] sm:text-6xl">
            {item.title}
          </h1>
          {summary ? (
            <p className="mt-5 text-lg leading-8 text-[#5f5567]">
              {summary}
            </p>
          ) : null}
          <p className="mt-6 text-sm font-bold text-[#9a8fa2]">
            {publishedDate ? <><time dateTime={item.publishedAt ?? undefined}>{publishedDate}</time>{" · "}</> : null}
            좋아요 {item.likeCount ?? 0}
          </p>
        </div>

        {rawBody && !rawBody.includes(image) ? <ContentBanner
          {...getBannerDimensions(item.backgroundImage?.url === image ? item.backgroundImage : null)}
          src={image}
          title={item.title}
          seed={item.id}
          alt={item.backgroundImage?.url === image ? item.backgroundImage.alt : undefined}
        /> : null}

        {rawBody ? <MarkdownBody content={rawBody} /> : null}
        {item.sections?.length ? (
          <div className="space-y-6">
            {item.sections.map((section: CardNewsSection & { content?: string | null; order?: number }) => ({
              ...section,
              body: section.body ?? section.content,
              richText: normalizeSectionRichText(section.body ?? section.content ?? ""),
              sortOrder: section.sortOrder ?? section.order,
            })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((section, index) => (
              <section
                key={section.id ?? section.sortOrder ?? index}
                className="mx-auto max-w-[640px] border-b border-[#efe5f5] pb-6"
              >
                {section.imageUrl ? (
                  <div className="mb-5">
                    <ContentMedia
                      src={section.imageUrl}
                      alt={`${section.title || item.title} — ${index + 1}/${item.sections?.length} 카드${section.body ? `: ${contentSummary(section.richText ?? section.body)}` : ""}`}
                      seed={`${item.id}-${section.id ?? section.sortOrder ?? 0}`}
                      className="rounded-2xl object-contain"
                      fill={false}
                      enlarge
                      priority={index === 0 && !rawBody}
                      sizes="(min-width: 900px) 720px, 100vw"
                    />
                  </div>
                ) : null}
                {section.title ? (
                  <h2 className="font-wantedSans text-2xl font-black text-[#201823]">
                    {section.title}
                  </h2>
                ) : null}
                {section.richText !== null ? (
                  <div className="public-markdown">
                    {section.richText ? section.richText.split("\n\n").map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>
                        {paragraph.split("\n").map((line, lineIndex) => (
                          <Fragment key={lineIndex}>{lineIndex > 0 ? <br /> : null}{line}</Fragment>
                        ))}
                      </p>
                    )) : null}
                  </div>
                ) : section.body ? (
                  <MarkdownBody content={section.body} />
                ) : null}
              </section>
            ))}
          </div>
        ) : null}

        <nav aria-label="이 글 다음으로" className="mt-10 border-t border-[#EEE8FF] pt-6">
          <a href={endAction.href} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{endAction.label}</a>
        </nav>
      </article>
    </ContentShell>
  );
}
