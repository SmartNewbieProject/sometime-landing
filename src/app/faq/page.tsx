import type { Metadata } from "next";

import { ContentShell } from "../_components/public-content/ContentShell";
import { ContentBreadcrumb } from "../_components/public-content/ContentBreadcrumb";
import { FaqAccordion } from "../_components/public-content/FaqAccordion";
import { JsonLd } from "../_components/public-content/JsonLd";
import {
  allFaqItems,
  FAQ_HUB_GROUPS,
  faqPageJsonLd,
} from "../_lib/faq";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
} from "../_lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "자주 묻는 질문 — 학교 인증 소개팅·캠퍼스 매칭",
  description:
    "썸타임 이용 전 궁금한 학교 인증, 캠퍼스 매칭, 비용과 신고·차단 방법을 확인하세요.",
  path: "/faq",
  keywords: [
    "썸타임 FAQ",
    "대학생 소개팅 질문",
    "학교 인증 소개팅",
    "캠퍼스 매칭",
    "썸타임 이용 방법",
  ],
});

export default function FaqPage() {
  const items = allFaqItems();

  return (
    <ContentShell>
      <JsonLd
        data={[
          faqPageJsonLd(items),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "자주 묻는 질문", path: "/faq" },
          ]),
        ]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-16">
        <ContentBreadcrumb
          items={[
            { href: "/", label: "홈" },
            { label: "자주 묻는 질문" },
          ]}
        />

        <header className="mb-12">
          <p className="mb-3 text-[14px] font-semibold tracking-wide text-[#7A4AE2]">
            FAQ
          </p>
          <h1 className="font-wantedSans text-[34px] font-bold leading-[46px] text-black sm:text-[40px] sm:leading-[52px]">
            궁금한 건 여기 모아 두었어요
          </h1>
          <p className="mt-4 max-w-[640px] text-[17px] font-medium leading-[28px] text-[#555]">
            가입 대상, 학교 인증, 사진 공개, 비용과 신고 방법을 짧고 정확하게 안내해요.
          </p>
        </header>

        <nav aria-label="FAQ 관련 도움말" className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { href: "/verification", label: "학교 인증" },
            { href: "/safety", label: "안전·신고" },
            { href: "/privacy/easy", label: "개인정보" },
            { href: "mailto:notify@smartnewb.com", label: "문의 메일" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#E9E1F8] bg-[#FCFAFF] px-3 py-2 text-center text-[14px] font-semibold text-[#5B35B5]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-10">
          {FAQ_HUB_GROUPS.map((group) => (
            <FaqAccordion
              key={group.id}
              title={group.title}
              description={group.description}
              items={group.items}
            />
          ))}
        </div>

        <aside className="mt-10 rounded-2xl bg-[#F7F3FF] p-5 sm:p-6">
          <h2 className="font-wantedSans text-[20px] font-bold leading-[30px] text-[#201823]">
            답을 찾지 못했나요?
          </h2>
          <p className="mt-2 text-[15px] font-medium leading-[24px] text-[#625A68]">
            계정이나 인증처럼 개인 확인이 필요한 문제는 앱 내 문의 또는 고객센터 이메일로 알려 주세요.
          </p>
          <a
            href="mailto:notify@smartnewb.com"
            className="mt-3 inline-flex min-h-11 items-center font-semibold text-[#5B35B5] underline underline-offset-4"
          >
            notify@smartnewb.com
          </a>
        </aside>
      </div>
    </ContentShell>
  );
}
