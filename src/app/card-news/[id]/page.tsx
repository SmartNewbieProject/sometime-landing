import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { ContentMedia } from "../../_components/public-content/ContentMedia";
import { JsonLd } from "../../_components/public-content/JsonLd";
import { ContentBreadcrumb } from "../../_components/public-content/ContentBreadcrumb";
import { ContentBanner } from "../../_components/public-content/ContentBanner";
import { ReadingProgress } from "../../_components/public-content/ReadingProgress";
import { FaqAccordion } from "../../_components/public-content/FaqAccordion";
import { TrialChatCta } from "../../_components/public-content/TrialChatCta";
import { ContextualStoreCta } from "../../_components/public-content/ContextualStoreCta";
import {
  formatDate,
  getCardNews,
  pickCardNewsBannerImage,
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
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getCardNews(id);
  if (!item) return { robots: { index: false, follow: false } };

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
  const item = await getCardNews(id);
  if (!item) notFound();

  const image = pickCardNewsBannerImage(item);
  const rawBody = item.body?.trim() ?? "";
  const { body, faqs: inlineFaqs } = splitContentAndFaq(rawBody);
  const faqs = inlineFaqs.length > 0 ? inlineFaqs : defaultDetailFaqs("card-news");
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
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#8a5cff]">
            {item.layoutMode === "longform" ? "LONGFORM" : "CARD NEWS"}
          </p>
          <h1 className="font-wantedSans text-4xl font-black leading-tight tracking-tight text-[#201823] sm:text-6xl">
            {item.title}
          </h1>
          {item.description || item.subtitle ? (
            <p className="mt-5 text-lg leading-8 text-[#5f5567]">
              {item.description ?? item.subtitle}
            </p>
          ) : null}
          <p className="mt-6 text-sm font-bold text-[#9a8fa2]">
            <time dateTime={item.publishedAt ?? undefined}>{formatDate(item.publishedAt)}</time>
            {" · "}좋아요 {item.likeCount ?? 0}
          </p>
        </div>

        <ContentBanner
          src={image}
          title={item.title}
          seed={item.id}
          subtitle={item.subtitle}
          excerpt={item.description}
        />

        {body ? (
          <MarkdownBody content={body} />
        ) : (
          <div className="space-y-6">
            {(item.sections ?? []).map((section) => (
              <section
                key={section.id ?? section.sortOrder}
                className="rounded-[28px] border border-[#efe5f5] bg-white p-6 shadow-sm"
              >
                {section.imageUrl ? (
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl">
                    <ContentMedia
                      src={section.imageUrl}
                      alt={getBannerAlt(section.title || item.title)}
                      seed={`${item.id}-${section.id ?? section.sortOrder ?? 0}`}
                      className="object-cover"
                      sizes="(min-width: 900px) 720px, 100vw"
                    />
                  </div>
                ) : null}
                {section.title ? (
                  <h2 className="font-wantedSans text-2xl font-black text-[#201823]">
                    {section.title}
                  </h2>
                ) : null}
                {section.body ? (
                  <p className="mt-3 leading-8 text-[#5f5567]">{section.body}</p>
                ) : null}
              </section>
            ))}
          </div>
        )}

        <ContextualStoreCta
          title={item.title}
          category={sectionLabel}
          description={item.description ?? item.subtitle}
        />

        <div className="mt-12">
          <TrialChatCta
            contentType="card-news"
            contentId={item.id}
            placement="detail_bottom"
          />
        </div>

        <div className="mt-10">
          <FaqAccordion
            items={faqs}
            title={inlineFaqs.length > 0 ? "이 글 FAQ" : "함께 알아두면 좋아요"}
            description={
              inlineFaqs.length > 0
                ? "이 콘텐츠에서 짚은 질문입니다."
                : "카드뉴스를 읽은 뒤 자주 이어지는 질문이에요."
            }
          />
        </div>
      </article>
    </ContentShell>
  );
}
