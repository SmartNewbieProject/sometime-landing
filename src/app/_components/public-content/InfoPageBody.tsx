import Link from "next/link";
import { ContentBreadcrumb } from "./ContentBreadcrumb";

export type InfoSection = {
  id: string;
  heading: string;
  body?: string[];
  items?: string[];
};

export type InfoLink = { label: string; href: string };

type InfoPageBodyProps = {
  badge: string;
  title: string;
  answer: string[];
  sections: InfoSection[];
  links?: InfoLink[];
  breadcrumbLabel: string;
};

/** 공개 안내 페이지(인증/개인정보/가이드라인/프레스) 공용 본문 — /safety 마크업과 동일 패턴 */
export function InfoPageBody({
  badge,
  title,
  answer,
  sections,
  links,
  breadcrumbLabel,
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
        <section className="mt-14 rounded-2xl bg-neutral-50 p-6">
          <h2 className="mb-3 font-wantedSans text-[18px] font-bold text-black">
            함께 보면 좋은 문서
          </h2>
          <ul className="space-y-2">
            {links.map((link) =>
              link.href.startsWith("/") ? (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] font-medium text-[#7A4AE2] underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-medium text-[#7A4AE2] underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
