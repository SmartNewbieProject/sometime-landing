import type { Metadata } from "next";
import { ContentCard } from "../_components/public-content/ContentCard";
import { ContentHero, ContentShell } from "../_components/public-content/ContentShell";
import { formatDate, getBlogArticles, pickImage, SITE_URL, textExcerpt } from "../_lib/public-content";

export const metadata: Metadata = {
  title: "썸타임 스토리",
  description: "학교 인증, 연애 고민, 소개팅 팁, 캠퍼스 라이프를 담은 썸타임 공개 스토리입니다.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogIndexPage() {
  const articles = await getBlogArticles();

  return (
    <ContentShell>
      <ContentHero
        eyebrow="SOMETIME STORY"
        title="캠퍼스에서 시작되는 이야기"
        description="학교 인증 소개팅을 운영하며 쌓아온 고민, 연애의 시작, 캠퍼스 생활의 맥락을 썸타임다운 문장으로 정리합니다."
      />
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ContentCard
            key={article.id}
            href={`/blog/${encodeURIComponent(article.slug)}`}
            image={pickImage(article.thumbnail)}
            label={article.category}
            title={article.title}
            description={textExcerpt(article.excerpt ?? article.subtitle)}
            meta={formatDate(article.publishedAt)}
          />
        ))}
      </section>
    </ContentShell>
  );
}
