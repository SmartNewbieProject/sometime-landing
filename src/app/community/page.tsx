import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { contentListHref, getContentListState, getContentPage, type ContentListPageProps } from "../_components/public-content/content-list";
import { contentSummary } from "../_lib/content-presentation";
import { ContentHome, type ContentPreview } from "../_components/public-content/ContentHome";
import { ContentShell } from "../_components/public-content/ContentShell";
import { JsonLd } from "../_components/public-content/JsonLd";
import {
  formatDate,
  getHotCommunityPosts,
  pickCommunityImage,
} from "../_lib/public-content";
import { buildPageMetadata, collectionPageJsonLd } from "../_lib/seo";

const metadataOptions = {
  title: "썸타임 커뮤니티 — 캠퍼스에서 오가는 이야기",
  description:
    "썸타임 커뮤니티의 공개 글과 캠퍼스 연애 고민을 확인하세요. 공개 목록에 포함된 고민과 일상을 모았습니다.",
  path: "/stories",
  keywords: ["썸타임 커뮤니티", "대학생 고민", "캠퍼스 이야기", "연애 고민", "학교 인증 커뮤니티"],
};

export async function generateMetadata({ searchParams }: ContentListPageProps): Promise<Metadata> {
  const state = getContentListState(await searchParams);
  return buildPageMetadata({
    ...metadataOptions,
    path: contentListHref("/stories", state),
    noIndex: Boolean(state.category),
  });
}

export default async function CommunityIndexPage({ searchParams }: ContentListPageProps) {
  const state = getContentListState(await searchParams);
  const posts = await getHotCommunityPosts();
  const communityItems: ContentPreview[] = posts.map((post) => ({
    id: post.id,
    href: `/community/${post.id}`,
    image: pickCommunityImage(post),
    label: post.author?.universityDetails?.name ?? "커뮤니티",
    title: post.title,
    description: contentSummary(post.content ?? post.description),
    meta: formatDate(post.publishedAt),
    source: "community",
  }));

  const result = getContentPage(communityItems, state);
  if (state.page !== result.page) {
    redirect(contentListHref("/stories", { ...state, page: result.page }));
  }

  return (
    <ContentShell>
      <JsonLd
        data={collectionPageJsonLd({
          name: "썸타임 커뮤니티",
          description: "공개 커뮤니티 글과 캠퍼스 연애 고민",
          path: contentListHref("/stories", { ...state, page: result.page }),
          items: result.items.map((item) => ({ name: item.title, path: item.href })),
        })}
      />
      <ContentHome
        activeSource="community"
        eyebrow="COMMUNITY"
        title="커뮤니티 이야기"
        description="캠퍼스의 고민과 일상을 읽어보세요. 앱의 공개 목록에 포함된 글을 표시합니다."
        items={communityItems}
        state={state}
        path="/stories"
      />
    </ContentShell>
  );
}
