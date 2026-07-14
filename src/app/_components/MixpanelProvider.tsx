'use client';

import { useEffect } from 'react';
import { trackLandingPageView } from '../_lib/store-cta-tracking';

export function MixpanelProvider() {
  useEffect(() => {
    trackLandingPageView();
  }, []);

  return null;
}

