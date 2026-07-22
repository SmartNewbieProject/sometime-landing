import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBreadcrumb } from "../../_components/public-content/ContentBreadcrumb";
import { ContentHero, ContentShell } from "../../_components/public-content/ContentShell";
import { JsonLd } from "../../_components/public-content/JsonLd";
import { StoreInstallCta } from "../../_components/public-content/StoreInstallCta";
import { getUniversityPage } from "../../_lib/public-content";
import { breadcrumbJsonLd, buildPageMetadata } from "../../_lib/seo";

type PageProps = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const data = await getUniversityPage(code);
  if (!data) return { robots: { index: false, follow: false } };

  return buildPageMetadata({
    title: `${data.university.name} 소개팅 — 썸타임 대학생 매칭`,
    description: `${data.university.name} 학생을 위한 학교 인증 기반 대학생 소개팅과 지역 매칭 정보를 확인하세요.`,
    path: `/university/${encodeURIComponent(data.university.code)}`,
    keywords: [
      `${data.university.name} 소개팅`,
      `${data.university.name} 대학생 소개팅`,
      "학교 인증 소개팅",
      "썸타임",
    ],
  });
}

export default async function UniversityPage({ params }: PageProps) {
  const { code } = await params;
  const data = await getUniversityPage(code);
  if (!data) notFound();

  const { university, stats } = data;
  const path = `/university/${encodeURIComponent(university.code)}`;

  return (
    <ContentShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: `${university.name} 소개팅`, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollegeOrUniversity",
            name: university.name,
            description: `${university.name} 학생을 위한 학교 인증 기반 대학생 소개팅과 지역 매칭`,
          },
        ]}
      />
      <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-16">
        <ContentBreadcrumb
          items={[{ href: "/", label: "홈" }, { label: `${university.name} 소개팅` }]}
        />
        <ContentHero
          eyebrow="UNIVERSITY MATCHING"
          title={`${university.name} 소개팅`}
          description={`${university.name} 학생을 위한 학교 인증 기반 AI 취향 매칭과 캠퍼스 인연을 만나보세요.`}
        />
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[#EEE8FF] bg-[#FCFAFF] p-6">
            <p className="text-[14px] font-semibold text-[#777]">인증 대학생</p>
            <p className="mt-2 text-[32px] font-bold text-black">
              {(stats.verifiedCount ?? 0).toLocaleString("ko-KR")}명
            </p>
          </div>
          <div className="rounded-[24px] border border-[#EEE8FF] bg-[#FCFAFF] p-6">
            <p className="text-[14px] font-semibold text-[#777]">매칭 기준</p>
            <p className="mt-2 text-[20px] font-bold text-black">학교 인증 · 지역 · 취향</p>
          </div>
        </section>
        <div className="article-reading-column mt-12">
          <h2>왜 썸타임인가요?</h2>
          <p>
            썸타임은 학교 인증을 바탕으로 같은 지역과 인접 대학의 대학생이 자연스럽게
            대화를 시작할 수 있도록 돕습니다. 프로필을 확인하고 서로의 속도에 맞춰 인연을
            이어가 보세요.
          </p>
        </div>
        <div className="mt-12">
          <StoreInstallCta
            surface="landing_university"
            heading={`${university.name} 학생이라면 썸타임에서 시작하세요`}
            description="공식 앱을 설치하고 학교 인증을 완료하면 같은 생활권의 대학생 인연을 만날 수 있어요."
            showMobileSticky
          />
        </div>
      </div>
    </ContentShell>
  );
}
