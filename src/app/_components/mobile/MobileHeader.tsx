"use client";

import Image from "next/image";
import Link from "next/link";

const contentNav = [
  { href: "/blog", label: "스토리" },
  { href: "/card-news", label: "카드뉴스" },
  { href: "/faq", label: "FAQ" },
] as const;

/** 모바일 랜딩 상단 — 콘텐츠 페이지로 이동하는 네비 */
export default function MobileHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[60] border-b border-[#F1ECFA] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[48px] max-w-[440px] items-center justify-between px-4">
        <Link href="/" aria-label="썸타임 홈" className="shrink-0">
          <Image
            src="/images/info-logo.png"
            width={96}
            height={14}
            alt="썸타임"
            priority
          />
        </Link>
        <Link
          href="https://some-in-univ.com"
          className="rounded-[30px] bg-[#7A4AE2] px-3 py-1.5 text-[12px] font-semibold text-white"
        >
          앱으로 이동
        </Link>
      </div>
      <nav
        aria-label="콘텐츠 메뉴"
        className="mx-auto flex max-w-[440px] gap-2 overflow-x-auto px-4 pb-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {contentNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-[18px] border border-[#EEE8FF] bg-[#FCFAFF] px-3 py-1.5 text-[12px] font-semibold text-[#555]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
