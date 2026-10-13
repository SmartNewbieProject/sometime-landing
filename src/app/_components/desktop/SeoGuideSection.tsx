"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const guideItems = [
  {
    title: "학교 인증 소개팅",
    body: '앱 깔기 전에 제일 먼저 볼 건 "진짜 대학생 맞아?"예요. 썸타임은 학교 인증을 해야 다른 사람한테 프로필이 보여요.',
  },
  {
    title: "캠퍼스 매칭",
    body: "같은 지역, 가까운 학교 사람이면 시험 기간이랑 학교 앞 밥집 얘기가 바로 나와요. 거리보다 그 맥락이 편해요.",
  },
  {
    title: "안전한 운영 기준",
    body: "가입한 뒤에도 프로필 검수랑 신고 처리는 계속 봐요.",
  },
];

const faqs = [
  {
    question: "대학생 소개팅 앱은 어떤 기준으로 골라야 하나요?",
    answer:
      "인증을 어떻게 하는지, 가까운 학교 사람이 뜨는지, 신고하면 실제로 처리되는지. 이 셋만 봐도 거의 걸러져요.",
  },
  {
    question: "학교 인증 소개팅이 꼭 필요한가요?",
    answer: "상대가 진짜 대학생인지가 제일 먼저 궁금하니까요. 학교 인증은 그 확인이에요.",
  },
  {
    question: "캠퍼스 매칭은 무엇이 다른가요?",
    answer: "사람 수를 늘리는 게 아니라, 같은 지역·가까운 학교 위주로 보여 줘요.",
  },
  {
    question: "과팅과 소개팅 앱 중 무엇이 더 잘 맞나요?",
    answer:
      "과팅은 친구들이랑 같이 시작하기 편하고, 소개팅 앱은 내 일정에 맞춰 1:1로 알아가기 편해요.",
  },
  {
    question: "지방 대학생도 소개팅 앱에서 만날 수 있나요?",
    answer:
      "가까운 학교 사람이 뜨면 만남까지 가기 쉬워요. 전국에 사람만 많은 앱보다 그 점이 달라요.",
  },
  {
    question: "무료 대학생 소개팅 앱도 괜찮나요?",
    answer:
      "무료인지보다 인증이랑 신고 처리가 있는지를 먼저 봐요. 매칭이 열릴 때마다 한 명씩 무료로 추천해 줘요.",
  },
];

const intentSections = [
  {
    title: "대학생 소개팅 앱 추천 기준",
    body: "가입자 수보다 인증이 있는지, 가까운 학교 사람이 뜨는지, 신고가 실제로 처리되는지를 봐요. 캠퍼스 생활권이 비슷하면 시험 기간 얘기가 통하고, 학교 앞 밥집도 겹쳐요.",
  },
  {
    title: "학교 인증 소개팅 앱이 필요한 이유",
    body: "상대가 진짜 대학생인지, 나와 가까운 생활권인지를 먼저 확인하고 싶잖아요. 학교 인증을 해야 프로필이 보여요.",
  },
  {
    title: "캠퍼스 소개팅과 일반 소개팅 앱의 차이",
    body: "일반 소개팅 앱은 넓은 지역이랑 나이대를 한 번에 보여 주는 경우가 많아요. 캠퍼스 소개팅은 같은 지역, 가까운 학교처럼 실제로 만날 거리를 먼저 봐요.",
  },
];

const checklistItems = [
  "학교 또는 대학생 인증 절차가 있는지",
  "같은 지역, 인접 대학 중심으로 만날 수 있는지",
  "프로필 검수와 신고 대응 기준이 있는지",
  "무료 매칭이나 부담 없는 시작 방식이 있는지",
  "운영자가 피드백을 듣고 매칭 품질을 개선하는지",
];

const fitItems = [
  "같은 지역 대학생과 자연스럽게 만나고 싶은 사람",
  "무작정 많은 추천보다 신뢰할 수 있는 소개를 원하는 사람",
  "학교 인증 기반의 안전한 소개팅 앱을 찾는 사람",
  "과팅보다 조용하고 진중한 1:1 만남을 선호하는 사람",
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
            앱 깔기 전에 학교 인증이 있는지, 가까운 학교 사람이 뜨는지, 신고가
            실제로 처리되는지만 보면 돼요.
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

        <div className="mt-[88px] flex flex-col gap-[34px]">
          {intentSections.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="border-t border-[#EFEAF8] pt-[34px]"
            >
              <h2 className="text-[26px] font-bold leading-[38px] text-black">
                {item.title}
              </h2>
              <p className="mt-[14px] text-[16px] font-medium leading-[30px] text-[#555]">
                {item.body}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-[80px] grid grid-cols-2 gap-[24px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="rounded-[28px] border border-[#EEE8FF] bg-white p-[34px]"
          >
            <h2 className="text-[24px] font-bold leading-[36px] text-black">
              안전한 대학생 소개팅 체크리스트
            </h2>
            <ul className="mt-[24px] flex flex-col gap-[14px]">
              {checklistItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-[10px] text-[15px] font-medium leading-[26px] text-[#555]"
                >
                  <span className="mt-[9px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#7A4AE2]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="rounded-[28px] bg-[#F8F5FF] p-[34px]"
          >
            <h2 className="text-[24px] font-bold leading-[36px] text-black">
              썸타임이 잘 맞는 대학생
            </h2>
            <div className="mt-[24px] flex flex-col gap-[12px]">
              {fitItems.map((item) => (
                <h3
                  key={item}
                  className="rounded-[18px] bg-white px-[18px] py-[14px] text-[15px] font-semibold leading-[24px] text-[#2A203E]"
                >
                  {item}
                </h3>
              ))}
            </div>
          </motion.div>
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
