import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "../../_components/public-content/ContentShell";
import { JsonLd } from "../../_components/public-content/JsonLd";
import {
  READING_BODY,
  READING_H2,
  READING_SHELL,
} from "../../_components/public-content/reading-styles";
import {
  REPLY_GAP_FAQS,
  REPLY_GAP_RESULTS,
} from "../../_lib/reply-gap-check";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  organizationRef,
  websiteRef,
} from "../../_lib/seo";
import { STATIC_SITEMAP_LASTMOD } from "../../_lib/sitemap-helpers";
import { ReplyGapQuiz } from "./ReplyGapQuiz";

const PATH = "/dating-lab/reply-gap-check";
const PAGE_TITLE = "소개팅 연락 텀 호감도 자가진단 (30초 체크) | 썸타임 연애 실험실";
const PAGE_DESCRIPTION =
  "소개팅 후 답장 속도가 헷갈릴 때 30초 만에 확인하는 무료 연애심리테스트. 7가지 신호로 현재 호감도 구간과 바로 쓸 수 있는 다음 행동을 진단해 드려요.";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [
    "소개팅 연락 텀 테스트",
    "소개팅 호감도 테스트",
    "연애테스트",
    "연애심리테스트",
    "대학생 연애 테스트",
    "소개팅 답장 속도",
  ],
});

export default function ReplyGapCheckPage() {
  return (
    <ContentShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "@id": `${absoluteUrl(PATH)}#app`,
            name: "소개팅 연락 텀 호감도 자가진단",
            description: PAGE_DESCRIPTION,
            url: absoluteUrl(PATH),
            applicationCategory: "EntertainmentApplication",
            operatingSystem: "Web",
            inLanguage: "ko-KR",
            dateModified: STATIC_SITEMAP_LASTMOD[PATH].slice(0, 10),
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "KRW",
            },
            publisher: organizationRef(),
            isPartOf: websiteRef(),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: REPLY_GAP_FAQS.map((faq) => ({
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
            { name: "연애 실험실", path: "/dating-lab" },
            { name: "소개팅 연락 텀 호감도 자가진단", path: PATH },
          ]),
        ]}
      />

      <article className={READING_SHELL}>
        <nav aria-label="breadcrumb" className="mb-4 text-xs font-semibold text-[#545C68]">
          <Link href="/" className="hover:underline">
            홈
          </Link>{" "}
          /{" "}
          <Link href="/dating-lab" className="hover:underline">
            연애 실험실
          </Link>{" "}
          / <span className="text-[#191F28]">소개팅 연락 텀 호감도 자가진단</span>
        </nav>

        <span className="inline-block rounded-full bg-[#F2F0EC] px-3 py-1 text-xs font-bold text-[#191F28]">
          30초 무료 연애심리테스트
        </span>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-[#191F28] sm:text-4xl">
          소개팅 연락 텀 호감도 자가진단
        </h1>
        <p className={`mt-4 ${READING_BODY}`}>
          소개팅 후 답장 속도는 시간 숫자 하나보다{" "}
          <strong className="text-[#191F28]">
            ① 답장 내용의 밀도, ② 질문 회수, ③ 약속 반응
          </strong>
          을 함께 볼 때 가장 정확하게 읽혀요. 아래 7개 문항을 체크해 지금 상태를 30초 안에 확인해 보세요.
        </p>

        <ReplyGapQuiz />

        {/* Static SSR reference table for crawlers and quick overview */}
        <section aria-labelledby="score-bands" className="mt-14">
          <h2 id="score-bands" className={`mb-4 ${READING_H2}`}>
            점수 구간별 호감도 해석 기준표
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[#E6E3DC] bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[#FBF8F3] text-xs font-extrabold text-[#545C68]">
                <tr>
                  <th className="px-4 py-3">점수 구간</th>
                  <th className="px-4 py-3">진단 유형</th>
                  <th className="px-4 py-3">핵심 해석</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {REPLY_GAP_RESULTS.map((band) => (
                  <tr key={band.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-bold text-[#191F28]">
                      {band.minScore}~{band.maxScore}점
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold text-[#191F28]">
                      {band.title}
                    </td>
                    <td className="px-4 py-3 text-[#333D4B]">{band.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Visible FAQ matching FAQPage JSON-LD */}
        <section aria-labelledby="reply-gap-faq" className="mt-14">
          <h2 id="reply-gap-faq" className={`mb-5 ${READING_H2}`}>
            자주 묻는 질문
          </h2>
          <dl className="space-y-4">
            {REPLY_GAP_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-[#E6E3DC] bg-white p-5"
              >
                <dt className="text-[15.5px] font-bold text-[#191F28]">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#4E5968]">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </ContentShell>
  );
}
