"use client";

import { motion } from "framer-motion";
import { bubbleVariants } from "@/app/_lib/motion";

const guideItems = [
  {
    title: "대학생 소개팅 앱 추천 기준",
    body: "가입자 수보다 학교 인증, 실제 만남 가능한 생활권, 운영 검수를 먼저 확인하는 게 좋아요.",
  },
  {
    title: "학교 인증 소개팅",
    body: "실제 대학생인지 확인되는 구조가 첫 대화의 불안을 줄이고 신뢰를 높여요.",
  },
  {
    title: "캠퍼스 소개팅 차이",
    body: "같은 지역, 인접 대학 생활권을 보면 대화 소재와 실제 만남 가능성이 함께 높아져요.",
  },
  {
    title: "안전한 대학생 소개팅",
    body: "프로필, 피드백, 신고 대응을 계속 살피는 운영 기준이 있어야 마음 놓고 시작할 수 있어요.",
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
        className="mb-[8px] text-center text-[21px] font-bold leading-[30px] text-black"
      >
        대학생 소개팅 앱을 고를 때
        <br />
        꼭 확인할 기준
      </motion.h2>

      <motion.p
        variants={bubbleVariants}
        className="mb-[18px] text-center text-[12px] font-medium leading-[20px] text-[#666]"
      >
        학교 인증, 캠퍼스 매칭, 안전한 운영 기준이
        <br />
        함께 있어야 마음 놓고 시작할 수 있어요.
      </motion.p>

      <div className="flex w-full max-w-[330px] flex-col gap-[9px]">
        {guideItems.map((item) => (
          <motion.article
            key={item.title}
            variants={bubbleVariants}
            className="rounded-[16px] border border-[#EEE8FF] bg-white px-[16px] py-[12px] shadow-sm"
          >
            <h3 className="text-[14px] font-bold leading-[20px] text-[#7A4AE2]">
              {item.title}
            </h3>
            <p className="mt-[4px] text-[11px] font-medium leading-[18px] text-[#555]">
              {item.body}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.p
        variants={bubbleVariants}
        className="mt-[14px] max-w-[320px] text-center text-[11px] font-medium leading-[18px] text-[#777]"
      >
        과팅보다 조용한 1:1 만남을 원하거나, 지방 대학생 소개팅처럼 실제로 만날 수
        있는 거리의 인연을 찾는 분께 잘 맞아요.
      </motion.p>

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
