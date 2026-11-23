import type { Metadata } from "next";
import Link from "next/link";
import { JaShell, JaStoreCtaBanner } from "../_components/ja/JaShell";
import { JsonLd } from "../_components/public-content/JsonLd";
import {
  buildJaMetadata,
  JA_APP_STORE_URL,
  JA_GOOGLE_PLAY_URL,
  JA_HOME_FAQS,
  JA_HOME_PILLARS,
  JA_HOME_STEPS,
} from "../_lib/ja-content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  organizationRef,
  websiteRef,
} from "../_lib/seo";
import { STATIC_SITEMAP_LASTMOD } from "../_lib/sitemap-helpers";

const PATH = "/ja";
const TITLE = "Sometime（サムタイム）｜韓国の友達・言語交換・日韓交流アプリ";
const DESCRIPTION =
  "Sometime（サムタイム）は、日本の大学生・20代と韓国の大学生・20代が自動翻訳チャットでつながる日韓交流アプリ。韓国語が話せなくても、本人確認と身バレ対策で安心して始められます。";

export const revalidate = 3600;

export const metadata: Metadata = buildJaMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  koAlternatePath: "/",
  keywords: [
    "Sometime",
    "サムタイム",
    "韓国の友達 アプリ",
    "韓国人 友達 アプリ",
    "日韓交流 アプリ",
    "韓国語 言語交換 アプリ",
    "韓国語 翻訳 チャット",
  ],
});

export default function JaHomePage() {
  return (
    <JaShell activePath="/ja">
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
            "@type": "MobileApplication",
            name: "Sometime（サムタイム）",
            description: DESCRIPTION,
            applicationCategory: "SocialNetworkingApplication",
            operatingSystem: "iOS, Android",
            inLanguage: "ja-JP",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "JPY",
            },
            downloadUrl: [JA_APP_STORE_URL, JA_GOOGLE_PLAY_URL],
            publisher: organizationRef(),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: JA_HOME_FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
          breadcrumbJsonLd([
            { name: "Sometime（サムタイム）", path: PATH },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="rounded-3xl border border-[#E6E3DC] bg-white p-7 sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#FBF8F3] px-3 py-1 text-xs font-bold text-[#191F28] ring-1 ring-[#E6E0D4]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7A4AE2]" />
          日韓の大学生・20代のための交流アプリ
        </span>
        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#191F28] sm:text-5xl">
          韓国の同世代と、
          <br />
          日本語のまま自然に話す。
        </h1>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-[#545C68]">
          Sometime（サムタイム）は、日本の大学生・20代と韓国の大学生・20代が
          <strong className="font-bold text-[#191F28]">自動翻訳チャット</strong>
          を通じて、韓国語学習やK-POP・旅行・日常の話題から自然につながれる日韓交流コミュニティアプリです。
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={JA_APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#7A4AE2] px-6 text-sm font-bold text-white transition-colors hover:bg-[#6738CE]"
          >
            App Storeで無料ダウンロード
          </a>
          <a
            href={JA_GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-[#191F28] bg-white px-6 text-sm font-bold text-[#191F28] transition-colors hover:bg-[#F5F4F0]"
          >
            Google Playでダウンロード
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["自動翻訳チャット", "年齢・本人確認", "知り合いブロック対応", "無料でスタート"].map(
            (chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF8F3] px-3 py-1.5 text-xs font-bold text-[#191F28] ring-1 ring-[#EBE4D8]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#7A4AE2]" />
                {chip}
              </span>
            ),
          )}
        </div>
      </section>

      {/* 3 Pillars */}
      <section aria-labelledby="ja-pillars" className="mt-12">
        <h2 id="ja-pillars" className="text-2xl font-black tracking-tight text-[#191F28]">
          Sometimeが選ばれる3つの理由
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {JA_HOME_PILLARS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E6E3DC] bg-white p-5"
            >
              <span className="inline-block rounded-full bg-[#F2F0EC] px-2.5 py-0.5 text-[11px] font-extrabold text-[#545C68]">
                {item.eyebrow}
              </span>
              <h3 className="mt-3 text-base font-extrabold leading-snug text-[#191F28]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#545C68]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Steps */}
      <section aria-labelledby="ja-steps" className="mt-12">
        <h2 id="ja-steps" className="text-2xl font-black tracking-tight text-[#191F28]">
          始め方はシンプル、3ステップ
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {JA_HOME_STEPS.map((s) => (
            <li
              key={s.step}
              className="rounded-2xl border border-[#E6E3DC] bg-[#FBF8F3] p-5"
            >
              <span className="text-xs font-black tracking-wider text-[#545C68]">
                STEP {s.step}
              </span>
              <h3 className="mt-2 text-base font-extrabold text-[#191F28]">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#545C68]">{s.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Dedicated Guide Links */}
      <section aria-labelledby="ja-guides" className="mt-12">
        <h2 id="ja-guides" className="text-2xl font-black tracking-tight text-[#191F28]">
          詳しく知る（公式ガイド）
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/ja/korean-language-exchange"
            className="group rounded-2xl border border-[#E6E3DC] bg-white p-5 transition-colors hover:border-[#191F28]"
          >
            <p className="text-xs font-extrabold text-[#545C68]">比較ガイド</p>
            <h3 className="mt-1.5 text-lg font-extrabold text-[#191F28] group-hover:underline">
              韓国語の言語交換アプリ、どう選ぶ？ →
            </h3>
            <p className="mt-1.5 text-sm text-[#545C68]">
              一般的な言語交換アプリとの違いや、初心者でも会話が続くポイントを比較表で解説。
            </p>
          </Link>

          <Link
            href="/ja/safety"
            className="group rounded-2xl border border-[#E6E3DC] bg-white p-5 transition-colors hover:border-[#191F28]"
          >
            <p className="text-xs font-extrabold text-[#545C68]">安全・プライバシー</p>
            <h3 className="mt-1.5 text-lg font-extrabold text-[#191F28] group-hover:underline">
              本人確認と身バレ対策のしくみ →
            </h3>
            <p className="mt-1.5 text-sm text-[#545C68]">
              連絡先ハッシュによる知り合いブロック、キャラ開始、通報・ブロック体制をご案内。
            </p>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="ja-faq" className="mt-12">
        <h2 id="ja-faq" className="text-2xl font-black tracking-tight text-[#191F28]">
          よくある質問
        </h2>
        <dl className="mt-5 space-y-3">
          {JA_HOME_FAQS.map((faq) => (
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
        title="まずは一言から、韓国の友達と話してみよう。"
        description="無料でダウンロードして、自動翻訳付きチャットで日韓交流を始められます。"
      />
    </JaShell>
  );
}
