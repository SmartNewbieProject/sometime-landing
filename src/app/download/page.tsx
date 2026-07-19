import type { Metadata } from "next";
import { ContentShell } from "../_components/public-content/ContentShell";
import { InfoPageBody } from "../_components/public-content/InfoPageBody";
import { JsonLd } from "../_components/public-content/JsonLd";
import { DOWNLOAD_PAGE as PAGE } from "../_lib/public-info-pages";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  SITE_NAME,
} from "../_lib/seo";

const PATH = "/download";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE.metaTitle,
  description: PAGE.description,
  path: PATH,
  keywords: PAGE.keywords,
});

export default function DownloadPage() {
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
        ]}
      />
      <InfoPageBody
        badge={PAGE.badge}
        title={PAGE.title}
        answer={PAGE.answer}
        sections={PAGE.sections}
        links={PAGE.links}
        breadcrumbLabel={PAGE.breadcrumbLabel}
      />
    </ContentShell>
  );
}
