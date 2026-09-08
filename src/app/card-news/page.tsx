import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { contentListHref, getContentListState, getContentPage, getCardNewsPreviews, type ContentListPageProps } from "../_components/public-content/content-list";
import { ContentHome } from "../_components/public-content/ContentHome";
import { ContentShell } from "../_components/public-content/ContentShell";
import { JsonLd } from "../_components/public-content/JsonLd";
import { getAllCardNews } from "../_lib/public-content";
import { buildPageMetadata, collectionPageJsonLd } from "../_lib/seo";

const metadataOptions = {
  title: "썸타임 카드뉴스 — 연애·캠퍼스 소식을 빠르게",
  description:
    "썸타임의 기능 소식, 연애 콘텐츠, 캠퍼스 안내를 카드뉴스와 롱폼으로 확인하세요. 가볍게 읽고 앱에서 이어갈 수 있습니다.",
  path: "/card-news",
  keywords: ["썸타임 카드뉴스", "대학생 연애", "캠퍼스 소식", "소개팅 팁", "앱 업데이트"],
};

export async function generateMetadata({ searchParams }: ContentListPageProps): Promise<Metadata> {
  const state = getContentListState(await searchParams);
  return buildPageMetadata({
    ...metadataOptions,
    path: contentListHref("/card-news", state),
    noIndex: Boolean(state.category),
  });
}

export default async function CardNewsIndexPage({ searchParams }: ContentListPageProps) {
  const state = getContentListState(await searchParams);
  const items = await getAllCardNews();
  const cardNewsItems = getCardNewsPreviews(items);

  const result = getContentPage(cardNewsItems, state);
  if (state.page !== result.page) {
    redirect(contentListHref("/card-news", { ...state, page: result.page }));
  }

  return (
    <ContentShell>
      <JsonLd
        data={collectionPageJsonLd({
          name: "썸타임 카드뉴스",
          description: "기능 소식, 연애 콘텐츠, 캠퍼스 안내를 카드뉴스와 롱폼으로",
          path: contentListHref("/card-news", { ...state, page: result.page }),
          items: result.items.map((item) => ({ name: item.title, path: item.href })),
        })}
      />
      <ContentHome
        activeSource="card-news"
        eyebrow="CARD NEWS"
        title="카드뉴스"
        description="앱 소식과 연애 콘텐츠를 모았습니다. 공지와 행사는 게시일과 본문의 적용 기간을 확인하세요."
        items={cardNewsItems}
        state={state}
        path="/card-news"
      />
    </ContentShell>
  );
}
