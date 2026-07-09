import type { Metadata } from "next";
import { ContentHome, type ContentPreview } from "../_components/public-content/ContentHome";
import { ContentShell } from "../_components/public-content/ContentShell";
import { JsonLd } from "../_components/public-content/JsonLd";
import {
  formatDate,
  getBlogArticles,
  getCardNewsList,
  getHotCommunityPosts,
  pickCommunityImage,
  pickImageFor,
  textExcerpt,
} from "../_lib/public-content";
import { buildPageMetadata, collectionPageJsonLd } from "../_lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "썸타임 커뮤니티 — 캠퍼스에서 오가는 이야기",
  description:
    "썸타임 커뮤니티에서 공개된 인기 이야기와 캠퍼스 연애 고민을 확인하세요. 대학생들의 진짜 고민과 일상을 모았습니다.",
  path: "/community",
  keywords: ["썸타임 커뮤니티", "대학생 고민", "캠퍼스 이야기", "연애 고민", "학교 인증 커뮤니티"],
});

export default async function CommunityIndexPage() {
  const [articles, cardNews, posts] = await Promise.all([
    getBlogArticles(),
    getCardNewsList(),
    getHotCommunityPosts(),
  ]);

  const storyItems: ContentPreview[] = articles.map((article) => ({
    id: article.id,
    href: `/blog/${encodeURIComponent(article.slug)}`,
    image: pickImageFor(article.id, article.thumbnail, article.coverImage),
    label: article.category,
    title: article.title,
    description: textExcerpt(article.excerpt ?? article.subtitle),
    meta: formatDate(article.publishedAt),
    source: "story",
    score: article.viewCount ?? 0,
  }));

  const cardNewsItems: ContentPreview[] = cardNews.map((item) => ({
    id: item.id,
    href: `/card-news/${item.id}`,
    image: pickImageFor(
      item.id,
      item.backgroundImage,
      ...(item.sections ?? []).map((section) => section.imageUrl),
    ),
    label: item.layoutMode === "longform" ? "롱폼" : "카드뉴스",
    title: item.title,
    description: textExcerpt(item.description ?? item.subtitle ?? item.body),
    meta: formatDate(item.publishedAt),
    source: "card-news",
    score: (item.readCount ?? 0) + (item.likeCount ?? 0),
  }));

  const communityItems: ContentPreview[] = posts.map((post) => ({
    id: post.id,
    href: `/community/${post.id}`,
    image: pickCommunityImage(post),
    label: post.author?.universityDetails?.name ?? "커뮤니티",
    title: post.title,
    description: textExcerpt(post.content ?? post.description),
    meta: formatDate(post.publishedAt),
    source: "community",
    score: (post.viewCount ?? 0) + (post.likeCount ?? 0) + (post.commentCount ?? 0),
  }));

  return (
    <ContentShell>
      <JsonLd
        data={collectionPageJsonLd({
          name: "썸타임 커뮤니티",
          description: "공개된 인기 이야기와 캠퍼스 연애 고민",
          path: "/community",
          items: communityItems.map((item) => ({ name: item.title, path: item.href })),
        })}
      />
      <ContentHome
        activeSource="community"
        eyebrow="COMMUNITY"
        title="지금 캠퍼스에서 오가는 이야기"
        description="운영진이 공개 노출로 선별한 커뮤니티 글을 앱 밖에서도 읽기 좋게 정리합니다."
        items={communityItems}
        allItems={[...storyItems, ...cardNewsItems, ...communityItems]}
        cardNewsItems={cardNewsItems}
      />
    </ContentShell>
  );
}
