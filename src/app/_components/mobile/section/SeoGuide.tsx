"use client";

import { motion } from "framer-motion";
import { bubbleVariants } from "@/app/_lib/motion";

const guideItems = [
  {
    title: "학교 인증 소개팅",
    body: "실제 대학생인지 확인되는 구조가 첫 만남의 불안을 줄여요.",
  },
  {
    title: "캠퍼스 매칭",
    body: "같은 지역, 인접 대학 생활권 안에서 대화가 자연스럽게 시작돼요.",
  },
  {
    title: "안전한 운영",
    body: "프로필과 피드백을 계속 확인해야 좋은 매칭 품질이 유지돼요.",
  },
];

export default function SeoGuide() {
  return (
    <motion.div
      className="font-wantedSans relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-[20px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.16,
          },
        },
      }}
    >
      <motion.h2
        variants={bubbleVariants}
        className="mb-[10px] text-center text-[22px] font-bold leading-[31px] text-black"
      >
        대학생 소개팅 앱을 고를 때
        <br />
        꼭 확인할 기준
      </motion.h2>

      <motion.p
        variants={bubbleVariants}
        className="mb-[24px] text-center text-[13px] font-medium leading-[22px] text-[#666]"
      >
        학교 인증, 캠퍼스 매칭, 안전한 운영 기준이
        <br />
        함께 있어야 마음 놓고 시작할 수 있어요.
      </motion.p>

      <div className="flex w-full max-w-[330px] flex-col gap-[12px]">
        {guideItems.map((item) => (
          <motion.article
            key={item.title}
            variants={bubbleVariants}
            className="rounded-[18px] border border-[#EEE8FF] bg-white px-[18px] py-[16px] shadow-sm"
          >
            <h3 className="text-[15px] font-bold leading-[22px] text-[#7A4AE2]">
              {item.title}
            </h3>
            <p className="mt-[5px] text-[12px] font-medium leading-[20px] text-[#555]">
              {item.body}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => window?.fullpage_api?.moveSectionDown()}
        className="absolute bottom-[32px] z-10 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6 text-black opacity-70"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>

      <div className="absolute right-[-140px] top-[80px] -z-10 h-[360px] w-[360px] rounded-full bg-[rgba(122,74,226,0.08)] blur-[100px]" />
    </motion.div>
  );
}
