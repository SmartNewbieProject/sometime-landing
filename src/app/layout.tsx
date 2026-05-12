import "./globals.css";
import localFont from "next/font/local";
import { Nanum_Pen_Script } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { AmplitudeProvider } from "./_components/AmplitudeProvider";

const SITE_URL = "https://info.some-in-univ.com";
const SITE_TITLE =
  "썸타임 - 대학생 소개팅 앱 | 학교 인증 캠퍼스 매칭";
const SITE_DESCRIPTION =
  "학교 인증을 기반으로 같은 지역, 인접 대학의 대학생을 연결하는 캠퍼스 소개팅 앱 썸타임. 안전한 대학생 소개팅, 캠퍼스 매칭, 매주 목/일 무료 매칭을 확인해보세요.";
const pretendard = localFont({
  src: "../font/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

const wnatedSans = localFont({
  src: "../font/WantedSansVariable.woff2",
  variable: "--font-wantedSans",
  display: "swap",
});

const nanumPenScript = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nanum-pen",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | 썸타임",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "대학생 소개팅 앱",
    "대학생 소개팅 앱 추천",
    "학교 인증 소개팅",
    "캠퍼스 소개팅",
    "캠퍼스 매칭",
    "안전한 소개팅 앱",
    "대학생 연애",
    "AI 취향 분석 매칭",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "썸타임",
    images: [
      {
        url: "/images/preview_title.png",
        width: 1200,
        height: 630,
        alt: "썸타임 대학생 소개팅 앱",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/preview_title.png"],
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

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "썸타임",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android, Web",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/images/preview_title.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "썸타임은 대학생만 이용할 수 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "썸타임은 대학생의 안전한 만남을 위해 학교 인증을 중요한 기준으로 사용합니다. 진짜 대학생끼리 더 자연스럽게 대화하고 만날 수 있도록 설계했습니다.",
        },
      },
      {
        "@type": "Question",
        name: "학교 인증 소개팅이 왜 중요한가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "학교 인증은 낯선 만남의 불안을 줄이고, 같은 생활권과 캠퍼스 문화를 공유하는 사람과 연결될 가능성을 높입니다.",
        },
      },
      {
        "@type": "Question",
        name: "캠퍼스 매칭은 일반 소개팅 앱과 무엇이 다른가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "캠퍼스 매칭은 단순히 많은 사람을 보여주는 방식이 아니라 같은 지역, 인접 대학, 실제 만남 가능한 생활권을 고려해 대학생에게 맞는 연결을 돕습니다.",
        },
      },
      {
        "@type": "Question",
        name: "썸타임은 무료로 매칭을 받을 수 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "썸타임은 매주 목요일과 일요일 무료 매칭을 제공해 대학생이 부담 없이 소개팅을 시작할 수 있도록 돕습니다.",
        },
      },
      {
        "@type": "Question",
        name: "대학생 소개팅 앱은 어떤 기준으로 골라야 하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "학교 인증 여부, 실제 만남 가능한 생활권, 프로필 검수와 신고 대응, 부담 없는 매칭 구조를 함께 확인하는 것이 좋습니다.",
        },
      },
      {
        "@type": "Question",
        name: "과팅과 소개팅 앱 중 무엇이 더 잘 맞나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "과팅은 친구들과 함께 시작하기 좋고, 소개팅 앱은 내 일정과 취향에 맞춰 천천히 알아가기 좋습니다. 대학생이라면 학교 인증과 생활권 매칭이 있는 앱을 고르는 것이 중요합니다.",
        },
      },
      {
        "@type": "Question",
        name: "지방 대학생도 소개팅 앱에서 만날 수 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "가능합니다. 전국 단위로 사람만 많이 보여주는 앱보다 같은 지역과 인접 대학 생활권을 함께 보는 서비스가 실제 만남으로 이어질 가능성이 높습니다.",
        },
      },
      {
        "@type": "Question",
        name: "무료 대학생 소개팅 앱도 괜찮나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "무료 여부보다 학교 인증, 운영 검수, 신고 대응, 매칭 품질을 먼저 확인하는 것이 좋습니다. 썸타임은 무료 매칭으로 시작 부담을 낮추고 있습니다.",
        },
      },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="google-site-verification"
          content="zvx72K3s6z5oR8P23QUXqtYP-CjGML5PTs3-B-a058Q"
        />
        <meta
          name="google-site-verification"
          content="ecsgQ3pQGNVL8u-cOqqvNC4jrddHCtnSJR1QhfBex5E"
        />
        <meta
          name="google-site-verification"
          content="mMaF6ssWvuNzoDifNcxgtIBL4PsHrTdsTJdsRRGBOy4"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '1573718343258587');
                  fbq('track', 'PageView');
                } catch (error) {
                  console.warn('Facebook Pixel could not be loaded:', error);
                }
              })();
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1573718343258587&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${pretendard.variable} ${wnatedSans.variable} ${nanumPenScript.variable} antialiased relative`}
      >
        {children}
      </body>

      <GoogleAnalytics gaId="G-VZ7HHRS8QF" />
      <AmplitudeProvider />
    </html>
  );
}
