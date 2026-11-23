import type { Metadata } from "next";
import Link from "next/link";
import { JaShell, JaStoreCtaBanner } from "../../_components/ja/JaShell";
import { JsonLd } from "../../_components/public-content/JsonLd";
import {
  buildJaMetadata,
  JA_SAFETY_CHECKS,
  JA_SAFETY_FAQS,
} from "../../_lib/ja-content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  organizationRef,
  websiteRef,
} from "../../_lib/seo";
import { STATIC_SITEMAP_LASTMOD } from "../../_lib/sitemap-helpers";

const PATH = "/ja/safety";
const TITLE = "Sometime（サムタイム）の安全対策・身バレ防止ガイド｜本人確認と知り合いブロック";
const DESCRIPTION =
  "韓国の友達づくり・日韓交流アプリSometime（サムタイム）の安全対策まとめ。年齢確認・本人確認、連絡先ベースの知り合いブロック、キャラ開始、通報体制を詳しく説明します。";

export const revalidate = 3600;

export const metadata: Metadata = buildJaMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  koAlternatePath: "/block-acquaintances",
  keywords: [
    "韓国 友達 アプリ 安全",
    "日韓交流 アプリ 身バレ",
    "Sometime 安全性",
    "知り合いブロック アプリ",
    "サムタイム 本人確認",
  ],
});

export default function JaSafetyPage() {
  return (
    <JaShell activePath={PATH}>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${absoluteUrl(PATH)}#webpage`,
            url: absoluteUrl(PATH),
            name: TITLE,
            description: DESCRIPTION,
            inLanguage: "ja-JP",
            dateModified: STATIC_SITEMAP_LASTMOD[PATH].slice(0, 10),
            isPartOf: websiteRef(),
            publisher: organizationRef(),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: JA_SAFETY_FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
          breadcrumbJsonLd([
            { name: "Sometime（サムタイム）", path: "/ja" },
            { name: "安全対策・身バレ防止ガイド", path: PATH },
          ]),
        ]}
      />

      <nav aria-label="パンくずリスト" className="mb-4 text-xs font-semibold text-[#545C68]">
        <Link href="/ja" className="hover:underline">
          ホーム
        </Link>{" "}
        / <span className="text-[#191F28]">安全対策・身バレ防止ガイド</span>
      </nav>

      <article className="space-y-10">
        <header className="rounded-3xl border border-[#E6E3DC] bg-white p-7 sm:p-9">
          <span className="inline-block rounded-full bg-[#F2F0EC] px-3 py-1 text-xs font-bold text-[#191F28]">
            安全・プライバシー
          </span>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#191F28] sm:text-4xl">
            安心して韓国の友達と話すための
            <br />
            4つの安全・身バレ対策
          </h1>
          <p className="mt-4 rounded-2xl border border-[#EBE4D8] bg-[#FBF8F3] p-4 text-sm leading-relaxed text-[#191F28]">
            <strong>結論から：</strong>
            Sometime（サムタイム）は、
            <strong>年齢・本人確認、連絡先ハッシュによる知り合いブロック、キャラクター開始、通報・ブロック体制</strong>
            の4層でプライバシーと安全を守っています。
          </p>
        </header>

        <section aria-labelledby="safety-pillars" className="grid gap-4 sm:grid-cols-2">
          {JA_SAFETY_CHECKS.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E6E3DC] bg-white p-6"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#191F28] text-xs font-extrabold text-white">
                0{idx + 1}
              </span>
              <h2 className="mt-3 text-lg font-extrabold text-[#191F28]">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#545C68]">{item.detail}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="safety-faq">
          <h2 id="safety-faq" className="text-2xl font-black tracking-tight text-[#191F28]">
            安全・プライバシーに関するよくある質問
          </h2>
          <dl className="mt-4 space-y-3">
            {JA_SAFETY_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-[#E6E3DC] bg-white p-5"
              >
                <dt className="text-[15.5px] font-bold text-[#191F28]">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#545C68]">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <JaStoreCtaBanner
          title="プライバシーを守りながら、安心して日韓交流を。"
          description="知り合いブロックと本人確認を備えたSometimeで、同世代の韓国の友達とつながってみましょう。"
        />
      </article>
    </JaShell>
  );
}
