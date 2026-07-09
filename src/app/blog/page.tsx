import type { Metadata } from "next";
import { ContentHome, type ContentPreview } from "../_components/public-content/ContentHome";
import { ContentShell } from "../_components/public-content/ContentShell";
import {
  formatDate,
  getBlogArticles,
  getCardNewsList,
  getHotCommunityPosts,
  pickImage,
  SITE_URL,
  textExcerpt,
} from "../_lib/public-content";

export const metadata: Metadata = {
  title: "썸타임 스토리",
  description: "학교 인증, 연애 고민, 소개팅 팁, 캠퍼스 라이프를 담은 썸타임 공개 스토리입니다.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogIndexPage() {
  const [articles, cardNews, communityPosts] = await Promise.all([
    getBlogArticles(),
    getCardNewsList(),
    getHotCommunityPosts(),
  ]);

  const storyItems: ContentPreview[] = articles.map((article) => ({
    id: article.id,
    href: `/blog/${encodeURIComponent(article.slug)}`,
    image: pickImage(article.thumbnail),
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
    image: pickImage(item.backgroundImage),
    label: item.layoutMode === "longform" ? "롱폼" : "카드뉴스",
    title: item.title,
    description: textExcerpt(item.description ?? item.subtitle ?? item.body),
    meta: formatDate(item.publishedAt),
    source: "card-news",
    score: (item.readCount ?? 0) + (item.likeCount ?? 0),
  }));

  const communityItems: ContentPreview[] = communityPosts.map((post) => ({
    id: post.id,
    href: `/community/${post.id}`,
    image: pickImage(post.customBackgroundUrl),
    label: post.author?.universityDetails?.name ?? "커뮤니티",
    title: post.title,
    description: textExcerpt(post.content ?? post.description),
    meta: formatDate(post.publishedAt),
    source: "community",
    score: (post.viewCount ?? 0) + (post.likeCount ?? 0) + (post.commentCount ?? 0),
  }));

  return (
    <ContentShell>
      <ContentHome
        activeSource="story"
        eyebrow="SOMETIME STORY"
        title="캠퍼스에서 시작되는 이야기"
        description="학교 인증 소개팅을 운영하며 쌓아온 고민, 연애의 시작, 캠퍼스 생활의 맥락을 썸타임다운 문장으로 정리합니다."
        items={storyItems}
        allItems={[...storyItems, ...cardNewsItems, ...communityItems]}
        cardNewsItems={cardNewsItems}
      />
    </ContentShell>
  );
}
