import type { Metadata } from "next";
import { ContentCard } from "../_components/public-content/ContentCard";
import { ContentHero, ContentShell } from "../_components/public-content/ContentShell";
import { formatDate, getCardNewsList, pickImage, SITE_URL, textExcerpt } from "../_lib/public-content";

export const metadata: Metadata = {
  title: "썸타임 카드뉴스",
  description: "썸타임의 기능 소식, 연애 콘텐츠, 캠퍼스 안내를 카드뉴스와 롱폼으로 확인하세요.",
  alternates: { canonical: `${SITE_URL}/card-news` },
};

export default async function CardNewsIndexPage() {
  const items = await getCardNewsList();

  return (
    <ContentShell>
      <ContentHero
        eyebrow="CARD NEWS"
        title="가볍게 읽고 바로 이어지는 소식"
        description="앱 업데이트, 연애 팁, 캠퍼스 생활 정보를 썸타임의 공개 콘텐츠로 모았습니다."
      />
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            href={`/card-news/${item.id}`}
            image={pickImage(item.backgroundImage)}
            label={item.layoutMode === "longform" ? "롱폼" : "카드뉴스"}
            title={item.title}
            description={textExcerpt(item.description ?? item.subtitle ?? item.body)}
            meta={formatDate(item.publishedAt)}
          />
        ))}
      </section>
    </ContentShell>
  );
}
