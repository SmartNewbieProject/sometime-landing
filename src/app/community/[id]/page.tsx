import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { ContentMedia } from "../../_components/public-content/ContentMedia";
import {
  formatDate,
  getCommunityPost,
  pickCommunityImage,
  SITE_URL,
  textExcerpt,
} from "../../_lib/public-content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getCommunityPost(id);
  if (!post) return {};

  const description = textExcerpt(post.content ?? post.description);
  const image = pickCommunityImage(post);

  return {
    title: post.title,
    description,
    alternates: { canonical: `${SITE_URL}/community/${post.id}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `${SITE_URL}/community/${post.id}`,
      images: [{ url: image.startsWith("http") ? image : `${SITE_URL}${image}` }],
      publishedTime: post.publishedAt ?? undefined,
    },
  };
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getCommunityPost(id);
  if (!post) notFound();

  const image = pickCommunityImage(post);
  const hasCover =
    Boolean(post.customBackgroundUrl) ||
    Boolean(post.images?.some((img) => img.imageUrl || img.url));

  return (
    <ContentShell>
      <article className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-20">
        <div className="mb-8">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#8a5cff]">
            COMMUNITY
          </p>
          <h1 className="font-wantedSans text-4xl font-black leading-tight tracking-tight text-[#201823] sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-sm font-bold text-[#9a8fa2]">
            {post.author?.universityDetails?.name ?? "썸타임 커뮤니티"} ·{" "}
            {formatDate(post.publishedAt)}
          </p>
        </div>

        {hasCover ? (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[32px] bg-[#f4edf8] shadow-[0_24px_90px_rgba(76,47,100,0.16)]">
            <ContentMedia
              src={image}
              seed={post.id}
              className="object-cover"
              priority
              sizes="(min-width: 900px) 800px, 100vw"
            />
          </div>
        ) : null}

        <MarkdownBody content={post.content ?? post.description ?? ""} />
      </article>
    </ContentShell>
  );
}
