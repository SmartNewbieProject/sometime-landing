'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import * as amplitude from "@amplitude/analytics-browser";

export default function QueryParamHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const external = searchParams.get('external');
    if (external === 'bus') {
      amplitude.track("BusMarketing_Traffic");
      
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('external');
      const newUrl = newSearchParams.toString() 
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;
      
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  return null;
}