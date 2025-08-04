"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { sendGTMEvent } from "@next/third-parties/google";
import { track } from "@amplitude/analytics-browser";
export default function DownloadSection() {
  return (
    <div className="h-[464px] font-wantedSans w-full flex flex-col bg-[#7A4AE2] justify-center items-center">
      <Image
        src={"/images/white-logo.png"}
        width={394}
        height={55}
        alt="썸타임 로고"
      />
      <div className="font-semibold mt-[6px] mb-[8px] text-[#E1D4FF] text-[38px] leading-[46px] ">
        TO FEEL SOMETHING
      </div>
      <div className="text-[#AD91EA] text-[20px] font-medium leading-[30px] ">
        대학생을 위한 진짜 설렘의 시작
      </div>
      <div className=" flex  items-center gap-[38px] mt-[30px] ">
        <motion.button whileHover={{ scale: 1.1 }}>
          <Link
            target="_blank"
            href="https://apps.apple.com/kr/app/썸타임-지역-대학생-소개팅/id6746120889"
            onClick={() => {
              track("Click_Download", {
                platform: "app_store",
                type: "Desktop",
                location: "Download_Sectoin",
              });
              sendGTMEvent({ event: "click_download", platform: "app_store" });
            }}
          >
            <Image
              src={"/images/big-app-store.png"}
              width={163}
              height={50}
              alt="앱스토어 링크"
            />
          </Link>
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }}>
          <Link
            target="_blank"
            href="https://play.google.com/store/apps/details?id=com.smartnewb.sometimes"
            onClick={() => {
              track("Click_Download", {
                platform: "google_play",
                type: "Desktop",
                location: "Download_Section",
              });
              sendGTMEvent({
                event: "click_download",
                platform: "google_play",
              });
            }}
          >
            <Image
              src={"/images/big-google-play.png"}
              width={163}
              height={50}
              alt="구글플레이 링크"
            />
          </Link>
        </motion.button>
      </div>
    </div>
  );
}
