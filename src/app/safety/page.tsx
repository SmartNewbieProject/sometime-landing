import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "../_components/public-content/ContentShell";
import { ContentBreadcrumb } from "../_components/public-content/ContentBreadcrumb";
import { JsonLd } from "../_components/public-content/JsonLd";
import { TrialChatCta } from "../_components/public-content/TrialChatCta";
import { StoreInstallCta } from "../_components/public-content/StoreInstallCta";
import {
  SAFETY_ANSWER,
  SAFETY_LEGAL_LINKS,
  SAFETY_SECTIONS,
} from "../_lib/safety";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  SITE_NAME,
} from "../_lib/seo";

const PAGE_TITLE = "썸타임 안전 안내 — 학교 인증, 신고·차단, 위기 대응";
const PAGE_DESCRIPTION =
  "학교 인증, 지인 차단, 신고·차단, 위반 조치, 미성년자 보호, 위급 연락처까지 캠퍼스에서 안전하게 만나기 위한 안내를 한곳에 정리했어요.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/safety",
  keywords: [
    "썸타임 안전",
    "대학생 소개팅 앱 안전",
    "소개팅 앱 안전한가",
    "소개팅 앱 사기 예방",
    "로맨스 스캠 예방",
    "학교 인증 소개팅",
    "소개팅 앱 신고 차단",
    "몸캠 피싱 예방",
  ],
});

function safetyPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: absoluteUrl("/safety"),
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };
}

export default function SafetyPage() {
  return (
    <ContentShell>
      <JsonLd
        data={[
          safetyPageJsonLd(),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "안전 안내", path: "/safety" },
          ]),
        ]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-16">
        <ContentBreadcrumb
          items={[{ href: "/", label: "홈" }, { label: "안전 안내" }]}
        />

        <header className="mb-12">
          <p className="mb-3 text-[14px] font-semibold tracking-wide text-[#7A4AE2]">
            SAFETY
          </p>
          <h1 className="font-wantedSans text-[34px] font-bold leading-[46px] text-black sm:text-[40px] sm:leading-[52px]">
            썸타임 안전 안내
          </h1>
          <div className="mt-5 space-y-2">
            {SAFETY_ANSWER.map((line) => (
              <p
                key={line}
                className="text-[16px] leading-[26px] text-neutral-600"
              >
                {line}
              </p>
            ))}
          </div>
        </header>

        <div className="space-y-12">
          {SAFETY_SECTIONS.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="mb-4 font-wantedSans text-[22px] font-bold leading-[32px] text-black sm:text-[24px]">
                {section.heading}
              </h2>
              {section.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-3 text-[16px] leading-[26px] text-neutral-700"
                >
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className="list-disc space-y-2 pl-5">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="text-[15px] leading-[24px] text-neutral-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-2xl bg-neutral-50 p-6">
          <h2 className="mb-3 font-wantedSans text-[18px] font-bold text-black">
            더 자세한 규칙이 궁금하다면
          </h2>
          <ul className="space-y-2">
            {SAFETY_LEGAL_LINKS.map((link) =>
              link.href.startsWith("/") ? (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] font-medium text-[#7A4AE2] underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-medium text-[#7A4AE2] underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </section>

        <div className="mt-16">
          <StoreInstallCta
            surface="landing_public_guide"
            heading="안전 장치를 확인했다면 공식 앱에서 시작하세요"
            showMobileSticky
          />
        </div>

        <div className="mt-16">
          <TrialChatCta
            contentType="safety"
            placement="safety_bottom"
            title="안전 장치를 확인했다면, 가볍게 체험해보세요"
            description="가입 전에 가상의 인연과 가벼운 대화를 먼저 체험해볼 수 있어요. 체험용 AI 대화이며 실제 유저 매칭은 아닙니다."
          />
        </div>
      </div>
    </ContentShell>
  );
}
