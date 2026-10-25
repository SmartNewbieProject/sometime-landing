"use client";

import { useEffect, useRef, useState } from "react";

// 스크립트는 막고(allow-scripts 없음) 높이 측정을 위해서만 같은 출처를 허용한다.
export function NoticeHtmlFrame({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(800);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | null = null;
    const measure = () => {
      const body = frame.contentDocument?.body;
      if (!body) return;
      setHeight(body.scrollHeight);
      observer?.disconnect();
      observer = new ResizeObserver(() => setHeight(body.scrollHeight));
      observer.observe(body);
    };
    if (frame.contentDocument?.readyState === "complete") measure();
    frame.addEventListener("load", measure);
    return () => {
      frame.removeEventListener("load", measure);
      observer?.disconnect();
    };
  }, [html]);

  return (
    <iframe
      ref={ref}
      title={title}
      sandbox="allow-same-origin"
      srcDoc={html}
      referrerPolicy="no-referrer"
      className="mx-auto block w-full max-w-[680px] border-0"
      style={{ height }}
    />
  );
}
