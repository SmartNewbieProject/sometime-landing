import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { contentListHref, getContentListState, getContentPage, type ContentListPageProps } from "../_components/public-content/content-list";
import { contentSummary } from "../_lib/content-presentation";
import { ContentHome, type ContentPreview } from "../_components/public-content/ContentHome";
import { ContentShell } from "../_components/public-content/ContentShell";
import { JsonLd } from "../_components/public-content/JsonLd";
import {
  formatDate,
  getAllBlogArticles,
  pickImageFor,
} from "../_lib/public-content";
import { buildPageMetadata, collectionPageJsonLd } from "../_lib/seo";

const metadataOptions = {
  title: "썸타임 스토리 — 캠퍼스 연애·학교 인증 이야기",
  description:
    "학교 인증, 연애 고민, 소개팅 팁, 캠퍼스 라이프를 담은 썸타임 공개 스토리. 대학생 소개팅과 캠퍼스 매칭 인사이트를 읽어보세요.",
  path: "/blog",
  keywords: [
    "썸타임 스토리",
    "대학생 소개팅",
    "학교 인증",
    "캠퍼스 연애",
    "소개팅 팁",
    "대학생 매칭",
  ],
};

export async function generateMetadata({ searchParams }: ContentListPageProps): Promise<Metadata> {
  const state = getContentListState(await searchParams);
  return buildPageMetadata({
    ...metadataOptions,
    path: contentListHref("/blog", state),
    noIndex: Boolean(state.category),
  });
}

export default async function BlogIndexPage({ searchParams }: ContentListPageProps) {
  const state = getContentListState(await searchParams);
  const articles = await getAllBlogArticles();
  const storyItems: ContentPreview[] = articles
    .filter((article) => !article.slug.startsWith("jp-"))
    .map((article) => ({
      id: article.id,
      href: `/blog/${encodeURIComponent(article.slug)}`,
      image: pickImageFor(article.id, article.thumbnail, article.coverImage),
      label: article.category,
      title: article.title,
      description: contentSummary(article.excerpt ?? article.subtitle),
      meta: formatDate(article.publishedAt),
      source: "story",
    }));

  const result = getContentPage(storyItems, state);
  if (state.page !== result.page) {
    redirect(contentListHref("/blog", { ...state, page: result.page }));
  }

  return (
    <ContentShell>
      <JsonLd
        data={collectionPageJsonLd({
          name: "썸타임 스토리",
          description:
            "학교 인증, 연애 고민, 소개팅 팁, 캠퍼스 라이프를 담은 썸타임 공개 스토리",
          path: contentListHref("/blog", { ...state, page: result.page }),
          items: result.items.map((item) => ({ name: item.title, path: item.href })),
        })}
      />
      <ContentHome
        activeSource="story"
        eyebrow="SOMETIME STORY"
        title="썸타임 스토리"
        description="연애 고민과 캠퍼스 생활, 썸타임 팀의 이야기를 읽어보세요."
        items={storyItems}
        state={state}
        path="/blog"
      />
    </ContentShell>
  );
}
