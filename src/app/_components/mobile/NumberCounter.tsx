"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useInView } from "framer-motion";

type Props = {
  target: number;
  duration?: number;
  className?: string;
};

export default function NumberCounter({ target, duration = 2, className }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 }); // 40% 보이면 시작
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplay(Math.floor(latest).toLocaleString());
        },
      });
      return controls.stop;
    }
  }, [isInView, target, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
