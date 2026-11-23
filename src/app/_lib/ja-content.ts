import type { Metadata } from "next";
import { SITE_URL } from "./public-content";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_PATH } from "./seo";

export const JA_BASE_URL = `${SITE_URL}/ja`;
export const JA_SITE_NAME = "Sometime（サムタイム）";

export const JA_APP_STORE_URL =
  "https://apps.apple.com/jp/app/id6746120889?ct=ja_public_pages&mt=8";
export const JA_GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.smartnewb.sometimes&hl=ja&referrer=utm_source%3Dorganic_web%26utm_medium%3Dseo%26utm_campaign%3Dja_public_pages";

export type JaFaqItem = {
  question: string;
  answer: string;
};

export type JaFeaturePillar = {
  eyebrow: string;
  title: string;
  description: string;
};

export type JaComparisonRow = {
  item: string;
  sometime: string;
  generalExchange: string;
};

export const JA_HOME_PILLARS: JaFeaturePillar[] = [
  {
    eyebrow: "自動翻訳チャット",
    title: "韓国語が話せなくても、日本語のまま会話できる",
    description:
      "プロフィール・メッセージ・チャットを自動で翻訳。ハングルを勉強中の方や初心者でも、K-POPや韓国旅行、カフェの話題から自然に交流を始められます。",
  },
  {
    eyebrow: "本人確認・身バレ対策",
    title: "大学生・20代の確認済みコミュニティ",
    description:
      "年齢確認・本人確認に加えて、連絡先ベースの知り合いブロックや同じ学校・学科の除外設定に対応。日常のプライバシーを守りながら安心して話せます。",
  },
  {
    eyebrow: "共通の話題から",
    title: "顔写真だけのスワイプではなく、興味と人柄でつながる",
    description:
      "韓国の大学生・20代と、趣味・価値観・好きなコンテンツをきっかけに1対1で会話。プロフィール写真をすぐ公開せずキャラクターから始めることもできます。",
  },
];

export const JA_HOME_STEPS = [
  {
    step: "01",
    title: "プロフィールと興味を登録",
    detail: "K-POP、韓国ドラマ、旅行、韓国語学習など、話したいテーマを選びます。",
  },
  {
    step: "02",
    title: "年齢・本人確認とプライバシー設定",
    detail: "必要に応じて知り合いブロックを設定し、安心できる状態でスタートできます。",
  },
  {
    step: "03",
    title: "自動翻訳チャットで韓国の20代と会話",
    detail: "日本語で送ったメッセージが韓国語に翻訳され、そのまま自然にやり取りできます。",
  },
];

export const JA_HOME_FAQS: JaFaqItem[] = [
  {
    question: "Sometime（サムタイム）はどのようなアプリですか？",
    answer:
      "Sometime（サムタイム）は、日本の大学生・20代と韓国の大学生・20代が、自動翻訳チャットを通じて文化や韓国語の交流から自然につながれる日韓交流コミュニティアプリです。運営会社はSmartNewbie（スマートニュービー）で、iOSとAndroidに対応しています。",
  },
  {
    question: "韓国語がほとんど話せなくても利用できますか？",
    answer:
      "はい。プロフィールやチャットの自動翻訳機能があるため、日本語のまま入力しても相手に韓国語で伝わります。韓国語を勉強しながら実践の場として使う方も多くいます。",
  },
  {
    question: "無料で始められますか？",
    answer:
      "はい、無料でダウンロードして始められます。一部の追加機能やアイテムは有料となっており、利用前にアプリ内で料金と条件をご案内しています。",
  },
  {
    question: "知り合いに見つかる（身バレする）心配はありませんか？",
    answer:
      "連絡先ハッシュを使った知り合いブロック機能や、同じ学校・学科の除外設定に対応しています。また、最初から実物写真を公開せずキャラクターで始めることも可能です。",
  },
  {
    question: "安全対策や年齢確認はありますか？",
    answer:
      "18歳未満の利用を禁止しており、年齢確認・本人確認と通報・ブロック機能、コミュニティガイドラインによる監視体制を運用しています。",
  },
];

export const JA_EXCHANGE_COMPARISON: JaComparisonRow[] = [
  {
    item: "主な利用者層",
    sometime: "韓国・日本の大学生〜20代中心",
    generalExchange: "全年代・多国籍（10代〜50代まで幅広い）",
  },
  {
    item: "会話の始めやすさ",
    sometime: "自動翻訳チャット＋共通の趣味・価値観を先に表示",
    generalExchange: "タイムライン投稿や自分で検索して話しかける形式が多い",
  },
  {
    item: "プライバシー・身バレ対策",
    sometime: "連絡先知り合いブロック・同じ学校除外・キャラ開始対応",
    generalExchange: "公開プロフィール中心で知り合い除外機能がない場合が多い",
  },
  {
    item: "安全性・本人確認",
    sometime: "学校認証（韓国側）・年齢確認・通報ブロック体制",
    generalExchange: "メール登録のみで始められるサービスもあり差が大きい",
  },
];

