"use client";

import { fadeUp, scaleFade } from "@/app/_lib/motion";
import { motion, Easing } from "framer-motion";
import Image from "next/image";

export default function Third() {
  return (
    <motion.div
      className="font-wantedSans relative flex flex-col items-center justify-center w-full h-full overflow-hidden z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="w-[316px] h-[873px] right-[-158px] rounded-full blur-[100px] bg-[rgba(167,139,229,0.08)] absolute z-0"
      />

      <motion.div
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        className="flex flex-col items-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-black z-10 text-[20px] font-semibold leading-[30px] mb-[5px]"
        >
          대학생 인증 필수
        </motion.h2>

        <motion.div
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          whileHover={{ opacity: 1 }}
          className="text-black font-medium leading-[12px] text-[12px] mb-[20px] opacity-60 text-center"
        >
          진짜 대학생끼리만 만나요
          <br />
          안심하고 시작하실 수 있어요
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9, rotateX: -10 },
            visible: { opacity: 1, scale: 1, rotateX: 0 },
          }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="z-10"
        >
          <Image
            src="/images/univ-verify.png"
            width={222}
            height={173}
            alt="대학 인증 이미지"
          />
        </motion.div>
      </motion.div>

      {/* 👉 아래쪽 그룹 */}
      <motion.div
        variants={{
          visible: {
            transition: {
              delayChildren: 0.7,
              staggerChildren: 0.15,
            },
          },
        }}
        className="flex flex-col items-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-black z-10 mt-[24px] text-[20px] font-semibold leading-[30px] mb-[5px]"
        >
          같은 지역, 실제 만남 가능한 인연
        </motion.h2>

        <motion.div
          variants={fadeUp}
          className="text-black font-medium leading-[12px] text-[12px] mb-[10px] opacity-60 text-center"
        >
          내가 다니는 학교 중심으로
          <br />
          실제로 만날 수 있는 거리의 대학생들과 연결돼요
        </motion.div>

        <motion.div
          variants={scaleFade}
          className="z-10 flex flex-col gap-[2px] justify-center items-center relative min-w-[362px] min-h-[172px]"
        >
          <Image
            src="/images/fourth-line.png"
            className="z-0 absolute"
            width={361}
            height={170}
            alt="라인 이미지"
          />
          <Image
            src="/images/heart-some.png"
            className="z-10"
            width={260}
            height={110}
            alt="sometime 여우"
          />
          <Image
            src="/images/daejeon-picker-double.png"
            className="z-10"
            width={220}
            height={70}
            alt="대전 픽커"
          />
        </motion.div>
      </motion.div>

      {/* 아래로 이동 아이콘 */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.2, rotate: [0, 5, -5, 0] }}
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
