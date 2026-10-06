import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ContentBreadcrumb } from "../../_components/public-content/ContentBreadcrumb";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { JsonLd } from "../../_components/public-content/JsonLd";
import { StoreInstallCta } from "../../_components/public-content/StoreInstallCta";
import { getUniversityPage } from "../../_lib/public-content";
import { canonicalUniversityPath } from "../../_lib/university-canonical";
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata } from "../../_lib/seo";
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

  return (
    <ContentShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: `${displayName} 소개팅`, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${displayName} 학생을 위한 썸타임 안내`,
            url: absoluteUrl(path),
            about: { "@type": "CollegeOrUniversity", name: displayName },
            description: `${displayName} 학생을 위한 학교 인증 기반 대학생 소개팅과 지역 매칭`,
          },
        ]}
      />
      <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-16">
        <ContentBreadcrumb
          items={[{ href: "/", label: "홈" }, { label: `${displayName} 소개팅` }]}
        />
        <header className="pb-8 pt-5 sm:pb-10 sm:pt-8">
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#7A4AE2]">UNIVERSITY MATCHING</p>
          <h1 className="mt-3 break-keep text-[34px] font-black leading-[1.3] text-[#201823] sm:text-[44px]">
            {displayName} 소개팅
          </h1>
          <p className="mt-4 max-w-2xl break-keep text-[16px] leading-7 text-[#625A68]">
            {displayName} 학교 정보를 바탕으로 썸타임의 학교 인증 방법과 공식 앱 이용 경로를 안내해요.
          </p>
        </header>

        <StoreInstallCta
          surface="landing_university"
          heading={`${displayName} 학생이라면 공식 앱에서 확인하세요`}
          description="학교 인증을 진행한 뒤 현재 이용 가능한 매칭 기능과 지역 범위를 앱에서 확인할 수 있어요."
        />

        <section aria-labelledby="school-information" className="mt-10">
          <h2 id="school-information" className="text-[22px] font-bold leading-8 text-[#201823]">
            등록된 학교 정보
          </h2>
          <div className={`mt-4 grid gap-3 ${regionLabel ? "sm:grid-cols-2" : ""}`}>
          <div className="rounded-[24px] border border-[#EEE8FF] bg-[#FCFAFF] p-6">
              <p className="text-[14px] font-semibold text-[#625A68]">학교</p>
              <p className="mt-2 break-keep text-[20px] font-bold text-black">{university.name}</p>
          </div>
            {regionLabel ? (
              <div className="rounded-[24px] border border-[#EEE8FF] bg-[#FCFAFF] p-6">
                <p className="text-[14px] font-semibold text-[#625A68]">서비스 학교 데이터 등록 지역</p>
                <p className="mt-2 break-keep text-[20px] font-bold text-black">{regionLabel}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="before-starting">
          <h2 id="before-starting" className="text-[22px] font-bold leading-8 text-[#201823]">
            시작하기 전에 확인하세요
          </h2>
          <p className="mt-3 break-keep text-[16px] leading-7 text-[#625A68]">
            실제 이용 가능 여부, 추천 범위와 매칭 결과는 시점과 앱 설정에 따라 달라질 수 있으므로
            앱의 현재 안내를 확인해 주세요.
          </p>
          <Link href="/verification" className="mt-3 inline-flex min-h-11 items-center font-semibold text-[#5B35B5] underline underline-offset-4">
            학교 인증 방법 보기
          </Link>
        </section>
      </div>
    </ContentShell>
  );
}
