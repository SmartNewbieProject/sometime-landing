'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import * as amplitude from "@amplitude/analytics-browser";


type RegionType = 'GalleriaDepartmentStore' | 'CNU' | 'OnCheonBridge' | 'Instagram';
const REGIONS = ['GalleriaDepartmentStore', 'CNU', 'OnCheonBridge', 'Instagram'] as RegionType[];

const propertyMap: Record<RegionType, string> = {
  GalleriaDepartmentStore: '갤러리아타임월드 앞',
  CNU: '충남대학교 앞',
  OnCheonBridge: '온천교 앞',
  Instagram: '인스타그램 유입',
};

export default function QueryParamHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const external = searchParams.get('external');

    if (!!external && REGIONS.includes(external as RegionType)) {
      amplitude.track("BusMarketing_Traffic", {
        region: propertyMap[external as RegionType],
      });
      
      amplitude.flush();

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