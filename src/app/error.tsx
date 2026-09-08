"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PublicPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public page render failed", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FCFAFF] px-5 py-16">
      <section
        aria-labelledby="public-error-title"
        className="w-full max-w-lg rounded-3xl border border-[#EEE8FF] bg-white p-8 text-center shadow-sm"
        role="alert"
      >
        <p className="text-sm font-bold text-[#7A4AE2]">일시적인 오류</p>
        <h1
          id="public-error-title"
          className="mt-3 font-wantedSans text-3xl font-black text-[#201823]"
        >
          콘텐츠를 불러오지 못했어요
        </h1>
        <p className="mt-4 leading-7 text-[#625A68]">
          잠시 후 다시 시도해 주세요. 문제가 계속되면 홈에서 다른 콘텐츠를 확인할 수 있어요.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7A4AE2] px-6 font-bold text-white hover:bg-[#5B35B5]"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DCCFF7] px-6 font-bold text-[#5B35B5] hover:bg-[#F7F2FF]"
          >
            홈으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}
