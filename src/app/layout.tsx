import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";

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
export const metadata = {
  title: {
    default: "썸타임 - 동네 대학생 연애 트렌드의 중심, 우리 지역 캠퍼스 소개팅",
    template: "썸타임",
  },
  description:
    "지금 우리 동네 대학생들 사이에서 가장 인기있는 연애 트렌드! 같은 지역 캠퍼스 친구들과의 안전하고 검증된 특별한 만남이 썸타임에서 시작됩니다.",
  keywords: [
    "동네 대학생 연애 트렌드",
    "지역 대학생 연애 중심",
    "캠퍼스 연애 트렌드",
    "우리 지역 대학생 소개팅",
    "동네 대학교 연애 문화, 썸타임",
  ],
  openGraph: {
    title: "썸타임 - 동네 대학생 연애 트렌드의 중심, 우리 지역 캠퍼스 소개팅",
    description:
      "지금 우리 동네 대학생들 사이에서 가장 인기있는 연애 트렌드! 같은 지역 캠퍼스 친구들과의 안전하고 검증된 특별한 만남을 시작하세요.",
    url: "https://some-in-univ.com/",
    siteName: "썸타임",
    images: [
      {
        url: "https://info.some-in-univ.com/images/logo.png",
        width: 140,
        height: 140,
        alt: "썸타임 - 동네 대학생 연애 트렌드 중심 캠퍼스 소개팅 서비스",
      },
    ],
    locale: "ko_KR",
    type: "website",
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="zvx72K3s6z5oR8P23QUXqtYP-CjGML5PTs3-B-a058Q" />
        <meta name="google-site-verification" content="ecsgQ3pQGNVL8u-cOqqvNC4jrddHCtnSJR1QhfBex5E" />
        <meta name="google-site-verification" content="mMaF6ssWvuNzoDifNcxgtIBL4PsHrTdsTJdsRRGBOy4" />
      </head>
      <body className={`${pretendard.variable} ${wnatedSans.variable} antialiased relative`}>{children}</body>
      <GoogleAnalytics gaId="G-VZ7HHRS8QF" />
    </html>
  );
}
