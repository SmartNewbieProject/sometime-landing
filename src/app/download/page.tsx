import type { Metadata } from "next";
import { ContentShell } from "../_components/public-content/ContentShell";
import { InfoPageBody } from "../_components/public-content/InfoPageBody";
import { JsonLd } from "../_components/public-content/JsonLd";
import { DOWNLOAD_PAGE as PAGE } from "../_lib/public-info-pages";
import { getAppStoreRating } from "../_lib/app-store-rating";
import { DesktopDownloadQrSection } from "./DesktopDownloadQrSection";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  SITE_NAME,
  softwareApplicationJsonLd,
} from "../_lib/seo";

const PATH = "/download";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE.metaTitle,
  description: PAGE.description,
  path: PATH,
  keywords: PAGE.keywords,
});

export default async function DownloadPage() {
  const appStoreRating = await getAppStoreRating();

  return (
    <ContentShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: PAGE.metaTitle,
            description: PAGE.description,
            url: absoluteUrl(PATH),
            inLanguage: "ko-KR",
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: absoluteUrl("/"),
            },
          },
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: PAGE.breadcrumbLabel, path: PATH },
          ]),
          softwareApplicationJsonLd(
            appStoreRating
              ? {
                  ratingValue: appStoreRating.ratingValue,
                  ratingCount: appStoreRating.ratingCount,
                }
              : undefined,
          ),
        ]}
      />
      <InfoPageBody
        badge={PAGE.badge}
        title={PAGE.title}
        answer={PAGE.answer}
        sections={PAGE.sections}
        links={PAGE.links}
        breadcrumbLabel={PAGE.breadcrumbLabel}
        storeCtaSurface="landing_download_hub"
        storeCtaHeading="썸타임 공식 앱 다운로드"
      />
      <div className="mx-auto w-full max-w-4xl px-5 pb-20">
        {appStoreRating ? (
          <p className="mb-4 text-center text-sm font-semibold text-[#625A68]">
            App Store 평점 {appStoreRating.ratingValue.toFixed(1)} / 5 · 평가{" "}
            {appStoreRating.ratingCount.toLocaleString("ko-KR")}개 · 최신 버전{" "}
            {appStoreRating.version}
          </p>
        ) : null}
        <DesktopDownloadQrSection />
      </div>
    </ContentShell>
  );
}
