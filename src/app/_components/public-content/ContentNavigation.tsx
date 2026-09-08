"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/blog", label: "스토리" },
  { href: "/card-news", label: "카드뉴스" },
  { href: "/stories", label: "커뮤니티" },
  { href: "/faq", label: "도움말" },
];

export function ContentNavigation({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="공개 콘텐츠" className={className}>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`) ||
          (item.href === "/stories" && (pathname === "/community" || pathname.startsWith("/community/")));
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className="inline-flex min-h-11 items-center justify-center rounded-xl px-2 text-sm font-semibold text-[#625A68] transition-colors duration-150 hover:bg-[#F4F0FF] hover:text-[#5B35B5] aria-[current=page]:bg-[#F4F0FF] aria-[current=page]:text-[#5B35B5]">
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
