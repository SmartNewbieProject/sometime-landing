"use client";
import { useEffect, useState } from "react";
import DesktopIndex from "./_components/desktop/DesktopIndex";
import MobileIndex from "./_components/mobile";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile ? <MobileIndex /> : <DesktopIndex />;
}
