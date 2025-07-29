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
    default: "썸타임 - 지역 기반 대학생 AI 맞춤 소개팅 서비스",
    template: "썸타임",
  },
  description:
    "내 주변 대학교 친구들과 안전한 만남! 인공지능이 나에게 딱 맞는 대학생 친구를 찾아드립니다. 100% 대학생 인증, 지역 기반 맞춤 소개팅 서비스.",
  keywords: [
    "대학생 소개팅",
    "지역별 소개팅",
    "AI 매칭",
    "캠퍼스 소개팅",
    "대학생 미팅",
    "대학교 연애",
  ],
  openGraph: {
    title: "썸타임 - 지역 기반 대학생 AI 맞춤 소개팅",
    description:
      "내 주변 대학교 친구들과 안전한 만남! 인공지능이 나에게 딱 맞는 대학생 친구를 찾아드립니다.",
    url: "https://some-in-univ.com/",
    siteName: "썸타임",
    images: [
      {
        url: "https://some-in-univ.com/preview_title.png",
        width: 1200,
        height: 630,
        alt: "썸타임 - 대학생 소개팅 서비스",
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
        <meta
          name="google-site-verification"
          content="zvx72K3s6z5oR8P23QUXqtYP-CjGML5PTs3-B-a058Q"
        />
        <meta
          name="google-site-verification"
          content="ecsgQ3pQGNVL8u-cOqqvNC4jrddHCtnSJR1QhfBex5E"
        />
      </head>
      <body
        className={`${pretendard.variable} ${wnatedSans.variable} antialiased relative`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-VZ7HHRS8QF" />
    </html>
  );
}
