"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const guideItems = [
  {
    title: "학교 인증 소개팅",
    body: "대학생 소개팅 앱을 고를 때 가장 먼저 확인해야 할 기준은 실제 대학생인지 검증되는지입니다. 썸타임은 학교 인증을 기반으로 낯선 만남의 불안을 줄입니다.",
  },
  {
    title: "캠퍼스 매칭",
    body: "같은 지역과 인접 대학 생활권을 고려하면 대화 소재와 실제 만남 가능성이 함께 높아집니다. 캠퍼스 소개팅은 거리보다 대학 생활의 맥락이 중요합니다.",
  },
  {
    title: "안전한 운영 기준",
    body: "안전한 소개팅 앱은 가입 이후에도 프로필, 피드백, 신고 대응을 계속 살펴야 합니다. 썸타임은 빠른 확장보다 신뢰를 먼저 봅니다.",
  },
];

const faqs = [
  {
    question: "대학생 소개팅 앱은 어떤 기준으로 골라야 하나요?",
    answer:
      "학교 인증 여부, 실제 만남 가능한 생활권, 운영자의 검수와 피드백 대응, 부담 없는 매칭 구조를 함께 확인하는 것이 좋습니다.",
  },
  {
    question: "학교 인증 소개팅이 꼭 필요한가요?",
    answer:
      "대학생끼리의 만남에서는 상대가 실제 대학생인지에 대한 신뢰가 중요합니다. 학교 인증은 첫 대화의 불안감을 낮추는 기본 장치입니다.",
  },
  {
    question: "캠퍼스 매칭은 무엇이 다른가요?",
    answer:
      "캠퍼스 매칭은 무작정 많은 사람을 보여주는 방식이 아니라 같은 지역, 인접 대학, 비슷한 대학 생활 리듬을 고려해 연결합니다.",
  },
];

const relatedLinks = [
  {
    label: "한 학교 한 친구 운영 원칙",
    href: "https://some-in-univ.com/blog/하나의-대학교-한-명의-친구-운영은-늘-현실이었어요",
  },
  {
    label: "안전한 대학생 소개팅 운영 이야기",
    href: "https://some-in-univ.com/blog/썸타임이-매일-하는-일은-사실-마음을-지키는-일이에요",
  },
  {
    label: "따뜻한 캠퍼스 매칭 이야기",
    href: "https://some-in-univ.com/blog/우리가-진짜로-만들고-싶은-건-매칭이-아니라-따뜻한-시작이에요",
  },
];

export default function SeoGuideSection() {
  return (
    <section className="bg-white font-wantedSans px-[24px] py-[140px]">
      <div className="mx-auto max-w-[900px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="mb-[18px] text-[16px] font-semibold leading-[16px] text-[#7A4AE2]">
            Campus Dating Guide
          </p>
          <h1 className="text-[36px] font-bold leading-[52px] text-black">
            대학생 소개팅 앱을 고를 때
            <br />
            꼭 확인해야 할 기준
          </h1>
          <p className="mx-auto mt-[24px] max-w-[720px] text-[18px] font-medium leading-[32px] text-[#555]">
            좋은 대학생 소개팅 앱은 단순히 많은 사람을 보여주는 서비스가 아닙니다.
            학교 인증, 캠퍼스 매칭, 실제 만남 가능한 생활권, 꾸준한 운영 기준이
            함께 있어야 안전한 대학생 연애의 시작이 됩니다.
          </p>
        </motion.div>

        <div className="mt-[72px] grid grid-cols-3 gap-[22px]">
          {guideItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-[24px] border border-[#EEE8FF] bg-[#FCFAFF] p-[28px]"
            >
              <h2 className="mb-[16px] text-[21px] font-bold leading-[30px] text-black">
                {item.title}
              </h2>
              <p className="text-[15px] font-medium leading-[26px] text-[#666]">
                {item.body}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-[80px] rounded-[28px] bg-[#F6F1FF] p-[42px]">
          <h2 className="text-[28px] font-bold leading-[40px] text-black">
            대학생 소개팅 앱 FAQ
          </h2>
          <div className="mt-[28px] flex flex-col gap-[22px]">
            {faqs.map((item) => (
              <article key={item.question}>
                <h3 className="text-[18px] font-bold leading-[28px] text-[#2A203E]">
                  {item.question}
                </h3>
                <p className="mt-[8px] text-[15px] font-medium leading-[26px] text-[#666]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-[58px]">
          <h2 className="text-[24px] font-bold leading-[34px] text-black">
            썸타임이 더 자세히 설명한 이야기
          </h2>
          <div className="mt-[20px] flex flex-wrap gap-[12px]">
            {relatedLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[#D9C7FF] px-[18px] py-[10px] text-[14px] font-semibold text-[#7A4AE2] transition hover:bg-[#F6F1FF]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
