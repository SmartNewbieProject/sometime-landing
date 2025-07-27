"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Third() {
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
          hidden: { opacity: 0, y: 25 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-black z-10 text-[20px] font-semibold leading-[30px] mb-[5px]"
      >
        대학 인증제를 통한 믿을 수 있는 설렘
      </motion.h2>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 0.6, y: 0 },
        }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        whileHover={{ opacity: 1 }}
        className="text-black font-medium leading-[12px] text-[12px] mb-[20px]"
      >
        진짜 대학생끼리만 매칭되니까 걱정 없이 시작할 수 있어요
      </motion.div>

      <motion.div
        variants={{
          hidden: { scale: 0.9, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
        }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.04 }}
        className="z-10"
      >
        <Image src="/images/univ-verify.png" width={222} height={173} alt="대학 인증 이미지" />
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="w-[316px] h-[873px] right-[-158px] rounded-full blur-[100px] bg-[rgba(122,74,226,0.10)] absolute z-0"
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
