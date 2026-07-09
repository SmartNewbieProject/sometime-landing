import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "../_components/public-content/ContentShell";
import { ContentBreadcrumb } from "../_components/public-content/ContentBreadcrumb";
import { FaqAccordion } from "../_components/public-content/FaqAccordion";
import { JsonLd } from "../_components/public-content/JsonLd";
import { TrialChatCta } from "../_components/public-content/TrialChatCta";
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
    "썸타임 이용 전 궁금한 점: 학교 인증, 캠퍼스 매칭, 무료 매칭, 안전 운영까지 한곳에서 확인하세요.",
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
            학교 인증, 캠퍼스 매칭, 비용과 안전까지. 썸타임을 시작하기 전에 가장 많이 묻는
            이야기입니다.
          </p>
        </header>

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

        <div className="mt-12">
          <TrialChatCta
            contentType="faq"
            placement="faq_bottom"
            title="표로 비교만 하지 말고, 대화 감각을 느껴보세요"
            description="학교 인증·비용 이야기를 읽었다면, 가입 전에 가상의 인연과 가벼운 대화를 먼저 체험해볼 수 있어요. 체험용 AI 대화이며 실제 유저 매칭은 아닙니다."
          />
        </div>

        <aside className="mt-10 rounded-[28px] bg-[#7A4AE2] px-6 py-8 text-white sm:px-8">
          <h2 className="font-wantedSans text-[22px] font-bold leading-[30px]">
            더 긴 이야기가 필요하다면
          </h2>
          <p className="mt-2 text-[15px] font-medium leading-[24px] text-[#E1D4FF]">
            비교 가이드와 운영 철학은 스토리에서, 짧은 소식은 카드뉴스에서 이어 읽을 수 있어요.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-[30px] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#7A4AE2]"
            >
              스토리 보기
            </Link>
            <Link
              href="/card-news"
              className="rounded-[30px] border border-white/40 px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              카드뉴스 보기
            </Link>
          </div>
        </aside>
      </div>
    </ContentShell>
  );
}
