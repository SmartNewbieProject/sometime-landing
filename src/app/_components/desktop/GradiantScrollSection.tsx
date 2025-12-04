"use client";

import { bubbleVariants, floatVariants } from "@/app/_lib/motion";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import SomeMale from "../icon/SomeMale";
import SomeFemale from "../icon/SomeFemale";

export default function GradientScrollSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
    mass: 0.8,
  });

  const backgroundOpacity = useTransform(smoothScroll, [0, 0.5, 1], [0, 1, 0]);
  const contentOpacity = useTransform(smoothScroll, [0.3, 0.4], [0, 1]);
  const contentTranslate = useTransform(smoothScroll, [0.3, 0.4], [50, 0]);

  return (
    <div ref={ref} className="font-wantedSans relative h-[150vh] bg-white overflow-hidden">
      <motion.div
        style={{
          opacity: backgroundOpacity,
          background: "linear-gradient(180deg, #F5F2FF 0%, #FAF8FF 50%, #FFFFFF 100%)",
        }}
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentTranslate,
        }}
        className="relative z-10 flex flex-col items-center justify-center h-screen"
      >
        <div className="text-black leading-[60px] font-bold text-[40px] text-center">
          <span className="text-[#7A4AE2]">썸타임</span>과 함께한 분들의 이야기
        </div>
        <div className="text-black opacity-50 text-[25px] font-medium leading-[38px] text-center">
          진심 어린 만남이 시작됐어요
        </div>

        <motion.div
          variants={bubbleVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative text-center min-w-[840px] mt-[94px] py-[32px] px-[135px] flex justify-center rounded-[16px] bg-[#E2D9FF] shadow-md"
        >
          <motion.div className="text-[#7A4AE2] font-semibold text-[20px] leading-[30px]">
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
            className="absolute left-[50px] -top-[38px]"
          >
            <SomeMale width={76} height={76} />
          </motion.div>
        </motion.div>

        <motion.div
          variants={bubbleVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative text-center min-w-[840px] mt-[70px] py-[32px] px-[135px] flex justify-center rounded-[16px] bg-[#E2D9FF] shadow-md"
        >
          <motion.div className="text-[#7A4AE2] font-semibold text-[20px] leading-[30px]">
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
            className="absolute right-[50px] -top-[38px]"
          >
            <SomeFemale width={76} height={76} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
