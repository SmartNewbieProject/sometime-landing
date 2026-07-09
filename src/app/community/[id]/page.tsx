import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { MarkdownBody } from "../../_components/public-content/MarkdownBody";
import { ContentMedia } from "../../_components/public-content/ContentMedia";
import { JsonLd } from "../../_components/public-content/JsonLd";
import {
  formatDate,
  getCommunityPost,
  pickCommunityImage,
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
  const post = await getCommunityPost(id);
  if (!post) return { robots: { index: false, follow: false } };

  const description = textExcerpt(post.content ?? post.description);
  const image = pickCommunityImage(post);
  const path = `/community/${post.id}`;

  return buildPageMetadata({
    title: post.title,
    description,
    path,
    image,
    type: "article",
    publishedTime: post.publishedAt,
    keywords: ["썸타임 커뮤니티", "대학생 커뮤니티", "캠퍼스 이야기"],
    authors: post.author?.name ? [post.author.name] : undefined,
  });
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getCommunityPost(id);
  if (!post) notFound();

  const image = pickCommunityImage(post);
  const description = textExcerpt(post.content ?? post.description);
  const path = `/community/${post.id}`;
  const hasCover =
    Boolean(post.customBackgroundUrl) ||
    Boolean(post.images?.some((img) => img.imageUrl || img.url));

  return (
    <ContentShell>
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            description,
            path,
            image,
            publishedTime: post.publishedAt,
            authorName: post.author?.name ?? "썸타임 커뮤니티",
            section: "커뮤니티",
          }),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "커뮤니티", path: "/community" },
            { name: post.title, path },
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
              <a href="/community" className="hover:text-[#7A4AE2]">
                커뮤니티
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="line-clamp-1 text-[#666]">{post.title}</li>
          </ol>
        </nav>

        <div className="mb-8">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#8a5cff]">
            COMMUNITY
          </p>
          <h1 className="font-wantedSans text-4xl font-black leading-tight tracking-tight text-[#201823] sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-sm font-bold text-[#9a8fa2]">
            {post.author?.universityDetails?.name ?? "썸타임 커뮤니티"} ·{" "}
            <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
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
