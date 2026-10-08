import Link from "next/link";
import { ContentBreadcrumb } from "./ContentBreadcrumb";
import { PageHeader } from "./PageHeader";
import { READING_BODY, READING_H2, READING_LINK, READING_SHELL } from "./reading-styles";
import { StoreInstallCta } from "./StoreInstallCta";
import type { StoreCtaSurface } from "@/app/_lib/store-links";

export type InfoSection = {
  id: string;
  heading: string;
  body?: string[];
  items?: string[];
};

export type InfoLink = { label: string; href: string; download?: boolean };

type InfoPageBodyProps = {
  badge: string;
  title: string;
  answer: string[];
  sections: InfoSection[];
  links?: InfoLink[];
  breadcrumbLabel: string;
  storeCtaSurface?: StoreCtaSurface;
  storeCtaHeading?: string;
  showMobileSticky?: boolean;
};

/** 공개 안내 페이지(인증/개인정보/가이드라인/프레스) 공용 본문 — /safety 마크업과 동일 패턴 */
export function InfoPageBody({
  badge,
  title,
  answer,
  sections,
  links,
  breadcrumbLabel,
  storeCtaSurface,
  storeCtaHeading,
  showMobileSticky = false,
}: InfoPageBodyProps) {
  return (
    <div className={READING_SHELL}>
      <ContentBreadcrumb
        items={[{ href: "/", label: "홈" }, { label: breadcrumbLabel }]}
      />

      <PageHeader
        eyebrow={badge}
        title={title}
        lead={
          <div className="space-y-2">
            {answer.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        }
      />

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className={`mb-4 ${READING_H2}`}>
              {section.heading}
            </h2>
            {section.body?.map((paragraph) => (
              <p
                key={paragraph}
                className={`mb-4 ${READING_BODY}`}
              >
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="list-disc space-y-2 pl-6">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className={READING_BODY}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {links && links.length > 0 && (
        <section className="mt-12 border-t border-[#EEE8FF] pt-8 sm:mt-14">
          <h2 className="mb-3 text-[15px] font-bold text-[#625A68]">
            바로가기와 관련 안내
          </h2>
          <ul className="grid gap-1 sm:grid-cols-2 sm:gap-x-5">
            {links.map((link) => {
              const className =
                `inline-flex min-h-11 items-center py-2 text-[16px] leading-6 ${READING_LINK}`;

              if (link.download) {
                return (
                  <li key={link.href}>
                    <a href={link.href} download className={className}>
                      {link.label}
                    </a>
                  </li>
                );
              }

              if (link.href.startsWith("/")) {
                return (
                <li key={link.href}>
                  <Link href={link.href} className={className}>
                    {link.label}
                  </Link>
                </li>
                );
              }

              const opensNewTab = link.href.startsWith("http");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={opensNewTab ? "_blank" : undefined}
                    rel={opensNewTab ? "noopener noreferrer" : undefined}
                    className={className}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {storeCtaSurface ? (
        <div className="mt-12 sm:mt-14">
          <StoreInstallCta
            surface={storeCtaSurface}
            heading={storeCtaHeading}
            showMobileSticky={showMobileSticky}
          />
        </div>
      ) : null}
    </div>
  );
}
