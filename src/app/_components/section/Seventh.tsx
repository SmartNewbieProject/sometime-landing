"use client";

import { motion, Easing } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { sendGTMEvent } from '@next/third-parties/google';

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeInOut" as Easing },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const footerList = [
  { text: "개인정보처리방침", href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba180a3a4bbdf9301683145" },
  { text: "서비스이용약관", href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba1805dbafbc9426a0aaa80" },
  { text: "고객센터", href: "https://www.instagram.com/sometime.in.univ?igsh=MTdxMWJjYmFrdGc3Ng==" },
];

export default function Seventh() {
  return (
    <motion.div
      className="font-wantedSans relative flex flex-col items-center justify-center w-full h-full overflow-hidden z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div variants={fadeInUpVariant} className="z-10 mb-[10px]">
        <Image src="/images/info-logo.png" width={245} height={35} alt="sometime 타이틀 로고" />
      </motion.div>

      <motion.h3 variants={fadeInUpVariant} className="text-[24px] font-semibold leading-[29px] text-center">
        TO FEEL SOMETHING
      </motion.h3>

      <motion.div
        variants={fadeInUpVariant}
        className="text-[12px] text-center leading-[18px] text-[#AD91EA] mt-[5px] mb-[20px]"
      >
        대학생을 위한 진짜 설렘의 시작
      </motion.div>

      <motion.div variants={fadeInUpVariant} className="flex items-center gap-[20px] z-10">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }}>
          <Link 
            target="_blank" 
            href="https://apps.apple.com/kr/app/썸타임-지역-대학생-소개팅/id6746120889"
            onClick={() => sendGTMEvent({ event: 'click_download', platform: 'app_store' })}
          >
            <Image src="/images/app-store.png" width={120} height={50} alt="앱스토어 링크 버튼" />
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }}>
          <Link 
            target="_blank" 
            href="https://play.google.com/store/apps/details?id=com.smartnewb.sometimes"
            onClick={() => sendGTMEvent({ event: 'click_download', platform: 'google_play' })}
          >
            <Image src="/images/google-play.png" width={120} height={50} alt="구글 플레이 링크 버튼" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        variants={scaleInVariant}
        className="w-[360px] h-[382px] left-[-130px] rounded-full top-[130px] blur-[100px] bg-[rgba(122,74,226,0.30)] absolute z-0"
      />

      <motion.div
        variants={fadeInUpVariant}
        className="absolute flex items-center gap-[12px] justify-center bottom-[32px] z-10 text-[12px] text-[#AD91EA]"
      >
        {footerList.map(({ text, href }, idx) => (
          <React.Fragment key={text}>
            <motion.div whileHover={{ scale: 1.05, color: "#7A4AE2" }} transition={{ duration: 0.2 }}>
              <Link href={href} target="_blank">
                {text}
              </Link>
            </motion.div>
            {idx < 2 && <div className="bg-[#AD91EA] w-[1px] h-[8px]" />}
          </React.Fragment>
        ))}
      </motion.div>
    </motion.div>
  );
}
