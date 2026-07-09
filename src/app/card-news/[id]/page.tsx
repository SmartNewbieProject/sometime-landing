import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { formatDate, getCardNews, pickImage, SITE_URL, textExcerpt } from "../../_lib/public-content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getCardNews(id);
  if (!item) return {};

  const description = textExcerpt(item.description ?? item.subtitle ?? item.body);
  const image = pickImage(item.backgroundImage);

  return {
    title: item.title,
    description,
    alternates: { canonical: `${SITE_URL}/card-news/${item.id}` },
    openGraph: {
      title: item.title,
      description,
      type: "article",
      url: `${SITE_URL}/card-news/${item.id}`,
      images: [{ url: image }],
      publishedTime: item.publishedAt ?? undefined,
    },
  };
}

export default async function CardNewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getCardNews(id);
  if (!item) notFound();

  const image = pickImage(item.backgroundImage);
  const body = item.body?.trim();

  return (
    <ContentShell>
      <article className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-20">
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
            {formatDate(item.publishedAt)} · 좋아요 {item.likeCount ?? 0}
          </p>
        </div>

        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[32px] bg-[#f4edf8] shadow-[0_24px_90px_rgba(76,47,100,0.16)]">
          <Image src={image} alt="" fill className="object-cover" priority />
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
                    <Image src={section.imageUrl} alt="" fill className="object-cover" />
                  </div>
                ) : null}
                {section.title ? (
                  <h2 className="font-wantedSans text-2xl font-black text-[#201823]">
                    {section.title}
                  </h2>
                ) : null}
                {section.body ? <p className="mt-3 leading-8 text-[#5f5567]">{section.body}</p> : null}
              </section>
            ))}
          </div>
        )}
      </article>
    </ContentShell>
  );
}
