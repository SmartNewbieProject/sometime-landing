"use client";

import { useState } from "react";

type Status = "idle" | "copied" | "failed";

/** 현재 주소를 클립보드에 복사한다. 결과는 스크린리더에도 알린다. */
export function CopyLinkButton() {
  const [status, setStatus] = useState<Status>("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
    } catch (error) {
      console.error("Copying the article link failed", error);
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[#625A68] transition-colors duration-150 hover:bg-[#F4F0FF] hover:text-[#5B35B5]"
      >
        <span className="sr-only">이 글 링크 복사</span>
        {status === "copied" ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.4" /><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.33-1.3" /></svg>
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" ? "링크를 복사했어요." : status === "failed" ? "링크를 복사하지 못했어요." : ""}
      </span>
    </>
  );
}
