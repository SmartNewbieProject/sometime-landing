import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { ContentMedia } from "../../_components/public-content/ContentMedia";
import { JsonLd } from "../../_components/public-content/JsonLd";
import {
  formatDate,
  getCardNews,
  pickCardNewsBannerImage,
  textExcerpt,
} from "../../_lib/public-content";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "../../_lib/seo";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getCardNews(id);
  if (!item) return { robots: { index: false, follow: false } };

  const description = textExcerpt(item.description ?? item.subtitle ?? item.body);
  // 업로드 시점 background 배너 우선
  const image = pickCardNewsBannerImage(item);
  const path = `/card-news/${item.id}`;
  const sectionLabel = item.layoutMode === "longform" ? "롱폼" : "카드뉴스";

  return buildPageMetadata({
    title: item.title,
    description,
    path,
    image,
    imageAlt: item.title,
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
  const body = item.body?.trim();
  const description = textExcerpt(item.description ?? item.subtitle ?? item.body);
  const path = `/card-news/${item.id}`;
  const sectionLabel = item.layoutMode === "longform" ? "롱폼" : "카드뉴스";

  return (
    <ContentShell>
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
        ]}
      />

      <article className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-20">
        <nav aria-label="breadcrumb" className="mb-6 text-sm font-medium text-[#9a8fa2]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#7A4AE2]">
                홈
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/card-news" className="hover:text-[#7A4AE2]">
                카드뉴스
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="line-clamp-1 text-[#666]">{item.title}</li>
          </ol>
        </nav>

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

        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[32px] bg-[#f4edf8] shadow-[0_24px_90px_rgba(76,47,100,0.16)]">
          <ContentMedia
            src={image}
            seed={item.id}
            className="object-cover"
            priority
            sizes="(min-width: 900px) 800px, 100vw"
          />
        </div>

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
      </article>
    </ContentShell>
  );
}
