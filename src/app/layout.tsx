import "./globals.css";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AmplitudeProvider } from "./_components/AmplitudeProvider";
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
      </head>
      <body
        className={`${pretendard.variable} ${wnatedSans.variable} antialiased relative`}
      >
        {children}
      </body>

      <GoogleAnalytics gaId="G-VZ7HHRS8QF" />
      <AmplitudeProvider />
    </html>
  );
}
