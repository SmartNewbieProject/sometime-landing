"use client";

import Image from "next/image";
import { Easing, motion } from "framer-motion";
import React from "react";
import { deeplinkToApp } from "@/app/_lib/utils";
import { sendGTMEvent } from "@next/third-parties/google";
import * as amplitude from "@amplitude/analytics-browser";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" as Easing },
  }),
};

export default function First() {
  return (
    <motion.div
      className="relative font-pretendard flex flex-col max-w-[440px] items-center justify-center w-full overflow-hidden h-full z-10"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <div className="relative items-center justify-center flex flex-col">
        <motion.h3
          custom={0}
          variants={fadeUp}
          className="text-[#AD91EA] z-10 text-[14px] font-medium leading-[24px] mb-[8px]"
        >
          대학교에서 내 이상형을 찾는 가장 빠른 방법
        </motion.h3>

        <motion.div
          custom={1}
          variants={fadeUp}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={"/images/title-logo.png"}
            width={300}
            height={42}
            alt="sometime 타이틀 로고"
            className="mb-[20px] z-10"
          />
        </motion.div>

        <motion.div custom={2} variants={fadeUp}>
          <Image
            src={"/images/logo.png"}
            width={70}
            height={70}
            alt="sometime 로고"
            className="mb-[10px] z-20"
          />
        </motion.div>

        <motion.button
          custom={3}
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            sendGTMEvent({ event: "click_download" });

            deeplinkToApp("");
          }}
          whileTap={{ scale: 0.95 }}
          className="w-[144px] mb-24 h-[38px] flex items-center justify-center bg-[#D9C7FF] rounded-[12px] z-10 text-white font-semibold leading-[14px] text-[16px]"
        >
          다운로드
        </motion.button>

        <Image
          src={"/images/title-bg.png"}
          width={364}
          height={224}
          alt="sometime 타이틀 백그라운드"
          className="absolute -z-10 top-[53px]"
        />
      </div>

      <div className="w-[524px] h-[524px] left-[-382px] rounded-full blur-[100px] bg-[rgba(122,74,226,0.10)] absolute z-0" />

      <motion.div
        initial={{ y: 0 }}
        onClick={() => window?.fullpage_api?.moveSectionDown()}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
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
