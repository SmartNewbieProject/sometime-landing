'use client';

import * as amplitude from '@amplitude/analytics-browser';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

export const initAmplitude = () => {
  if (typeof window !== 'undefined' && AMPLITUDE_API_KEY) {
    amplitude.init(AMPLITUDE_API_KEY);
  }
};
