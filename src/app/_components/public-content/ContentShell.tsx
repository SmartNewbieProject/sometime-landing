import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/blog", label: "스토리" },
  { href: "/card-news", label: "카드뉴스" },
  { href: "/faq", label: "FAQ" },
];

const footerLinks = [
  {
    label: "서비스 이용약관",
    href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba1805dbafbc9426a0aaa80",
  },
  {
    label: "개인정보처리방침",
    href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba180a3a4bbdf9301683145",
  },
  {
    label: "개인정보 수집 및 이용동의",
    href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba180a3a4bbdf9301683145?pvs=7",
  },
];

export function ContentShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white font-wantedSans text-black">
      <header className="sticky top-0 z-20 border-b border-[#F1ECFA] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] w-full max-w-[900px] items-center justify-between px-5">
          <Link href="/" aria-label="썸타임 홈">
            <Image
              src="/images/info-logo.png"
              width={108}
              height={15}
              alt="썸타임"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-[22px] text-[14px] font-semibold leading-[20px] text-[#555] sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[#7A4AE2]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="https://some-in-univ.com"
            className="hidden rounded-[30px] bg-[#7A4AE2] px-[20px] py-[10px] text-[14px] font-semibold text-white sm:inline-flex"
          >
            앱으로 이동
          </Link>
        </div>
        <nav className="mx-auto flex w-full max-w-[900px] gap-2 overflow-x-auto px-5 pb-3 text-[13px] font-semibold text-[#555] sm:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-[18px] border border-[#EEE8FF] bg-[#FCFAFF] px-3 py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {children}

      <footer className="border-t border-[#F1ECFA] bg-white px-[24px]">
        <div className="mx-auto max-w-[900px] py-[72px]">
          <div className="flex flex-col gap-[28px] sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Image
                src="/images/info-logo.png"
                width={132}
                height={19}
                alt="썸타임"
              />
              <p className="mt-[14px] text-[14px] font-medium leading-[24px] text-[#AD91EA]">
                진심 어린 만남의 시작,
                <br />
                지금 썸타임과 함께하세요
              </p>
            </div>
            <div className="flex flex-col gap-[8px] text-[14px] font-medium leading-[24px] text-[#7A4AE2] underline underline-offset-4">
              {footerLinks.map((link) => (
                <Link key={link.label} href={link.href} target="_blank">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-[54px] border-t border-[#F1ECFA] pt-[32px] text-[13px] font-medium leading-[24px] text-[#8D82A8]">
            <p>상호명 ㅣ 스마트뉴비</p>
            <p>사업자 등록 번호 ㅣ 498-05-02914</p>
            <p>사업장 소재지 ㅣ 대전광역시 유성구 동서대로 125, 한밭인큐베이터타운 405호</p>
            <p>대표 ㅣ 전준영</p>
            <p>문의 메일 ㅣ notify@smartnewb.com</p>
            <p>통신판매업신고 ㅣ 제 2025-대전유성-0530호</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export function ContentHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-16 sm:pb-16 sm:pt-24">
      <div className="max-w-3xl">
        <p className="mb-4 inline-flex rounded-full border border-[#eadcf5] bg-white/70 px-4 py-2 text-sm font-black text-[#7a4bea] shadow-sm">
          {eyebrow}
        </p>
        <h1 className="font-wantedSans text-4xl font-black leading-tight tracking-tight text-[#201823] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f5567]">{description}</p>
      </div>
      {children ? <div className="mt-10">{children}</div> : null}
    </section>
  );
}
