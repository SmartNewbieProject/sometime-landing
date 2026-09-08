import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "../_lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "11.11 선물 캠페인 안내 — 썸타임",
    description:
      "썸타임 11.11 선물 캠페인의 취지와 현재 확인 가능한 공식 앱·서비스 안내를 확인하세요.",
    path: "https://info.some-in-univ.com/event",
    keywords: ["썸타임 이벤트", "11.11 선물 캠페인"],
  }),
  robots: { index: false, follow: false },
};

export default function EventLayout({ children }: { children: ReactNode }) {
  return children;
}
