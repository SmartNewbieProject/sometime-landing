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
  title: "썸타임 카드뉴스",
  description: "썸타임의 기능 소식, 연애 콘텐츠, 캠퍼스 안내를 카드뉴스와 롱폼으로 확인하세요.",
  alternates: { canonical: `${SITE_URL}/card-news` },
};

export default async function CardNewsIndexPage() {
  const [articles, items, communityPosts] = await Promise.all([
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

  const cardNewsItems: ContentPreview[] = items.map((item) => ({
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
        activeSource="card-news"
        eyebrow="CARD NEWS"
        title="가볍게 읽고 바로 이어지는 소식"
        description="앱 업데이트, 연애 팁, 캠퍼스 생활 정보를 썸타임의 공개 콘텐츠로 모았습니다."
        items={cardNewsItems}
        allItems={[...storyItems, ...cardNewsItems, ...communityItems]}
        cardNewsItems={cardNewsItems}
      />
    </ContentShell>
  );
}
