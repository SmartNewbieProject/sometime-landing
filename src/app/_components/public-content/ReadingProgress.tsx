"use client";

import { useEffect, useState } from "react";

type ReadingProgressProps = {
  /** 진행률을 측정할 아티클 영역 선택자 (기본: article) */
  targetSelector?: string;
};

/**
 * 스크롤 기반 읽기 진행 바.
 * 장식용이지만 진행률을 스크린리더에 주기적으로 알림.
 */
export function ReadingProgress({ targetSelector = "article" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.querySelector(targetSelector);
      if (!el) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0);
        return;
      }

      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      const start = rect.top + scrollY;
      const end = start + el.clientHeight - window.innerHeight;
      if (end <= start) {
        setProgress(scrollY > start ? 100 : 0);
        return;
      }
      const raw = ((scrollY - start) / (end - start)) * 100;
      setProgress(Math.min(100, Math.max(0, raw)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetSelector]);

  const rounded = Math.round(progress);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
      role="progressbar"
      aria-label="이 글 읽기 진행률"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      aria-valuetext={`${rounded}% 읽음`}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-[#9B6CFF] via-[#7A4AE2] to-[#5B35B5] shadow-[0_0_12px_rgba(122,74,226,0.45)]"
        style={{
          width: `${progress}%`,
          transition: "width 80ms linear",
        }}
      />
      <span className="sr-only">이 글의 {rounded}%를 읽었습니다.</span>
    </div>
  );
}
