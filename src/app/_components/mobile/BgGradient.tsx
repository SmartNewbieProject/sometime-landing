"use client";
import React, { useEffect, useState } from "react";

export default function BgGradient() {
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    const getVirtualScrollHeight = () => {
      const sectionCount = document.querySelectorAll(".section").length;
      return sectionCount * window.innerHeight;
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const virtualHeight = getVirtualScrollHeight();

      setScrollHeight(virtualHeight);
    };

    const handleResize = () => {
      handleScroll(); // 리사이즈 시에도 비율 다시 계산
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // 초기 계산
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  console.log("scroll", scrollHeight, scaleTopPosition(876, 3079, scrollHeight));

  return (
    <div
      className={`w-[316px] h-[873px] z-0 absolute top-[${scaleTopPosition(
        876,
        3079,
        scrollHeight
      )}px] blur-[100px] rounded-[873px] bg-[rgba(122,74,226,0.10)]`}
    />
  );
}

function scaleTopPosition(originalTop: number, originalHeight: number, targetHeight: number): number {
  return (originalTop / originalHeight) * targetHeight;
}
