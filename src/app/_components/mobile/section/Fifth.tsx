"use client";

import { Easing, motion } from "framer-motion";
import Image from "next/image";
import SomeMale from "../../icon/SomeMale";
import SomeFemale from "../../icon/SomeFemale";
import { bubbleVariants, floatVariants } from "@/app/_lib/motion";

export default function Fifth() {
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
        썸타임과 함께한 분들의 이야기
      </motion.h2>

      <motion.div
        variants={bubbleVariants}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        whileHover={{ opacity: 1 }}
        className="text-black font-medium leading-[12px] text-[12px] mb-[20px] opacity-60"
      >
        진심 어린 만남이 시작됐어요
      </motion.div>

      <motion.div
        variants={bubbleVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative text-center w-[330px] py-[16px] px-[12px] flex justify-center rounded-[16px] bg-[#E2D9FF] shadow-md"
      >
        <motion.div className="text-[#7A4AE2] font-semibold text-[10px] leading-[14px]">
          다른 앱들은 범위가 너무 넓어서 막막했는데,
          <br />
          썸타임은 우리 지역 대학생들만 소개해줘서 좋아요.
          <br />
          실제로 만날 수 있는 거리라 부담도 덜하고요!
          <br />
          <br />
          - 대전 지역 이용자
        </motion.div>

        <motion.div
          variants={floatVariants}
          animate="animate"
          whileHover={{ scale: 1.1 }}
          className="absolute left-[12px] -top-[18px]"
        >
          <SomeMale />
        </motion.div>
      </motion.div>

      <motion.div
        variants={bubbleVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative text-center w-[330px] py-[16px] px-[12px] flex justify-center rounded-[16px] mt-[20px] bg-[#E2D9FF] shadow-md"
      >
        <motion.div className="text-[#7A4AE2] font-semibold text-[10px] leading-[14px]">
          처음엔 어색했지만 여러 번 만나면서
          <br />
          정말 잘 맞는 사람이란 걸 알게 됐어요.
          <br />
          좋은 인연 연결해주셔서 감사합니다!
          <br />
          <br />
          - 부산 지역 이용자
        </motion.div>

        <motion.div
          variants={floatVariants}
          animate="animate"
          whileHover={{ scale: 1.1 }}
          className="absolute right-[12px] -top-[18px]"
        >
          <SomeFemale />
        </motion.div>
      </motion.div>

      {/* 세 번째 후기 추가 */}
      <motion.div
        variants={bubbleVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative text-center w-[330px] py-[16px] px-[12px] flex justify-center rounded-[16px] mt-[20px] bg-[#E2D9FF] shadow-md"
      >
        <motion.div className="text-[#7A4AE2] font-semibold text-[10px] leading-[14px]">
          개발팀이 커뮤니티에서 직접 답변하는 거 보고
          <br />
          진심으로 운영한다는 게 느껴졌어요
          <br />
          <br />
          - 충남 지역 이용자
        </motion.div>

        <motion.div
          variants={floatVariants}
          animate="animate"
          whileHover={{ scale: 1.1 }}
          className="absolute left-[20px] -top-[18px]"
        >
          <SomeMale />
        </motion.div>
      </motion.div>

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
