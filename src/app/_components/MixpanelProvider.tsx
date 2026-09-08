"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackLandingPageView } from "../_lib/store-cta-tracking";

export function buildMixpanelPageViewInput(
  pathname: string | null,
  searchParams: { toString(): string } | null,
) {
  return { pathname, search: searchParams?.toString() ?? "" };
}

function MixpanelPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { pathname: trackedPathname, search } = buildMixpanelPageViewInput(pathname, searchParams);

  useEffect(() => {
    trackLandingPageView({ pathname: trackedPathname, search });
  }, [trackedPathname, search]);

  return null;
}

export function MixpanelProvider() {
  return (
    <Suspense fallback={null}>
      <MixpanelPageViewTracker />
    </Suspense>
  );
}
