"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@amplitude/analytics-browser";

export default function usePageViewTracking() {
  const enterTimeRef = useRef<number | null>(null);

  useEffect(() => {
    enterTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const stayTime = Math.round(
          (Date.now() - enterTimeRef?.current!) / 1000
        );
        track("page_stay", { stayTime });
      }
    };

    const handlePageHide = () => {
      const stayTime = Math.round((Date.now() - enterTimeRef?.current!) / 1000);
      track("page_stay", { stayTime });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);
}
