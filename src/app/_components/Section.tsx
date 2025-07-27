"use client";

import { useEffect } from "react";

export default function Section({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  return (
    <div className="section flex font-pretendard justify-center max-w-[440px] mx-auto items-center w-full min-h-screen bg-white section">
      <div
        className="w-full"
        style={{
          height: "calc(var(--vh, 1vh) * 100)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
