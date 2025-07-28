"use client";
import { scaleInVariant } from "@/app/_lib/motion";
import { motion } from "framer-motion";
import Image from "next/image";

export default function IntroduceSection() {
  return (
    <div className=" font-wantedSans  relative mx-auto mb-[180px]">
      <div className="flex mb-[120px] relative w-fit mx-auto flex-col gap-0  font-bold text-[40px] leading-[60px] text-center">
        <div className="absolute -top-[20px] -scale-x-100 left-[48px]">
          <Image
            src={"/images/heart-balloon.png"}
            width={67}
            height={67}
            alt=""
          />
        </div>
        <div>
          설렘은 <span className="text-[#7A4AE2]">믿을 수 있는 연결</span>에서
        </div>
        <div>
          새로운 만남은 <span className="text-[#7A4AE2]">기다려지는 순간</span>
          에서 시작돼요
        </div>
      </div>

      <div className="max-w-[850px] mx-auto">
        <div className="flex items-start  justify-between">
          <Image
            src={"/images/univ-verify.png"}
            alt=""
            width={360}
            height={312}
          />
          <div className="flex flex-col gap-[20px]">
            <div className="text-[25px] font-semibold leading-[38px]">
              대학 인증제를 통한 믿을 수 있는 설렘
            </div>
            <div className="text-black opacity-50  text-[16px] leading-[24px] font-medium">
              진짜 대학생끼리만 매칭되니까 걱정 없이 시작할 수 있어요
            </div>
          </div>
        </div>
        <div className="flex items-center mt-[24px] justify-between">
          <div className="flex flex-col gap-[20px]">
            <div className="text-[25px] font-semibold leading-[38px]">
              지역을 기반으로 한 연결
            </div>
            <div className="text-black opacity-50  text-[16px] leading-[24px] font-medium">
              일주일에 두 번, 설레는 매칭
            </div>
          </div>
          <motion.div className="z-10  flex flex-col gap-[2px] justify-center items-center relative min-w-[362px] min-h-[172px]">
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
        </div>
        <div className="flex items-center mt-[72px] justify-between">
          <motion.div className="z-10  flex flex-col gap-[2px] justify-center items-center relative min-w-[362px] min-h-[172px]">
            <Image
              src="/images/big-heart.png"
              className="z-0 absolute top-2 left-2"
              width={105}
              height={105}
              alt=" "
            />
            <Image
              src="/images/calendar.png"
              className="z-10"
              width={180}
              height={270}
              alt=""
            />
            <Image
              src="/images/big-send-letter.png"
              className="z-10 absolute bottom-2 right-2"
              width={119}
              height={119}
              alt=""
            />
          </motion.div>
          <div className="flex flex-col items-end gap-[20px]">
            <div className="text-[25px] font-semibold leading-[38px]">
              일주일에 두 번, 설레는 매칭
            </div>
            <div className="text-black opacity-50  text-[16px] leading-[24px] font-medium">
              매주 목요일과 일요일, 기다림이 있는 연결이 시작돼요
            </div>
          </div>
        </div>
      </div>

      <motion.div
        variants={scaleInVariant}
        className="w-[515px] h-[578px] left-[-100px] rounded-[578px]  top-[260px] blur-[100px] bg-[rgba(122,74,226,0.05)] absolute z-0"
      />
    </div>
  );
}
