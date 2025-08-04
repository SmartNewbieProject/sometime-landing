'use client';

import {useEffect} from "react";
import * as amplitude from "@amplitude/analytics-browser";

export const AmplitudeProvider = () => {
  useEffect(() => {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY as string, {
      flushIntervalMillis: 1000,
      autocapture: {
        attribution: true,
        pageViews: true,
      }
    });
  }, []);

  return null;
};
