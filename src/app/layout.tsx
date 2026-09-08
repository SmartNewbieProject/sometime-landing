import "./globals.css";
import localFont from "next/font/local";
import { Nanum_Pen_Script } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { AmplitudeProvider } from "./_components/AmplitudeProvider";
import { MixpanelProvider } from "./_components/MixpanelProvider";
import { SITE_URL } from "./_lib/public-content";
import {
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_PATH,
  organizationJsonLd,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "./_lib/seo";

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
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  itunes: {
    appId: "6746120889",
    appArgument: `${SITE_URL}/download`,
  },
  category: "dating",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_PATH,
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

const structuredData = [
  organizationJsonLd(),
  websiteJsonLd(),
  softwareApplicationJsonLd(),
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
          name="naver-site-verification"
          content="9f59dcb2b819645b004de71dd164d5c7f378d971"
        />
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
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
                  },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
                  a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
                  twq('config','qxdc3');
                } catch (error) {
                  console.warn('X Pixel could not be loaded:', error);
                }
              })();
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${pretendard.variable} ${wnatedSans.variable} ${nanumPenScript.variable} antialiased relative`}
      >
        <MixpanelProvider />
        {children}
      </body>

      <GoogleAnalytics gaId="G-VZ7HHRS8QF" />
      <AmplitudeProvider />
    </html>
  );
}
