"use client";

import { motion } from "framer-motion";
import { bubbleVariants } from "@/app/_lib/motion";

const guideItems = [
  {
    title: "대학생 소개팅 앱 추천 기준",
    body: "인증을 어떻게 하는지, 가까운 학교 사람이 뜨는지, 신고하면 실제로 처리되는지. 이 셋만 봐도 거의 걸러져요.",
  },
  {
    title: "학교 인증 소개팅",
    body: "앱 깔기 전에 제일 먼저 볼 건 \"진짜 대학생 맞아?\"예요. 인증해야 프로필이 보여요.",
  },
  {
    title: "캠퍼스 소개팅 차이",
    body: "같은 지역, 가까운 학교 사람이면 시험 기간이랑 학교 앞 밥집 얘기가 바로 나와요.",
  },
  {
    title: "안전한 대학생 소개팅",
    body: "가입한 뒤에도 프로필 검수랑 신고 처리는 계속 봐요.",
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
        앱 깔기 전에 학교 인증이 있는지, 가까운 학교
        <br />
        사람이 뜨는지, 신고가 처리되는지만 보면 돼요.
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
