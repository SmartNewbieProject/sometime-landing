import type { Metadata } from "next";
import Link from "next/link";
import { isOtherAppPath } from "../_lib/other-app-paths";
import { ContentBreadcrumb } from "../_components/public-content/ContentBreadcrumb";
import { ContentShell } from "../_components/public-content/ContentShell";
import { JsonLd } from "../_components/public-content/JsonLd";
import { PageHeader } from "../_components/public-content/PageHeader";
import {
  READING_BODY,
  READING_H2,
  READING_LINK,
  READING_MUTED,
  READING_SHELL,
} from "../_components/public-content/reading-styles";
import { StoreInstallCta } from "../_components/public-content/StoreInstallCta";
import {
  buildReviewsAggregateRating,
  formatFoundPartnerLine,
  formatStoreRatingLine,
  formatStoreReviewMeta,
  getPublicReviewsPage,
  selectFeaturedStoreReviews,
} from "../_lib/public-reviews";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  softwareApplicationJsonLd,
  websiteRef,
} from "../_lib/seo";
import { STATIC_SITEMAP_LASTMOD } from "../_lib/sitemap-helpers";

const PATH = "/reviews";
const TITLE = "썸타임 후기 | 대학생 소개팅 앱 실제 사용 후기";
const DESCRIPTION =
  "대학생 소개팅 앱 썸타임을 써 본 사람들의 후기를 모았어요. App Store·Google Play 평점과 후기, 썸타임에서 만난 사람들의 이야기를 가입 전에 확인해 보세요.";

// 서버 후기 목록은 하루에도 몇 번 바뀐다. 한 시간마다 다시 그리고, 실패하면 이전 페이지를 유지한다.
export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: ["썸타임 후기", "썸타임 어플 후기", "대학생 소개팅 앱 후기", "대학생 소개팅앱 후기", "썸타임"],
});

const REVIEWS_FAQS = [
  {
    question: "썸타임(Sometime)은 무료로도 이용할 수 있나요?",
    answer:
      "가입, 학교 인증, 정기 매칭 프로필 확인 등 기본 이용은 무료로 시작할 수 있어요. 추가 매칭이나 선택 기능에는 구슬을 사용하며, 필요한 조건과 구슬 수는 사용 전에 앱 화면에서 미리 안내해요.",
  },
  {
    question: "썸타임 실제 이용자 평점과 후기는 어디서 확인할 수 있나요?",
    answer:
      "App Store와 Google Play 공식 평점 요약, 썸타임에서 인연을 만난 커플 후기, 평점 4점 이상 대표 스토어 후기를 이 페이지에서 투명하게 확인할 수 있어요.",
  },
  {
    question: "썸타임 후기에서 많이 언급되는 장점은 무엇인가요?",
    answer:
      "학교 이메일·학생증 인증을 거친 또래 대학생 중심 환경, 같은 지역·인근 캠퍼스 매칭, 연락처 해시 기반 지인 차단과 같은 학교·학과 제외 기능이 자주 언급돼요.",
  },
] as const;

const RELATED_LINKS = [
  { label: "대학생 소개팅 앱 4곳 비교", href: "/dating-app-ranking" },
  { label: "지인 차단·같은 학교 제외", href: "/block-acquaintances" },
  { label: "자주 묻는 질문", href: "/faq" },
  { label: "학교 인증 방식", href: "/verification" },
  { label: "안전 안내", href: "/safety" },
  { label: "앱 다운로드", href: "/download" },
];

