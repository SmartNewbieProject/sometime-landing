import type { Metadata } from "next";
import Link from "next/link";
import { ContentBreadcrumb } from "../_components/public-content/ContentBreadcrumb";
import { ContentShell } from "../_components/public-content/ContentShell";
import { JsonLd } from "../_components/public-content/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata } from "../_lib/seo";
import { universityDisplayName } from "../_lib/university-display";
import { getListedUniversities } from "../_lib/university-listing";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "학교별 대학생 소개팅 안내 — 썸타임",
  description: "학교를 골라 썸타임의 학교 인증 방법과 공식 앱 이용 경로를 확인하세요.",
  path: "/university",
  keywords: ["학교별 소개팅", "대학교 소개팅", "대학생 소개팅", "학교 인증 소개팅", "썸타임"],
});

export default async function UniversityIndexPage() {
  const listed = await getListedUniversities();
  if (listed.length === 0) {
    // 빈 목록을 그대로 렌더하면 색인된 안내 페이지가 비어 버린다. 실패시켜 직전 정상본을 유지한다.
    throw new Error("University index has no listed universities");
  }

  const items = listed
    .map((university) => ({
      path: `/university/${encodeURIComponent(university.code)}`,
      label: `${universityDisplayName(university)} 소개팅`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ko"));

  return (
    <ContentShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "학교별 안내", path: "/university" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "학교별 대학생 소개팅 안내",
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.label,
              url: absoluteUrl(item.path),
            })),
          },
        ]}
      />
      <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-16">
        <ContentBreadcrumb items={[{ href: "/", label: "홈" }, { label: "학교별 안내" }]} />
        <header className="pb-8 pt-5 sm:pb-10 sm:pt-8">
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#7A4AE2]">UNIVERSITY GUIDE</p>
          <h1 className="mt-3 break-keep text-[34px] font-black leading-[1.3] text-[#201823] sm:text-[44px]">
            학교별 대학생 소개팅 안내
          </h1>
          <p className="mt-4 max-w-2xl break-keep text-[16px] leading-7 text-[#625A68]">
            학교를 골라 썸타임의 학교 인증 방법과 공식 앱 이용 경로를 확인하세요.
          </p>
        </header>

        <nav aria-label="학교 목록">
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="flex min-h-12 items-center rounded-[16px] border border-[#EEE8FF] bg-[#FCFAFF] px-5 py-3 text-[16px] font-semibold text-[#201823] transition-colors duration-150 hover:border-[#D9CCF7] hover:bg-[#F6F1FF]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/verification" className="mt-10 inline-flex min-h-11 items-center font-semibold text-[#5B35B5] underline underline-offset-4">
          학교 인증 방법 보기
        </Link>
      </div>
    </ContentShell>
  );
}
