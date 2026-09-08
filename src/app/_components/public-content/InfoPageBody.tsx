import Link from "next/link";
import { ContentBreadcrumb } from "./ContentBreadcrumb";
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
    <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 sm:pt-16">
      <ContentBreadcrumb
        items={[{ href: "/", label: "홈" }, { label: breadcrumbLabel }]}
      />

      <header className="mb-12">
        <p className="mb-3 text-[14px] font-semibold tracking-wide text-[#7A4AE2]">
          {badge}
        </p>
        <h1 className="font-wantedSans text-[34px] font-bold leading-[46px] text-black sm:text-[40px] sm:leading-[52px]">
          {title}
        </h1>
        <div className="mt-5 space-y-2">
          {answer.map((line) => (
            <p
              key={line}
              className="text-[16px] leading-[26px] text-neutral-600"
            >
              {line}
            </p>
          ))}
        </div>
      </header>

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="mb-4 font-wantedSans text-[22px] font-bold leading-[32px] text-black sm:text-[24px]">
              {section.heading}
            </h2>
            {section.body?.map((paragraph) => (
              <p
                key={paragraph}
                className="mb-3 text-[16px] leading-[26px] text-neutral-700"
              >
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="list-disc space-y-2 pl-5">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-[15px] leading-[24px] text-neutral-700"
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
        <section className="mt-12 rounded-2xl bg-neutral-50 p-5 sm:mt-14 sm:p-6">
          <h2 className="mb-3 font-wantedSans text-[18px] font-bold text-black">
            바로가기와 관련 안내
          </h2>
          <ul className="grid gap-1 sm:grid-cols-2 sm:gap-x-5">
            {links.map((link) => {
              const className =
                "inline-flex min-h-11 items-center py-2 text-[15px] font-medium leading-6 text-[#7A4AE2] underline underline-offset-4";

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
