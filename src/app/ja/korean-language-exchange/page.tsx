import type { Metadata } from "next";
import Link from "next/link";
import { JaShell, JaStoreCtaBanner } from "../../_components/ja/JaShell";
import { JsonLd } from "../../_components/public-content/JsonLd";
import {
  buildJaMetadata,
  JA_EXCHANGE_COMPARISON,
  JA_EXCHANGE_FAQS,
} from "../../_lib/ja-content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  organizationRef,
  websiteRef,
} from "../../_lib/seo";
import { STATIC_SITEMAP_LASTMOD } from "../../_lib/sitemap-helpers";

const PATH = "/ja/korean-language-exchange";
const TITLE = "韓国語の言語交換アプリ比較｜大学生・20代が安心して話せる選び方 | Sometime";
const DESCRIPTION =
  "韓国語の言語交換アプリを選ぶなら、同世代の多さ・自動翻訳サポート・本人確認と身バレ対策が重要。一般的な言語交換アプリとSometime（サムタイム）の違いを比較表で整理しました。";

export const revalidate = 3600;

export const metadata: Metadata = buildJaMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  koAlternatePath: "/korea-japan-matching",
  keywords: [
    "韓国語 言語交換 アプリ",
    "韓国人 友達 アプリ",
    "日韓交流 アプリ おすすめ",
    "韓国語 翻訳 チャット アプリ",
    "韓国 大学生 友達",
    "Sometime サムタイム",
  ],
});

export default function JaKoreanLanguageExchangePage() {
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
            mainEntity: JA_EXCHANGE_FAQS.map((faq) => ({
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
            { name: "韓国語の言語交換アプリ比較", path: PATH },
          ]),
        ]}
      />

      <nav aria-label="パンくずリスト" className="mb-4 text-xs font-semibold text-[#545C68]">
        <Link href="/ja" className="hover:underline">
          ホーム
        </Link>{" "}
        / <span className="text-[#191F28]">韓国語の言語交換アプリ比較</span>
      </nav>

      <article className="space-y-10">
        <header className="rounded-3xl border border-[#E6E3DC] bg-white p-7 sm:p-9">
          <span className="inline-block rounded-full bg-[#F2F0EC] px-3 py-1 text-xs font-bold text-[#191F28]">
            韓国語・日韓交流ガイド
          </span>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#191F28] sm:text-4xl">
            韓国語の言語交換アプリ、
            <br />
            大学生・20代はどう選ぶ？
          </h1>
          <p className="mt-4 rounded-2xl border border-[#EBE4D8] bg-[#FBF8F3] p-4 text-sm leading-relaxed text-[#191F28]">
            <strong>結論から：</strong>
            韓国語の言語交換アプリで会話が続くかどうかは、
            <strong>①同世代（大学生・20代）の比率、②初心者でも返しやすい自動翻訳、③本人確認と身バレ対策</strong>
            の3つで決まります。
          </p>
        </header>

        <section aria-labelledby="compare-table">
          <h2 id="compare-table" className="text-2xl font-black tracking-tight text-[#191F28]">
            Sometimeと一般的な言語交換アプリの違い
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E6E3DC] bg-white">
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

        <section aria-labelledby="exchange-tips" className="rounded-2xl border border-[#E6E3DC] bg-white p-6 sm:p-8">
          <h2 id="exchange-tips" className="text-xl font-black tracking-tight text-[#191F28]">
            韓国の友達と会話が続く3つのコツ
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#333D4B]">
            <li>
              <strong className="text-[#191F28]">1. 最初から完璧な韓国語を目指さない：</strong>
              自動翻訳で日本語のまま思いを伝え、返ってきた韓国語表現をメモする形が長続きします。
            </li>
            <li>
              <strong className="text-[#191F28]">2. 日常の小さな共通点から始める：</strong>
              「最近行ったカフェ」「好きな韓国料理」「旅行で行ってみたい場所」など、答えやすい話題が効果的です。
            </li>
            <li>
              <strong className="text-[#191F28]">3. 安全設定を先に整える：</strong>
              知り合いブロックや通報機能がある環境を選んでおくと、安心して会話に集中できます（詳細は
              <Link href="/ja/safety" className="font-bold text-[#191F28] underline underline-offset-4">
                安全・身バレ対策ガイド
              </Link>
              ）。
            </li>
          </ul>
        </section>

        <section aria-labelledby="exchange-faq">
          <h2 id="exchange-faq" className="text-2xl font-black tracking-tight text-[#191F28]">
            よくある質問
          </h2>
          <dl className="mt-4 space-y-3">
            {JA_EXCHANGE_FAQS.map((faq) => (
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
          title="同世代の韓国の友達と、日本語のまま会話してみる"
          description="Sometimeなら、翻訳付きチャットで韓国語初心者でも安心して日韓交流を始められます。"
        />
      </article>
    </JaShell>
  );
}
