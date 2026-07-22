"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { openStoreCtaInNewTab } from "@/app/_lib/store-cta-tracking";
import { buildStoreUrl, type Store, type StoreCtaSurface } from "@/app/_lib/store-links";

type Props = {
  surface: StoreCtaSurface;
  heading?: string;
  description?: string;
  compact?: boolean;
  showMobileSticky?: boolean;
};

const storeCopy = {
  ios: { label: "App Store에서 썸타임 다운로드", image: "/images/big-app-store.png" },
  android: { label: "Google Play에서 썸타임 다운로드", image: "/images/big-google-play.png" },
} as const;

function StoreBadge({ store, surface }: { store: Store; surface: StoreCtaSurface }) {
  const copy = storeCopy[store];
  return (
    <a
      href={buildStoreUrl({ store, surface })}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={copy.label}
      onClick={(event) => openStoreCtaInNewTab(event, { store, surface })}
      className="inline-flex min-h-11 items-center rounded-xl transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A4AE2]"
    >
      <Image src={copy.image} width={196} height={60} alt={copy.label} className="h-auto w-[168px] sm:w-[196px]" />
    </a>
  );
}

export function StoreInstallCta({
  surface,
  heading = "공식 스토어에서 썸타임을 시작하세요",
  description = "학교 인증 대학생 소개팅 앱 썸타임을 iPhone과 Android에서 무료로 설치할 수 있어요.",
  compact = false,
  showMobileSticky = false,
}: Props) {
  return (
    <>
      <section
        aria-labelledby={`store-cta-${surface}`}
        className={compact ? "rounded-[24px] border border-[#EEE8FF] bg-[#FCFAFF] p-5 sm:p-6" : "rounded-[28px] border border-[#E9E1F8] bg-[#FCFAFF] px-5 py-8 text-center sm:px-8 sm:py-10"}
      >
        <p className="text-[12px] font-bold tracking-[0.14em] text-[#6B6472]">OFFICIAL APP</p>
        <h2 id={`store-cta-${surface}`} className="mt-2 text-[22px] font-black leading-[1.35] text-[#201823] sm:text-[26px]">{heading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] font-medium leading-6 text-[#625A68]">{description}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 min-[390px]:flex-row">
          <StoreBadge store="ios" surface={surface} />
          <StoreBadge store="android" surface={surface} />
        </div>
        <p className="mt-4 text-[12px] font-medium text-[#7B7380]">스마트뉴비가 운영하는 썸타임 공식 앱입니다.</p>
      </section>
      {showMobileSticky ? <MobileStoreInstallBar /> : null}
    </>
  );
}

function MobileStoreInstallBar() {
  const [store, setStore] = useState<Store>("android");
  const [visible, setVisible] = useState(true);
  const surface: StoreCtaSurface = "landing_content_sticky";

  useEffect(() => {
    if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) setStore("ios");
  }, []);

  if (!visible) return null;
  return (
    <aside className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 flex items-center gap-3 rounded-[18px] border border-[#E7DDF7] bg-white/95 p-3 shadow-[0_10px_35px_rgba(49,31,72,0.2)] backdrop-blur sm:hidden" aria-label="썸타임 앱 설치">
      <Image src="/images/logo.png" width={42} height={42} alt="" className="h-10 w-10 rounded-[11px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-black text-[#201823]">썸타임 공식 앱</p>
        <p className="truncate text-[12px] font-medium text-[#6B6472]">대학생 인증 소개팅 시작하기</p>
      </div>
      <a href={buildStoreUrl({ store, surface })} target="_blank" rel="noopener noreferrer" onClick={(event) => openStoreCtaInNewTab(event, { store, surface })} className="inline-flex min-h-11 items-center rounded-[12px] bg-[#7A4AE2] px-4 text-[13px] font-bold text-white">설치하기</a>
      <button type="button" onClick={() => setVisible(false)} aria-label="설치 안내 닫기" className="min-h-11 min-w-7 text-[20px] text-[#777]">×</button>
    </aside>
  );
}
