"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { floatVariants } from "@/app/_lib/motion";

const slides = [
  "/images/intro1.png",
  "/images/intro2.png",
  "/images/intro3.png",
  "/images/intro4.png",
];

export default function IntroCarousel() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe right
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else {
        // Swipe left
        setIndex((prev) => (prev + 1) % slides.length);
      }
    }
  };

  return (
    <div className="relative w-[222px] h-[333px] mx-auto mt-5 flex flex-col items-center justify-start">
      <motion.div
        variants={floatVariants}
        animate="animate"
        whileHover={{ scale: 1.1 }}
        className="absolute -top-5 -right-[40px]"
      >
        <Image
          src={"/images/heart-balloon.png"}
          alt="말풍선 아이콘"
          width={48}
          height={46}
        />
      </motion.div>

      {/* 인디케이터 */}
      <div className="absolute -top-4 z-20 flex space-x-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={clsx(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === index ? "bg-[#9F6BFF]" : "bg-[#D6CFFF]"
            )}
          />
        ))}
      </div>

      <div
        className="relative w-full h-full rounded-[40px] border-[6px] border-[#9F6BFF] overflow-hidden shadow-lg bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: loaded ? 1 : 0 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <Image
              src={slides[index]}
              alt={`Slide ${index + 1}`}
              fill
              onLoadingComplete={() => setLoaded(true)}
              className="object-cover transition-opacity duration-500"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* 상단 pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[70px] h-[18px] bg-[#7A4AE2] rounded-full z-10" />
      </div>
    </div>
  );
}
