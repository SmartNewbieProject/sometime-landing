"use client";

import { useEffect } from "react";

export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="section fp-responsive fp-auto-height-responsive flex font-pretendard justify-center max-w-[440px] mx-auto items-center w-full  bg-white section">
      <div className="w-full">{children}</div>
    </div>
  );
}
