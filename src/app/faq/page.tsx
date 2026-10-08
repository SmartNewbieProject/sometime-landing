import type { Metadata } from "next";

import { PageHeader } from "../_components/public-content/PageHeader";
import { READING_LINK, READING_SHELL } from "../_components/public-content/reading-styles";
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

      <div className={READING_SHELL}>
        <ContentBreadcrumb
          items={[
            { href: "/", label: "홈" },
            { label: "자주 묻는 질문" },
          ]}
        />

        <PageHeader
          eyebrow="FAQ"
          title="궁금한 건 여기 모아 두었어요"
          lead="가입 대상, 학교 인증, 사진 공개, 비용과 신고 방법을 짧고 정확하게 안내해요."
        />

        <nav aria-label="FAQ 관련 도움말" className="mb-10 flex flex-wrap gap-2">
          {[
            { href: "/verification", label: "학교 인증" },
            { href: "/safety", label: "안전·신고" },
            { href: "/privacy/easy", label: "개인정보" },
            { href: "mailto:notify@smartnewb.com", label: "문의 메일" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F4F0FF] px-4 py-2 text-center text-[14px] font-semibold text-[#5B35B5]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-12">
          {FAQ_HUB_GROUPS.map((group) => (
            <FaqAccordion
              key={group.id}
              title={group.title}
              description={group.description}
              items={group.items}
            />
          ))}
        </div>

        <aside className="mt-12 border-y border-[#EEE8FF] py-7">
          <h2 className="font-wantedSans text-[22px] font-extrabold leading-[1.4] tracking-[-0.03em] text-[#201823]">
            답을 찾지 못했나요?
          </h2>
          <p className="mt-2 text-[17px] leading-[1.7] text-[#625A68]">
            계정이나 인증처럼 개인 확인이 필요한 문제는 앱 내 문의 또는 고객센터 이메일로 알려 주세요.
          </p>
          <a
            href="mailto:notify@smartnewb.com"
            className={`mt-3 inline-flex min-h-11 items-center ${READING_LINK}`}
          >
            notify@smartnewb.com
          </a>
        </aside>
      </div>
    </ContentShell>
  );
}