export default async function ReviewsPage() {
  const { summary, coupleReviews, storeReviews } = await getPublicReviewsPage();
  const featuredStoreReviews = selectFeaturedStoreReviews(storeReviews);
  const aggregateRating = buildReviewsAggregateRating(summary);

  return (
    <ContentShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${absoluteUrl(PATH)}#webpage`,
            name: TITLE,
            description: DESCRIPTION,
            url: absoluteUrl(PATH),
            dateModified: STATIC_SITEMAP_LASTMOD[PATH].slice(0, 10),
            inLanguage: "ko-KR",
            isPartOf: websiteRef(),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: REVIEWS_FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
          ...(aggregateRating ? [softwareApplicationJsonLd(aggregateRating)] : []),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "후기", path: PATH },
          ]),
        ]}
      />
      <div className={READING_SHELL}>
        <ContentBreadcrumb items={[{ href: "/", label: "홈" }, { label: "후기" }]} />

        <PageHeader
          eyebrow="썸타임 후기"
          title="대학생 소개팅 앱 썸타임, 써 본 사람들의 후기"
          lead={
            <div className="space-y-2">
              <p>{formatStoreRatingLine(summary)}</p>
              {summary.foundPartnerCount !== null && (
                <p>{formatFoundPartnerLine(summary.foundPartnerCount)}</p>
              )}
            </div>
          }
        />

        <div className="space-y-14">
          {coupleReviews.length > 0 && (
            <section aria-labelledby="couple-reviews">
              <h2 id="couple-reviews" className={`mb-5 ${READING_H2}`}>
                썸타임에서 만난 사람들
              </h2>
              <ul className="space-y-6">
                {coupleReviews.map((review) => (
                  <li key={review.id} className="border-l-2 border-[#EEE8FF] pl-5">
                    <blockquote className={READING_BODY}>{review.body}</blockquote>
                    <p className={`mt-2 text-[14px] ${READING_MUTED}`}>
                      {review.authorUniversity} · {review.partnerUniversity} 학생과 만났어요
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {summary.keywords.length > 0 && (
            <section aria-labelledby="review-keywords">
              <h2 id="review-keywords" className={`mb-5 ${READING_H2}`}>
                후기에서 많이 나온 말
              </h2>
              {summary.keywordBase > 0 && (
                <p className={`mb-4 text-[15px] ${READING_MUTED}`}>
                  후기 {summary.keywordBase}개를 읽고 주제별로 셌어요.
                </p>
              )}
              <ul className="divide-y divide-[#F1ECFA]">
                {summary.keywords.map((keyword) => (
                  <li key={keyword.key} className="flex items-center justify-between py-3">
                    <span className="text-[17px] font-semibold text-[#201823]">{keyword.label}</span>
                    <span className={`text-[15px] ${READING_MUTED}`}>{keyword.count}개</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="store-reviews">
            <h2 id="store-reviews" className={`mb-2 ${READING_H2}`}>
              App Store·Google Play 후기
            </h2>
            <p className={`mb-6 text-[15px] ${READING_MUTED}`}>
              {/* 서버 대표 후기 풀은 평점 4점 이상만 고른다(solo-nestjs-api app-review-featuring.repository.ts). 고른 후기라는 사실을 밝힌다. */}
              평점 4점 이상 후기 가운데 운영팀이 고른 대표 후기예요. 글은 고치지 않았어요. 전체 평점은 맨 위 숫자를 봐 주세요.
            </p>
            <ul className="divide-y divide-[#F1ECFA]">
              {featuredStoreReviews.map((review) => (
                <li key={review.id} className="py-5">
                  {review.title && (
                    <h3 className="mb-1 text-[17px] font-bold text-[#201823]">{review.title}</h3>
                  )}
                  <blockquote className="whitespace-pre-line text-[17px] leading-[1.75] text-[#2A2330]">
                    {review.body}
                  </blockquote>
                  <p className={`mt-2 text-[13px] ${READING_MUTED}`}>{formatStoreReviewMeta(review)}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="reviews-faq">
            <h2 id="reviews-faq" className={`mb-6 ${READING_H2}`}>
              후기에서 자주 묻는 이용·비용 안내
            </h2>
            <dl className="space-y-6">
              {REVIEWS_FAQS.map((faq) => (
                <div key={faq.question} className="border-b border-[#EEE8FF] pb-6">
                  <dt className="text-lg font-bold text-[#201823]">{faq.question}</dt>
                  <dd className={`mt-2 ${READING_BODY}`}>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <StoreInstallCta surface="landing_public_guide" heading="후기를 읽었다면, 직접 써 보세요" />

          <section className="border-t border-[#EEE8FF] pt-8">
            <h2 className="mb-3 text-[15px] font-bold text-[#625A68]">가입 전에 같이 보면 좋은 안내</h2>
            <ul className="grid gap-1 sm:grid-cols-2 sm:gap-x-5">
              {RELATED_LINKS.map((link) => {
                const Tag = isOtherAppPath(link.href) ? "a" : Link;
                return (
                  <li key={link.href}>
                    <Tag
                      href={link.href}
                      className={`inline-flex min-h-11 items-center py-2 text-[16px] leading-6 ${READING_LINK}`}
                    >
                      {link.label}
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </ContentShell>
  );
}
