"use client";

import {
  containerVariants,
  fadeUpVariant,
  scaleInVariant,
} from "@/app/_lib/motion";
import { Easing, motion } from "framer-motion";
import Image from "next/image";

export default function Fourth() {
  return (
    <motion.div
      className="font-wantedSans relative flex flex-col items-center justify-center w-full h-full overflow-hidden z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.h2
        variants={fadeUpVariant}
        className="text-black z-10 text-[20px] font-semibold leading-[30px] mb-[5px]"
      >
        매주 목/일 무료 매칭
      </motion.h2>

      <motion.div
        variants={fadeUpVariant}
        className="text-black font-medium leading-[12px] text-[12px] mb-[20px] text-center"
      >
        부담 없이 시작하세요
        <br />
        기다림 끝에 만나는 특별한 순간이 있어요
      </motion.div>

      <motion.div
        variants={scaleInVariant}
        className="z-10 flex flex-col gap-[2px] justify-center items-center relative min-w-[362px] min-h-[172px]"
      >
        <Image
          src="/images/fourth-line.png"
          className="z-0 absolute"
          width={361}
          height={170}
          alt=" "
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

      <motion.div
        variants={scaleInVariant}
        className="w-[316px] h-[873px] right-[-158px] rounded-full top-[-660px] blur-[100px] bg-[rgba(167,139,229,0.08)] absolute z-0"
      />

      <motion.div
        initial={{ y: 0 }}
        onClick={() => window?.fullpage_api?.moveSectionDown()}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[32px] z-10"
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