export const JA_EXCHANGE_FAQS: JaFaqItem[] = [
  {
    question: "韓国語の言語交換アプリを選ぶとき、どこを見るべきですか？",
    answer:
      "同世代（大学生・20代）が多いか、初心者でも会話が続く翻訳サポートがあるか、本人確認や通報・ブロックなどの安全対策が整っているかの3点を確認するのがおすすめです。",
  },
  {
    question: "HelloTalkやTandemとの違いは何ですか？",
    answer:
      "一般的な多国籍の言語交換アプリは世界中の全年代が利用しますが、Sometimeは日韓の大学生・20代に特化しているため、キャンパスライフ・K-POP・カフェ・旅行など同世代で共通の話題が見つかりやすい点が特徴です。",
  },
  {
    question: "翻訳機能を使うと不自然な韓国語になりませんか？",
    answer:
      "日常会話や丁寧な挨拶に合わせて自然に伝わるよう設計されています。また原文と翻訳文を並べて確認できるため、生きた韓国語表現を覚える練習にも役立ちます。",
  },
  {
    question: "まず何から話しかければよいですか？",
    answer:
      "相手のプロフィールに書かれた好きな食べ物・カフェ・音楽・旅行先について一言添えて質問すると、最初の返信につながりやすくなります。",
  },
];

export const JA_SAFETY_CHECKS = [
  {
    title: "年齢確認・本人確認の実施",
    detail:
      "18歳未満の利用を制限し、韓国側の学校認証や本人確認プロセスを通じて、実在する同世代メンバーが安心して交流できる環境を維持しています。",
  },
  {
    title: "知り合いブロック・同じ学校除外",
    detail:
      "連絡先のハッシュ照合で知り合いを非表示にでき、同じ学校・学科のユーザーを除外する設定も用意しています。身近な人への露出リスクを最小限に抑えられます。",
  },
  {
    title: "写真を出さずに始める選択",
    detail:
      "顔写真の公開に抵抗がある場合は、キャラクターアバターで会話を始めることができます。信頼できてから自分のペースで交流を深められます。",
  },
  {
    title: "24時間通報・ブロックとガイドライン運用",
    detail:
      "不快な言動や規約違反があった場合はチャットやプロフィールから即座にブロック・通報が可能で、運営チームが確認のうえ利用制限などの措置を行います。",
  },
];

export const JA_SAFETY_FAQS: JaFaqItem[] = [
  {
    question: "連絡先ブロックを使うと、相手に通知が行きますか？",
    answer:
      "いいえ、通知は一切届きません。連絡先情報はハッシュ化して照合するため、電話番号そのものを外部に公開することなく対象ユーザーのみを非表示にできます。",
  },
  {
    question: "不審なユーザーや勧誘を見つけた場合はどうすればよいですか？",
    answer:
      "プロフィールまたはチャット画面の通報・ブロック機能からすぐにご報告ください。ブロックした相手からはプロフィール閲覧やメッセージ送信ができなくなります。",
  },
  {
    question: "退会するとプロフィールやデータは消えますか？",
    answer:
      "はい、アプリ内の設定からいつでも退会できます。法令で保管が必要な記録を除き、個人情報はプライバシーポリシーに従って適切に処理されます。",
  },
  {
    question: "問い合わせ窓口はどこですか？",
    answer:
      "アプリ内のサポートチャット、またはメール（notify@smartnewb.com）から日本語でお問い合わせいただけます。",
  },
];

export function buildJaMetadata(input: {
  title: string;
  description: string;
  path: string;
  koAlternatePath?: string;
  keywords: string[];
}): Metadata {
  const canonicalUrl = `${SITE_URL}${input.path}`;
  const koUrl =
    input.koAlternatePath && input.koAlternatePath !== "/"
      ? `${SITE_URL}${input.koAlternatePath}`
      : SITE_URL;

  return {
    title: { absolute: input.title },
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ja: canonicalUrl,
        ko: koUrl,
        "x-default": koUrl,
      },
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonicalUrl,
      siteName: JA_SITE_NAME,
      locale: "ja_JP",
      type: "website",
      images: [
        {
          url: `${SITE_URL}${DEFAULT_OG_PATH}`,
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function buildJaLlmsTxt(): string {
  return `# Sometime（サムタイム）— 日韓交流・韓国の友達づくりアプリ

> Sometime（サムタイム）は、日本の大学生・20代と韓国の大学生・20代が、自動翻訳チャットを通じて文化や韓国語の交流から自然につながれる日韓交流コミュニティアプリです。運営会社はSmartNewbie（スマートニュービー）です。iOSとAndroidに対応しています。

- 無料でダウンロードして始められます（一部機能は有料、利用前にアプリ内で案内）。
- 18歳未満は利用できません。年齢確認・本人確認および通報・ブロック体制を運用しています。
- 連絡先ベースの知り合いブロックや同じ学校・学科の除外設定に対応しています。

## 主要ページ（日本語）

- [Sometime（サムタイム）公式トップ](${SITE_URL}/ja): 日韓交流・韓国の友達づくりアプリの概要、3ステップ、よくある質問
- [韓国語の言語交換アプリ比較ガイド](${SITE_URL}/ja/korean-language-exchange): 一般的な言語交換アプリとの違い、自動翻訳チャットの特徴、同世代交流のポイント
- [安全対策・身バレ防止ガイド](${SITE_URL}/ja/safety): 本人確認・年齢確認、連絡先知り合いブロック、通報・ブロック体制

## 公式アプリリンク

- App Store (JP): ${JA_APP_STORE_URL}
- Google Play (JP): ${JA_GOOGLE_PLAY_URL}

## 運営・お問い合わせ

- 運営会社: SmartNewbie（スマートニュービー）
- お問い合わせ: notify@smartnewb.com
- 韓国語公式サイト: ${SITE_URL}
- サイトマップ: ${SITE_URL}/sitemap.xml
`;
}
