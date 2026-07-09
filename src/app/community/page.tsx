import type { Metadata } from "next";
import { ContentCard } from "../_components/public-content/ContentCard";
import { ContentHero, ContentShell } from "../_components/public-content/ContentShell";
import {
  formatDate,
  getHotCommunityPosts,
  pickImage,
  SITE_URL,
  textExcerpt,
} from "../_lib/public-content";

export const metadata: Metadata = {
  title: "썸타임 커뮤니티 이야기",
  description: "썸타임 커뮤니티에서 공개된 인기 이야기와 캠퍼스 연애 고민을 확인하세요.",
  alternates: { canonical: `${SITE_URL}/community` },
};

export default async function CommunityIndexPage() {
  const posts = await getHotCommunityPosts();

  return (
    <ContentShell>
      <ContentHero
        eyebrow="COMMUNITY"
        title="지금 캠퍼스에서 오가는 이야기"
        description="운영진이 공개 노출로 선별한 커뮤니티 글을 앱 밖에서도 읽기 좋게 정리합니다."
      />
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ContentCard
            key={post.id}
            href={`/community/${post.id}`}
            image={pickImage(post.customBackgroundUrl)}
            label={post.author?.universityDetails?.name ?? "커뮤니티"}
            title={post.title}
            description={textExcerpt(post.content ?? post.description)}
            meta={formatDate(post.publishedAt)}
          />
        ))}
      </section>
    </ContentShell>
  );
}
