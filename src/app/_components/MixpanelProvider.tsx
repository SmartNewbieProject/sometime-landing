"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackLandingPageView } from "../_lib/store-cta-tracking";

function MixpanelPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  useEffect(() => {
    trackLandingPageView({ pathname, search });
  }, [pathname, search]);

  return null;
}

export function MixpanelProvider() {
  return (
    <Suspense fallback={null}>
      <MixpanelPageViewTracker />
    </Suspense>
  );
}
