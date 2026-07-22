import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "../_lib/public-content";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/event` },
  robots: { index: false, follow: false },
};

export default function EventLayout({ children }: { children: ReactNode }) {
  return children;
}
