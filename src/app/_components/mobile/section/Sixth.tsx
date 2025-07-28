"use client";

import { Easing, motion } from "framer-motion";
import IntroCarousel from "../IntroCarousel";
import NumberCounter from "../NumberCounter";
import Image from "next/image";
import {
  bubbleVariants,
  floatVariants,
  scaleInVariant,
} from "@/app/_lib/motion";

export default function Sixth() {
  return (
    <motion.div
      className="font-wantedSans relative flex flex-col items-center justify-center w-full h-full overflow-hidden z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      <motion.h2
        variants={bubbleVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-black z-10 text-[20px] font-semibold leading-[30px] mb-[5px]"
      >
        썸타임의 연결 방식
      </motion.h2>

      <motion.div
        variants={bubbleVariants}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        whileHover={{ opacity: 1 }}
        className="text-black font-medium leading-[12px] text-[12px] mb-[20px] opacity-60"
      >
        누구나 쉽게 사용할 수 있도록 만들어진 썸타임의 화면을 미리 만나보세요
      </motion.div>

      <div className="relative w-full items-center mx-[16px]">
        <IntroCarousel />

        <motion.div
          variants={bubbleVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute max-w-[360px] -translate-y-1/2 text-end w-[calc(100%-32px)] left-1/2 -translate-x-1/2 py-[26px] flex justify-center rounded-[16px] bg-[#D9C7FF] shadow-md"
        >
          <motion.div className="text-[#7A4AE2] font-semibold text-[14px] leading-[14px] text-center">
            <span className="text-white">지금까지 </span>
            <span>
              <NumberCounter target={31523} />
              번의 연결<span className="text-white">이 이루어지고</span>
            </span>
            <br />
            <div className="mt-[5px]">
              3.8만명의 대학생<span className="text-white">이 방문했어요</span>
            </div>
          </motion.div>

          {/* 하트 아이콘 */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            whileHover={{ scale: 1.1 }}
            className="absolute -top-6 left-[44px]"
          >
            <Image
              src="/images/heart.png"
              alt="하트 아이콘"
              width={44}
              height={44}
            />
          </motion.div>

          {/* 편지 아이콘 */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            whileHover={{ scale: 1.1 }}
            className="absolute -bottom-6 right-[36px]"
          >
            <Image
              src="/images/send-letter.png"
              alt="편지 아이콘"
              width={45}
              height={45}
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        variants={scaleInVariant}
        className="w-[360px] h-[382px] left-[-130px] rounded-full -bottom-[180px]  blur-[100px] bg-[rgba(122,74,226,0.30)] absolute z-0"
      />

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.1 }}
        onClick={() => window?.fullpage_api?.moveSectionDown()}
        className="absolute bottom-[32px] z-10 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-black opacity-70"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
