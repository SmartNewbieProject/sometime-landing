import type { Metadata } from "next";
import { ContentShell } from "../_components/public-content/ContentShell";
import { InfoPageBody } from "../_components/public-content/InfoPageBody";
import { JsonLd } from "../_components/public-content/JsonLd";
import { COLLEGE_MEETING_PAGE as PAGE } from "../_lib/public-info-pages";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  websiteRef,
} from "../_lib/seo";
import { STATIC_SITEMAP_LASTMOD } from "../_lib/sitemap-helpers";

const PATH = "/college-meeting";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE.metaTitle,
  description: PAGE.description,
  path: PATH,
  keywords: PAGE.keywords,
});

export default function CollegeMeetingPage() {
  return (
    <ContentShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${absoluteUrl(PATH)}#webpage`,
            name: PAGE.metaTitle,
            description: PAGE.description,
            url: absoluteUrl(PATH),
            dateModified: STATIC_SITEMAP_LASTMOD[PATH].slice(0, 10),
            inLanguage: "ko-KR",
            isPartOf: websiteRef(),
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
        storeCtaSurface="landing_public_guide"
        showMobileSticky
      />
    </ContentShell>
  );
}
