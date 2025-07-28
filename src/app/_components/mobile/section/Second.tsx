"use client";

import Image from "next/image";
import { Easing, motion } from "framer-motion";
import HeartPulse from "../HeartPulse";
import FillHeart from "../../icon/FillHeart";
import { floatVariants } from "@/app/_lib/motion";

export default function Second() {
  return (
    <motion.div
      className="font-wantedSans relative flex flex-col items-center justify-center w-full h-full overflow-hidden z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-black z-10 text-[26px] font-semibold leading-[26px]"
      >
        SOMETIME FOR
      </motion.h2>

      <motion.h3
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="text-black z-10 text-[20px] font-semibold leading-[20px] mb-[6px]"
      >
        REAL CAMPUS LOVE
      </motion.h3>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 0.6, y: 0 },
        }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        className="text-black font-medium leading-[18px] text-[12px] mb-[20px]"
      >
        썸타임은 대학생을 위한 지역 기반 소개팅 앱이에요
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 },
        }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.03 }}
        className="z-10 relative"
      >
        <Image src="/images/korea-map3.png" width={310} height={300} className="z-0" alt="sometime 서비스 지도" />

        <motion.div
          variants={floatVariants}
          animate="animate"
          whileHover={{ scale: 1.1 }}
          className="absolute top-10 -left-[20px]"
        >
          <Image src={"/images/heart-balloon.png"} alt="말풍선 아이콘" width={48} height={46} />
        </motion.div>
        <motion.div
          variants={floatVariants}
          animate="animate"
          whileHover={{ scale: 1.1 }}
          className="absolute bottom-10 -right-[35px]"
        >
          <Image src={"/images/heart-arrow.png"} alt="말풍선 아이콘" width={100} height={100} />
        </motion.div>

        <div className="absolute top-[200px] left-[110px] z-30 pointer-events-none">
          <HeartPulse />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="z-10"
          >
            <FillHeart />
          </motion.div>
        </div>
        <div className="absolute bottom-[150px] right-[30px] z-30 pointer-events-none">
          <HeartPulse />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="z-10"
          >
            <FillHeart />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="w-[316px] h-[873px] right-[-158px] bottom-[-660px] rounded-full blur-[100px] bg-[rgba(122,74,226,0.10)] absolute z-0"
      />

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 12, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.2 }}
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
