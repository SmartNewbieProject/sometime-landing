"use client";
import Image from "next/image";
import Link from "next/link";
import HeaderButton from "./HeaderButton";
import { deeplinkToApp } from "@/app/_lib/utils";
import { useRouter } from "next/navigation";
import { sendGTMEvent } from "@next/third-parties/google";
import * as amplitude from "@amplitude/analytics-browser";

const contentNav = [
  { href: "/blog", label: "스토리" },
  { href: "/card-news", label: "카드뉴스" },
  { href: "/faq", label: "FAQ" },
] as const;

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#F1ECFA] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[55px] w-full max-w-[960px] items-center justify-between gap-4 px-5">
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <Link href="/" aria-label="썸타임 홈" className="shrink-0">
            <Image
              src={"/images/info-logo.png"}
              width={108}
              height={15}
              alt="썸타임 헤더 로고"
              priority
            />
          </Link>

          <nav
            aria-label="콘텐츠 메뉴"
            className="hidden items-center gap-5 text-[14px] font-semibold leading-[20px] text-[#555] md:flex"
          >
            {contentNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[#7A4AE2]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-[10px] sm:gap-[14px]">
          <HeaderButton
            text="앱으로 이동"
            onClick={() => {
              amplitude.track("Click_App", {
                type: "Desktop",
              });
              sendGTMEvent({ event: "click_app" });

              deeplinkToApp("");
            }}
          />
          <div className="hidden sm:block">
            <HeaderButton
              text="로그인 및 회원가입"
              onClick={() => {
                amplitude.track("Click_Login_Page", { type: "Desktop" });
                sendGTMEvent({ event: "click_login_page" });
                router.push("https://some-in-univ.com/auth/login");
              }}
            />
          </div>
        </div>
      </div>

      {/* 태블릿 이하: 콘텐츠 네비 칩 */}
      <nav
        aria-label="콘텐츠 메뉴"
        className="mx-auto flex w-full max-w-[960px] gap-2 overflow-x-auto px-5 pb-2.5 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {contentNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-[18px] border border-[#EEE8FF] bg-[#FCFAFF] px-3 py-1.5 text-[13px] font-semibold text-[#555] transition hover:border-[#D4C6F5] hover:text-[#7A4AE2]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
