"use client";

import { useEffect, useRef } from "react";
import { track } from "@amplitude/analytics-browser";

export default function usePageViewTracking() {
  const enterTimeRef = useRef<number | null>(null);

  useEffect(() => {
    enterTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const getStayTimeBucket = (seconds: number): string => {
      if (seconds <= 5) return "0-5s";
      if (seconds <= 15) return "6-15s";
      if (seconds <= 30) return "16-30s";
      if (seconds <= 60) return "31-60s";
      return "61s+";
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && enterTimeRef?.current) {
        const staySeconds = Math.round(
          (Date.now() - enterTimeRef.current) / 1000
        );
        const stayTimeBucket = getStayTimeBucket(staySeconds);
        track("page_stay", {
          stayTime: stayTimeBucket,
          rawSeconds: staySeconds,
        });
      }
    };

    const handlePageHide = () => {
      if (!enterTimeRef?.current) return;

      const staySeconds = Math.round(
        (Date.now() - enterTimeRef.current) / 1000
      );
      const stayTimeBucket = getStayTimeBucket(staySeconds);
      track("page_stay", { stayTime: stayTimeBucket, rawSeconds: staySeconds });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("vissibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);
}
