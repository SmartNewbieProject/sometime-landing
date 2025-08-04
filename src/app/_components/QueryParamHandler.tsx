'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function QueryParamHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const external = searchParams.get('external');
    if (external === 'bus') {
      console.log('Bus external parameter detected');
    }
  }, [searchParams]);

  return null;
}