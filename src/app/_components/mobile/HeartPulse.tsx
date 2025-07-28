"use client";

import { motion } from "framer-motion";
import NonFillHeart from "../icon/NonFillHeart";

export default function HeartPulse() {
  const layers = [1, 2, 3];
  const totalDuration = 1;
  const segment = totalDuration;
  return (
    <div className="absolute w-[35px] h-[35px] z-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      {layers.map((layer, index) => {
        const delay = segment;

        return (
          <motion.div
            key={layer}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1 + index * 0.5, 1],
              opacity: [1, 1, 1],
            }}
            transition={{
              duration: segment,
              ease: "easeOut",
              repeat: Infinity,
              delay,
              repeatDelay: totalDuration,
            }}
            className="absolute z-0"
          >
            <NonFillHeart stroke={index === 0 ? "#7A4AE2" : undefined} />
          </motion.div>
        );
      })}
    </div>
  );
}
