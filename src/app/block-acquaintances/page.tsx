import type { Metadata } from "next";
import { ContentShell } from "../_components/public-content/ContentShell";
import { InfoPageBody } from "../_components/public-content/InfoPageBody";
import { JsonLd } from "../_components/public-content/JsonLd";
import { PublicProofStrip } from "../_components/public-content/PublicProofStrip";
import {
  READING_BODY,
  READING_H2,
  READING_SHELL,
} from "../_components/public-content/reading-styles";
import {
  BLOCK_ACQUAINTANCES_FAQS as FAQS,
  BLOCK_ACQUAINTANCES_PAGE as PAGE,
} from "../_lib/public-info-pages";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  websiteRef,
} from "../_lib/seo";
import { STATIC_SITEMAP_LASTMOD } from "../_lib/sitemap-helpers";

const PATH = "/block-acquaintances";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: PAGE.metaTitle,
  description: PAGE.description,
  path: PATH,
  keywords: PAGE.keywords,
});

export default function BlockAcquaintancesPage() {
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
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
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
      <PublicProofStrip headingId="block-real-proof" />
      <section aria-labelledby="block-faq" className={`${READING_SHELL} pt-0`}>
        <h2 id="block-faq" className={`mb-6 ${READING_H2}`}>
          자주 묻는 질문
        </h2>
        <dl className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.question} className="border-b border-[#EEE8FF] pb-6">
              <dt className="text-lg font-bold text-[#201823]">{faq.question}</dt>
              <dd className={`mt-2 ${READING_BODY}`}>{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </ContentShell>
  );
}
