import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ContentNavigation } from "./ContentNavigation";

const footerLinks = [
  {
    label: "서비스 이용약관",
    href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba1805dbafbc9426a0aaa80",
  },
  {
    label: "개인정보처리방침",
    href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba180a3a4bbdf9301683145",
  },
];

const helpLinks = [
  { href: "/faq", label: "도움말" },
  { href: "/safety", label: "안전 가이드" },
  { href: "/verification", label: "학교 인증" },
  { href: "/privacy/easy", label: "개인정보 안내" },
  { href: "/community-guidelines", label: "커뮤니티 가이드" },
  { href: "/about", label: "서비스 소개" },
  { href: "/press", label: "보도자료" },
];

export function ContentShell({ children }: { children: ReactNode }) {
  return (
    <div className="public-content-shell min-h-screen min-w-0 w-full bg-white font-pretendard text-[#201823]">
      <a href="#public-main" className="public-skip-link">본문 바로가기</a>
      <header className="top-0 z-20 border-b border-[#F1ECFA] bg-white sm:sticky">
        <div className="mx-auto flex min-h-16 w-full max-w-[900px] items-center justify-between gap-3 px-5 sm:px-8">
          <Link href="/" aria-label="썸타임 홈" className="inline-flex min-h-11 shrink-0 items-center rounded-xl">
            <Image src="/images/info-logo.png" width={108} height={15} alt="썸타임" priority />
          </Link>
          <ContentNavigation className="hidden items-center gap-2 sm:flex" />
          <Link href="/download" className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-[#7A4AE2] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#5B35B5]">
            앱 다운로드
          </Link>
        </div>
        <ContentNavigation className="mx-auto grid w-full max-w-[900px] grid-cols-4 gap-1 px-5 pb-2 sm:hidden" />
      </header>

      <main id="public-main" tabIndex={-1} className="min-w-0">{children}</main>

      <footer className="border-t border-[#F1ECFA] bg-[#FCFAFF] px-5 sm:px-8">
        <div className="mx-auto max-w-[836px] py-8">
          <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
            <nav aria-label="도움말과 서비스 안내">
              <p className="mb-2 text-base font-bold text-[#201823]">썸타임 안내</p>
              <ul className="grid grid-cols-2 gap-x-4 text-sm font-medium text-[#5B35B5]">
                {helpLinks.map((link) => (
                  <li key={link.href}><Link href={link.href} className="inline-flex min-h-11 items-center py-2 underline-offset-4 hover:underline">{link.label}</Link></li>
                ))}
              </ul>
            </nav>
            <nav aria-label="전체 약관 및 개인정보 문서">
              <p className="mb-2 text-base font-bold text-[#201823]">약관 및 정책 전문</p>
              <ul className="text-sm font-medium text-[#5B35B5]">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 py-2 underline underline-offset-4">
                      {link.label}<span className="sr-only"> (새 탭)</span><span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-6 border-t border-[#EEE8FF] pt-5 text-sm leading-6 text-[#625A68]">
            <p>스마트뉴비 · 대표 전준영 · 사업자등록번호 498-05-02914</p>
            <p>대전광역시 유성구 동서대로 125, S9동 한밭인큐베이터타운 405호</p>
            <p>통신판매업신고 제2026-대전유성-0328호</p>
            <a href="mailto:notify@smartnewb.com" className="inline-flex min-h-11 items-center text-[#5B35B5] underline underline-offset-4">문의 notify@smartnewb.com</a>
          </div>
        </div>
      </footer>
    </div>
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
