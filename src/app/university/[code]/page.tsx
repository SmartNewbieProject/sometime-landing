import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ContentBreadcrumb } from "../../_components/public-content/ContentBreadcrumb";
import { PageHeader } from "../../_components/public-content/PageHeader";
import { READING_BODY, READING_H2, READING_LINK, READING_SHELL } from "../../_components/public-content/reading-styles";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { JsonLd } from "../../_components/public-content/JsonLd";
import { StoreInstallCta } from "../../_components/public-content/StoreInstallCta";
import { getUniversityPage } from "../../_lib/public-content";
import { canonicalUniversityPath } from "../../_lib/university-canonical";
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata, websiteRef } from "../../_lib/seo";
import { STATIC_SITEMAP_LASTMOD } from "../../_lib/sitemap-helpers";
import { UNIVERSITY_REGION_LABELS, universityDisplayName } from "../../_lib/university-display";

type PageProps = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const data = await getUniversityPage(code);
  if (!data) return { robots: { index: false, follow: false } };
  const canonicalPath = canonicalUniversityPath(code, data);
  if (canonicalPath) return { alternates: { canonical: canonicalPath }, robots: { index: false, follow: true } };

  const displayName = universityDisplayName(data.university);

  return buildPageMetadata({
    title: `${displayName} 소개팅 — 썸타임 대학생 매칭`,
    description: `${displayName} 학생을 위한 학교 인증 기반 대학생 소개팅과 지역 매칭 정보를 확인하세요.`,
    path: `/university/${encodeURIComponent(data.university.code)}`,
    keywords: [
      `${displayName} 소개팅`,
      `${displayName} 대학생 소개팅`,
      "학교 인증 소개팅",
      "썸타임",
    ],
  });
}

export default async function UniversityPage({ params }: PageProps) {
  const { code } = await params;
  const data = await getUniversityPage(code);
  if (!data) notFound();
  const canonicalPath = canonicalUniversityPath(code, data);
  if (canonicalPath) permanentRedirect(canonicalPath);

  const { university } = data;
  const path = `/university/${encodeURIComponent(university.code)}`;
  const regionLabel = university.region ? UNIVERSITY_REGION_LABELS[university.region] : undefined;
  const displayName = universityDisplayName(university);
  const faqs = [
    {
      question: `${displayName} 학생은 썸타임 학교 인증을 어떻게 진행하나요?`,
      answer:
        "학교 이메일 인증 또는 학생증·재학증명서 제출 두 가지 경로 중 하나를 선택해 인증할 수 있어요. 인증이 끝나기 전에는 프로필이 다른 이용자에게 보이지 않아요.",
    },
    {
      question: `${displayName} 같은 학교나 같은 학과 사람을 피할 수 있나요?`,
      answer:
        "네. 앱 안에서 '같은 학교 제외'와 '같은 학과 제외' 설정을 각각 켜고 끌 수 있고, 모바일 앱에서는 연락처 해시 기반 지인 차단도 선택해 이용할 수 있어요.",
    },
    {
      question: `${displayName} 학생도 무료로 시작할 수 있나요?`,
      answer:
        "네. 무료로 가입해 시작할 수 있고 일부 기능은 유료예요. 필요한 조건과 비용은 앱에서 사용 전에 안내해요.",
    },
  ];
  const relatedLinks = [
    { label: "지인 차단·같은 학교 제외 안내", href: "/block-acquaintances" },
    { label: "한일 매칭·자동 번역 채팅", href: "/korea-japan-matching" },
    { label: "대학생 소개팅 앱 4곳 비교", href: "/dating-app-ranking" },
    { label: "썸타임 실제 사용 후기", href: "/reviews" },
    { label: "시간·장소 먼저 정하는 1:1 약속", href: "/college-meeting" },
    { label: "전체 학교별 안내 보기", href: "/university" },
  ];

  return (
    <ContentShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "학교별 안내", path: "/university" },
            { name: `${displayName} 소개팅`, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${absoluteUrl(path)}#webpage`,
            name: `${displayName} 학생을 위한 썸타임 안내`,
            url: absoluteUrl(path),
            dateModified: STATIC_SITEMAP_LASTMOD["/university"].slice(0, 10),
            inLanguage: "ko-KR",
            isPartOf: websiteRef(),
            about: { "@type": "CollegeOrUniversity", name: displayName },
            description: `${displayName} 학생을 위한 학교 인증 기반 대학생 소개팅과 지역 매칭`,
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ]}
      />
      <div className={READING_SHELL}>
        <ContentBreadcrumb
          items={[
            { href: "/", label: "홈" },
            { href: "/university", label: "학교별 안내" },
            { label: `${displayName} 소개팅` },
          ]}
        />
        <PageHeader
          eyebrow="UNIVERSITY MATCHING"
          title={`${displayName} 소개팅`}
          lead={`${displayName} 학교 정보를 바탕으로 썸타임의 학교 인증 방법과 공식 앱 이용 경로를 안내해요.`}
          className="mb-8"
        />

        <StoreInstallCta
          surface="landing_university"
          heading={`${displayName} 학생이라면 공식 앱에서 확인하세요`}
          description="학교 인증을 진행한 뒤 현재 이용 가능한 매칭 기능과 지역 범위를 앱에서 확인할 수 있어요."
        />

        <section aria-labelledby="school-information" className="mt-10">
          <h2 id="school-information" className={READING_H2}>
            등록된 학교 정보
          </h2>
          <dl className="mt-4 divide-y divide-[#EEE8FF] border-y border-[#EEE8FF]">
            <div className="py-4">
              <dt className="text-sm font-semibold text-[#625A68]">학교</dt>
              <dd className="mt-1 break-keep text-xl font-bold tracking-[-0.02em] text-[#201823]">{university.name}</dd>
            </div>
            {regionLabel ? (
              <div className="py-4">
                <dt className="text-sm font-semibold text-[#625A68]">서비스 학교 데이터 등록 지역</dt>
                <dd className="mt-1 break-keep text-xl font-bold tracking-[-0.02em] text-[#201823]">{regionLabel}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="mt-10" aria-labelledby="before-starting">
          <h2 id="before-starting" className={READING_H2}>
            시작하기 전에 확인하세요
          </h2>
          <p className={`mt-4 break-keep ${READING_BODY}`}>
            실제 이용 가능 여부, 추천 범위와 매칭 결과는 시점과 앱 설정에 따라 달라질 수 있으므로
            앱의 현재 안내를 확인해 주세요.
          </p>
          <Link href="/verification" className={`mt-3 inline-flex min-h-11 items-center ${READING_LINK}`}>
            학교 인증 방법 보기
          </Link>
        </section>

        <section className="mt-12 border-t border-[#EEE8FF] pt-8" aria-labelledby="university-faq">
          <h2 id="university-faq" className={`mb-6 ${READING_H2}`}>
            자주 묻는 질문
          </h2>
          <dl className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-[#EEE8FF] pb-6">
                <dt className="text-lg font-bold text-[#201823]">{faq.question}</dt>
                <dd className={`mt-2 ${READING_BODY}`}>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10" aria-labelledby="university-related">
          <h2 id="university-related" className="mb-3 text-[15px] font-bold text-[#625A68]">
            관련 안내 바로가기
          </h2>
          <ul className="grid gap-1 sm:grid-cols-2 sm:gap-x-5">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`inline-flex min-h-11 items-center py-2 text-[16px] leading-6 ${READING_LINK}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentShell>
  );
}
