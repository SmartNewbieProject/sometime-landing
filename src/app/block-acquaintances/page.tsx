import type { Metadata } from "next";
import { ContentShell } from "../_components/public-content/ContentShell";
import { InfoPageBody } from "../_components/public-content/InfoPageBody";
import { JsonLd } from "../_components/public-content/JsonLd";
import { PublicProofStrip } from "../_components/public-content/PublicProofStrip";
import {
  READING_BODY,
  READING_H2,
  READING_SHELL,
} from "../_components/public-content/reading-styles";
import {
  BLOCK_ACQUAINTANCES_FAQS as FAQS,
  BLOCK_ACQUAINTANCES_PAGE as PAGE,
} from "../_lib/public-info-pages";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  websiteRef,
} from "../_lib/seo";
import { STATIC_SITEMAP_LASTMOD } from "../_lib/sitemap-helpers";

const PATH = "/block-acquaintances";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: PAGE.metaTitle,
  description: PAGE.description,
  path: PATH,
  keywords: PAGE.keywords,
});

const BLOCK_COMPARISON_ROWS = [
  {
    feature: "연락처 기반 지인 차단",
    sometime: "지원 (전화번호 해시 처리 저장·선택 동의)",
    general: "대부분 지원 (앱별 유료·무료 조건 상이)",
  },
  {
    feature: "같은 학교 전체 제외",
    sometime: "지원 (앱 설정에서 ON/OFF)",
    general: "미지원 (학교 인증 구조 없음)",
  },
  {
    feature: "같은 학과 단위 제외",
    sometime: "지원 (학교는 허용·같은 학과만 제외 가능)",
    general: "미지원",
  },
  {
    feature: "대학생 신원 인증",
    sometime: "학교 이메일·학생증·재학증명서 인증",
    general: "전화번호·직장 등 혼재",
  },
  {
    feature: "1:1 약속 같은 학교 비노출",
    sometime: "자동 적용 (같은 학교에 내 약속 비노출)",
    general: "해당 없음",
  },
] as const;

export default function BlockAcquaintancesPage() {
  return (
    <ContentShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${absoluteUrl(PATH)}#webpage`,
            name: PAGE.metaTitle,
            description: PAGE.description,
            url: absoluteUrl(PATH),
            dateModified: STATIC_SITEMAP_LASTMOD[PATH].slice(0, 10),
            inLanguage: "ko-KR",
            isPartOf: websiteRef(),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: PAGE.breadcrumbLabel, path: PATH },
          ]),
        ]}
      />
      <InfoPageBody
        badge={PAGE.badge}
        title={PAGE.title}
        answer={PAGE.answer}
        sections={PAGE.sections}
        links={PAGE.links}
        breadcrumbLabel={PAGE.breadcrumbLabel}
        storeCtaSurface="landing_public_guide"
        showMobileSticky
      />
      <section aria-labelledby="block-comparison" className={`${READING_SHELL} pt-0`}>
        <h2 id="block-comparison" className={`mb-4 ${READING_H2}`}>
          지인 차단 기능 비교: 썸타임(Sometime) vs 일반 소개팅 앱
        </h2>
        <p className={`mb-5 ${READING_BODY}`}>
          지인 차단 소개팅 앱을 고를 때는 전화번호 차단뿐 아니라 같은 캠퍼스·학과 노출을
          제어할 수 있는지 함께 확인하는 것이 중요해요.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[#EEE8FF] bg-white">
          <table className="w-full border-collapse text-left text-[15px] leading-6">
            <thead>
              <tr className="border-b border-[#EEE8FF] bg-[#FAF8FF] text-[#201823]">
                <th scope="col" className="px-4 py-3 font-bold">
                  비교 항목
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  썸타임 (Sometime)
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  일반 소개팅 앱
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1ECFA] text-[#2A2330]">
              {BLOCK_COMPARISON_ROWS.map((row) => (
                <tr key={row.feature}>
                  <th scope="row" className="px-4 py-3 font-semibold text-[#201823]">
                    {row.feature}
                  </th>
                  <td className="px-4 py-3 font-medium text-[#201823]">{row.sometime}</td>
                  <td className="px-4 py-3 text-[#625A68]">{row.general}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <PublicProofStrip headingId="block-real-proof" />
      <section aria-labelledby="block-faq" className={`${READING_SHELL} pt-0`}>
        <h2 id="block-faq" className={`mb-6 ${READING_H2}`}>
          자주 묻는 질문
        </h2>
        <dl className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.question} className="border-b border-[#EEE8FF] pb-6">
              <dt className="text-lg font-bold text-[#201823]">{faq.question}</dt>
              <dd className={`mt-2 ${READING_BODY}`}>{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </ContentShell>
  );
}
