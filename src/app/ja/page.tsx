import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JaLiveChatDemo } from "../_components/ja/JaLiveChatDemo";
import { JaShell, JaStoreCtaBanner } from "../_components/ja/JaShell";
import { JsonLd } from "../_components/public-content/JsonLd";
import {
  buildJaMetadata,
  JA_APP_STORE_URL,
  JA_EXCHANGE_COMPARISON,
  JA_GOOGLE_PLAY_URL,
  JA_HOME_FAQS,
  JA_HOME_PILLARS,
  JA_HOME_STEPS,
  JA_SAFETY_CHECKS,
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

const PILLAR_ICONS = [
  // Translation / chat icon
  <svg key="chat" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v7c0 1.38-1.12 2.5-2.5 2.5H10l-4.5 3.5V16H6.5C5.12 16 4 14.88 4 13.5v-7Z"
      stroke="#7A4AE2"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path d="M8.5 9.5h7M8.5 12.5h4.5" stroke="#191F28" strokeWidth="1.8" strokeLinecap="round" />
  </svg>,
  // Shield / safety icon
  <svg key="shield" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3 19 5.8v5.3c0 4.5-3 8.1-7 9.9-4-1.8-7-5.4-7-9.9V5.8L12 3Z"
      stroke="#7A4AE2"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path
      d="m9 11.8 2 2 4.2-4.3"
      stroke="#191F28"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Spark / shared interests icon
  <svg key="spark" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3.5 14 9.8 20.5 12 14 14.2 12 20.5 10 14.2 3.5 12 10 9.8 12 3.5Z"
      stroke="#7A4AE2"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
  </svg>,
];

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
          breadcrumbJsonLd([{ name: "Sometime（サムタイム）", path: PATH }]),
        ]}
      />

      {/* Editorial Split Hero + Live Interactive Auto-Translation Chat */}
      <section className="grid items-center gap-10 rounded-3xl border border-[#E6E2DA] bg-white p-6 shadow-[0_8px_30px_rgba(25,31,40,0.04)] sm:p-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FBF8F3] px-3 py-1 text-xs font-bold text-[#191F28] ring-1 ring-[#E6E0D4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7A4AE2]" />
            日韓の大学生・20代のための交流アプリ
          </span>
          <h1 className="mt-4 text-3xl font-black leading-[1.2] tracking-tight text-[#191F28] sm:text-[42px]">
            韓国の同世代と、
            <br />
            日本語のまま自然に話す。
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[#545C68]">
            Sometime（サムタイム）は、日本の大学生・20代と韓国の大学生・20代が
            <strong className="font-bold text-[#191F28]">自動翻訳チャット</strong>
            を通じて、韓国語学習やK-POP・カフェ・旅行の話題から自然につながれる日韓交流コミュニティアプリです。
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href={JA_APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7A4AE2] px-5 text-sm font-bold text-white transition-colors hover:bg-[#6738CE]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83ZM15.97 6.33c.68-.83 1.14-1.99 1.01-3.15-.98.04-2.16.65-2.86 1.48-.63.72-1.18 1.9-1.03 3.03 1.09.08 2.2-.55 2.88-1.36Z" />
              </svg>
              App Storeで無料ダウンロード
            </a>
            <a
              href={JA_GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#191F28] bg-white px-5 text-sm font-bold text-[#191F28] transition-colors hover:bg-[#F5F4F0]"
            >
              Google Play
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["自動翻訳チャット", "年齢・本人確認", "知り合いブロック", "無料でスタート"].map(
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
        </div>

        <JaLiveChatDemo />
      </section>

      {/* Product Visual Feature Strip */}
      <section aria-labelledby="ja-visual-showcase" className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold tracking-wider text-[#545C68]">
              DESIGNED FOR COMFORT
            </p>
            <h2 id="ja-visual-showcase" className="mt-1 text-2xl font-black tracking-tight text-[#191F28]">
              重くなく、安心して始められる設計
            </h2>
          </div>
          <Link
            href="/ja/safety"
            className="text-sm font-bold text-[#191F28] underline underline-offset-4 hover:text-[#545C68]"
          >
            安全対策を詳しく見る →
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-[#E6E2DA] bg-white">
            <div className="relative aspect-[16/10] w-full bg-[#FBF8F3]">
              <Image
                src="/images/ja/japan-profile-match-cards.webp"
                alt="日韓の同世代プロフィールカードのイメージ"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-base font-extrabold text-[#191F28]">
                共通の興味から自然にスタート
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#545C68]">
                好きな音楽・カフェ・旅行先などのキーワードを先に見てから、一言メッセージで会話を始められます。
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E6E2DA] bg-white">
            <div className="relative aspect-[16/10] w-full bg-[#FBF8F3]">
              <Image
                src="/images/ja/contact-block.webp"
                alt="連絡先ベースの知り合いブロック機能"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-base font-extrabold text-[#191F28]">
                連絡先ベースの知り合いブロック
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#545C68]">
                電話番号をハッシュ照合して知り合いを非表示に。相手に通知は届かず、身バレの不安を減らせます。
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E6E2DA] bg-white">
            <div className="relative aspect-[16/10] w-full bg-[#FBF8F3]">
              <Image
                src="/images/ja/school-filter.webp"
                alt="同じ学校・学科を除外するプライバシー設定"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-base font-extrabold text-[#191F28]">
                同じ学校・学科の除外とキャラ開始
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#545C68]">
                写真公開に抵抗があるときはキャラクターから始めて、信頼できてから自分のペースで距離を縮められます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section aria-labelledby="ja-pillars" className="mt-14">
        <h2 id="ja-pillars" className="text-2xl font-black tracking-tight text-[#191F28]">
          Sometimeが選ばれる3つの理由
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {JA_HOME_PILLARS.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E6E2DA] bg-white p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBF8F3] ring-1 ring-[#EBE4D8]">
                {PILLAR_ICONS[i]}
              </div>
              <p className="mt-4 text-xs font-extrabold text-[#545C68]">{item.eyebrow}</p>
              <h3 className="mt-1.5 text-base font-extrabold leading-snug text-[#191F28]">
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
      <section aria-labelledby="ja-steps" className="mt-14">
        <h2 id="ja-steps" className="text-2xl font-black tracking-tight text-[#191F28]">
          始め方はシンプル、3ステップ
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {JA_HOME_STEPS.map((s) => (
            <li
              key={s.step}
              className="rounded-2xl border border-[#E6E2DA] bg-[#FBF8F3] p-6"
            >
              <span className="inline-flex h-7 items-center rounded-full bg-[#191F28] px-2.5 text-[11px] font-black text-white">
                STEP {s.step}
              </span>
              <h3 className="mt-3 text-base font-extrabold text-[#191F28]">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#545C68]">{s.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Quick Comparison Preview */}
      <section aria-labelledby="ja-compare-preview" className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="ja-compare-preview" className="text-2xl font-black tracking-tight text-[#191F28]">
            一般的な言語交換アプリとの違い
          </h2>
          <Link
            href="/ja/korean-language-exchange"
            className="text-sm font-bold text-[#191F28] underline underline-offset-4 hover:text-[#545C68]"
          >
            詳しい比較ガイドを読む →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E6E2DA] bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#FBF8F3] text-xs font-extrabold text-[#545C68]">
              <tr>
                <th className="px-4 py-3.5">比較ポイント</th>
                <th className="px-4 py-3.5 text-[#191F28]">Sometime（サムタイム）</th>
                <th className="px-4 py-3.5">一般的な多国籍言語交換アプリ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {JA_EXCHANGE_COMPARISON.map((row) => (
                <tr key={row.item}>
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-[#191F28]">
                    {row.item}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-[#191F28]">{row.sometime}</td>
                  <td className="px-4 py-3.5 text-[#545C68]">{row.generalExchange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Safety 4-Layer Summary */}
      <section aria-labelledby="ja-safety-summary" className="mt-14">
        <h2 id="ja-safety-summary" className="text-2xl font-black tracking-tight text-[#191F28]">
          安心して話すための4つの安全対策
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {JA_SAFETY_CHECKS.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E6E2DA] bg-white p-5"
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#191F28] text-[11px] font-extrabold text-white">
                  {idx + 1}
                </span>
                <h3 className="text-base font-extrabold text-[#191F28]">{item.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#545C68]">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="ja-faq" className="mt-14">
        <h2 id="ja-faq" className="text-2xl font-black tracking-tight text-[#191F28]">
          よくある質問
        </h2>
        <dl className="mt-5 space-y-3">
          {JA_HOME_FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-[#E6E2DA] bg-white p-5"
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
