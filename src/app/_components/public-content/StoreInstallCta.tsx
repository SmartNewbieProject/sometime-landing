"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { openStoreCtaInNewTab } from "@/app/_lib/store-cta-tracking";
import { buildStoreUrl, type Store, type StoreCtaSurface } from "@/app/_lib/store-links";

type Props = {
  surface: StoreCtaSurface;
  contentKey?: string;
  heading?: string;
  description?: string;
  compact?: boolean;
  /** 모바일 하단 1-tap 스토어 고정 바 노출 여부. */
  showMobileSticky?: boolean;
};

const storeCopy = {
  ios: { label: "App Store에서 썸타임 다운로드", image: "/images/big-app-store.png" },
  android: { label: "Google Play에서 썸타임 다운로드", image: "/images/big-google-play.png" },
} as const;

export function StoreBadge({
  store,
  surface,
  contentKey,
}: {
  store: Store;
  surface: StoreCtaSurface;
  contentKey?: string;
}) {
  const copy = storeCopy[store];
  return (
    <a
      href={buildStoreUrl({ store, surface, contentKey })}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={copy.label}
      onClick={(event) => openStoreCtaInNewTab(event, { store, surface, contentKey })}
      className="inline-flex min-h-11 items-center overflow-hidden rounded-xl border border-[#E5E8EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] transition hover:-translate-y-0.5 hover:border-[#D0D5DD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A4AE2]"
    >
      <Image src={copy.image} width={196} height={60} alt={copy.label} className="h-auto w-[168px] sm:w-[196px]" />
    </a>
  );
}

export function StoreInstallCta({
  surface,
  contentKey,
  heading = "공식 스토어에서 썸타임을 시작하세요",
  description = "학교 인증 대학생 소개팅 앱 썸타임을 iPhone과 Android에서 무료로 설치할 수 있어요.",
  compact = false,
  showMobileSticky = false,
}: Props) {
  return (
    <>
      <section
        aria-labelledby={`store-cta-${surface}`}
        className={
          compact
            ? "rounded-2xl border border-[#E5E8EB] bg-white p-5 sm:p-6"
            : "rounded-[24px] border border-[#E5E8EB] bg-white px-5 py-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:px-8 sm:py-10"
        }
      >
        <p className="text-[12px] font-bold tracking-[0.14em] text-[#4E5968]">OFFICIAL APP</p>
        <h2 id={`store-cta-${surface}`} className="mt-2 text-[22px] font-black leading-[1.35] text-[#191F28] sm:text-[26px]">{heading}</h2>
        <p className={compact ? "mt-2 text-[15px] font-medium leading-6 text-[#4E5968]" : "mx-auto mt-3 max-w-xl text-[15px] font-medium leading-6 text-[#4E5968]"}>{description}</p>
        <div className={compact ? "mt-5 flex flex-col flex-wrap items-start gap-3 min-[390px]:flex-row min-[390px]:items-center" : "mt-6 flex flex-col flex-wrap items-center justify-center gap-3 min-[390px]:flex-row"}>
          <StoreBadge store="ios" surface={surface} contentKey={contentKey} />
          <StoreBadge store="android" surface={surface} contentKey={contentKey} />
        </div>
        <p className="mt-4 text-[12px] font-medium text-[#6B7684]">스마트뉴비가 만든 썸타임 공식 앱이에요.</p>
      </section>
      {showMobileSticky ? <MobileStoreInstallBar contentKey={contentKey} /> : null}
    </>
  );
}

function MobileStoreInstallBar({ contentKey }: { contentKey?: string }) {
  const [store, setStore] = useState<Store>("ios");

  useEffect(() => {
    if (typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)) {
      setStore("android");
    }
  }, []);

  const surface: StoreCtaSurface = "landing_content_sticky";
  const href = buildStoreUrl({ store, surface, contentKey });
  const label = store === "android" ? "Google Play 설치" : "App Store 설치";

  return (
    <aside
      data-mobile-store-sticky
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E8EB] bg-white/95 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden"
      aria-label="썸타임 앱 설치"
    >
      <div className="mx-auto flex max-w-[728px] items-center gap-3">
        <Image src="/images/logo.png" width={40} height={40} alt="" className="h-10 w-10 shrink-0 rounded-[11px]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-black text-[#191F28]">썸타임 공식 앱</p>
          <p className="truncate text-[12px] font-medium text-[#4E5968]">학교 인증 · 같은 학과 제외</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => openStoreCtaInNewTab(event, { store, surface, contentKey })}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#7A4AE2] px-4 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#5B35B5]"
        >
          {label}
        </a>
      </div>
    </aside>
  );
}
