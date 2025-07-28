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
          background: "linear-gradient(180deg, #EAE0FF 0%, #FFF 100%)",
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
          <span className="text-[#7A4AE2]">썸타임</span>으로 시작된 대학생들의 이야기
        </div>
        <div className="text-black opacity-50 text-[25px] font-medium leading-[38px] text-center">
          이런 연결, 이런 이야기들이 있었어요
        </div>

        <motion.div
          variants={bubbleVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative text-center min-w-[840px] mt-[94px] py-[32px] px-[135px] flex justify-center rounded-[16px] bg-[#E2D9FF] shadow-md"
        >
          <motion.div className="text-[#7A4AE2] font-semibold text-[20px] leading-[30px]">
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
            className="absolute right-[50px] -top-[38px]"
          >
            <SomeFemale width={76} height={76} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
