"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ranking.module.css";

/**
 * 화면에 들어오면 아래에서 떠오른다. 서버 HTML 에는 그대로 보이게 그리고(검색엔진·JS 꺼짐),
 * 마운트 뒤 아직 화면 밖인 것만 숨겼다가 보여 준다. 동작 줄이기는 CSS 가 막는다.
 */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "waiting" | "in">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState("waiting");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("in");
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const motion = state === "waiting" ? styles.revealWaiting : state === "in" ? styles.revealIn : "";
  return (
    <div ref={ref} className={`${motion} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
