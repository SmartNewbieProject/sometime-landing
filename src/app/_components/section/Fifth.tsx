"use client";

import { Easing, motion } from "framer-motion";
import Image from "next/image";
import SomeMale from "../icon/SomeMale";
import SomeFemale from "../icon/SomeFemale";

const bubbleVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const floatVariants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
    },
  },
};

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
        썸타임으로 시작된 대학생들의 이야기
      </motion.h2>

      <motion.div
        variants={bubbleVariants}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        whileHover={{ opacity: 1 }}
        className="text-black font-medium leading-[12px] text-[12px] mb-[20px] opacity-60"
      >
        이런 연결, 이런 이야기들이 있었어요
      </motion.div>

      <motion.div
        variants={bubbleVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative text-center w-[330px] py-[16px] px-[12px] flex justify-center rounded-[16px] bg-[#E2D9FF] shadow-md"
      >
        <motion.div className="text-[#7A4AE2] font-semibold text-[10px] leading-[14px]">
          연애 못한지 꽤 됐는데 안 해본 방법이 없던 와중 이런 소개팅 어플이
          <br />
          나와서 한 번 써봤는데 대전 대학생들만 소개시켜주는거라 너무 좋았어요!!
          <br />
          여기서 애인 만들어 나갑니다..💕
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
          여러번 만나서 둘다 좋아하는 감정 생겨서 썸이구용,,,
          <br />
          여름에 놀러가기로 했뜹니당...
          <br />
          완벽한 이상형인 미남오빠랑 매칭해주셔서 감사합니다 ㅠㅠㅠ
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
