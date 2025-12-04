"use client";
import Image from "next/image";
import RightArrow from "../icon/RightArrow";
import { motion } from "framer-motion";
import { arrowRightVariants, floatVariants } from "@/app/_lib/motion";
import DesktopArrowBottom from "../icon/DesktopArrowBottom";
import Link from "next/link";
import { sendGTMEvent } from "@next/third-parties/google";
import { useRouter } from "next/navigation";
import { track } from "@amplitude/analytics-browser";
export default function TopSection() {
  const router = useRouter();
  return (
    <>
      <section className="h-[600px] bg-[url('/images/desktop-bg.png')] overflow-hidden w-full  bg-cover bg-center bg-no-repeat relative font-wantedSans">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(245,242,255,0.15)] via-[rgba(250,248,255,0.10)] to-[rgba(255,255,255,0.05)] pointer-events-none" />
        <div className="absolute w-full h-full  bottom-0">
          <div className="absolute bottom-0   -translate-x-1/2 left-1/2 z-10">
            <Image
              src="/images/phone-frame.png"
              height={413}
              width={430}
              alt="phone frame"
              className=" z-10  "
            />
            <motion.div
              variants={floatVariants}
              animate="animate"
              whileHover={{ scale: 1.1 }}
              className="absolute top-[80px] -right-[72px]"
            >
              <Image
                src={"/images/send-letter.png"}
                width={118}
                height={118}
                alt=""
              />
            </motion.div>
          </div>
          <Image
            src="/images/desktop-header-logo.png"
            width={860}
            height={97}
            alt="썸타임 로고"
            className="absolute z-0  -translate-x-1/2 left-1/2 top-8"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              track("Click_Sometime", { type: "Desktop" });
              sendGTMEvent({ event: "click_page" });
              router.push("https://some-in-univ.com");
            }}
            className="bg-[#7A4AE2] z-30 absolute  leading-[15px] bottom-[30px] -translate-x-1/2 left-1/2 flex gap-[10px] items-center gap py-[18px] px-[44px] text-white text-[18px] font-semibold  font-wantedSans rounded-[30px]"
          >
            <div>매칭하러 가기</div>
            <motion.div variants={arrowRightVariants} animate="animate">
              <RightArrow />
            </motion.div>
          </motion.button>
          <div className="absolute bottom-[32px] flex flex-col items-start gap-[12px] -translate-x-1/2 left-[calc(50%-350px)]">
            <div className="bg-white h-[1px] w-[180px] " />
            <div className="flex flex-col gap-0">
              <div className="text-[13px] font-normal leading-[17px]  text-[rgba(255,255,255,0.70)]">
                대학생들의 진심 어린 만남
              </div>
              <div className="text-white text-[13px] font-normal leading-[17px] ">
                썸타임이 함께합니다
              </div>
              <div className="text-white text-[13px] font-normal leading-[17px] mt-2">
                매칭 숫자가 아닌, 의미 있는 관계를 돕습니다
              </div>
            </div>
          </div>

          <div className="absolute bottom-[32px] flex gap-[10px] -translate-x-1/2 left-[calc(50%+280px)]">
            <Link
              href="https://apps.apple.com/kr/app/%EC%8D%B8%ED%83%80%EC%9E%84-%EB%8C%80%ED%95%99%EC%83%9D-%EB%8D%B0%EC%9D%B4%ED%8C%85/id1614166870"
              target="_blank"
            >
              <Image
                src="/images/app-store.png"
                width={140}
                height={44}
                alt="app store"
              />
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.sometime.frontend"
              target="_blank"
            >
              <Image
                src="/images/google-play.png"
                width={140}
                height={44}
                alt="google play"
              />
            </Link>
          </div>
          <motion.div
            variants={floatVariants}
            animate="animate"
            whileHover={{ scale: 1.1 }}
            className="absolute -scale-x-100 bottom-[100px]  flex flex-col items-start gap-[12px] -translate-x-1/2 left-[calc(50%-270px)]"
          >
            <Image
              src={"/images/heart-balloon.png"}
              width={66}
              height={66}
              alt=""
            />
          </motion.div>

          <div className="w-[794px] h-[556px] rounded-[794px] blur-[100px] bg-[rgba(167,139,229,0.08)] absolute top-[136px] -left-[264px] " />
          <div className="w-[423px] h-[423px] rounded-[423px] blur-[100px] bg-[rgba(167,139,229,0.12)] absolute top-[100px] right-[112px] " />
        </div>
      </section>
      <div className="pt-[0px] flex items-center justify-center ">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 12, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.2 }}
          onClick={() => window?.fullpage_api?.moveSectionDown()}
          className="flex flex-col items-center "
        >
          <DesktopArrowBottom />
          <div className="relative -top-6">
            <DesktopArrowBottom />
          </div>
        </motion.div>
      </div>
    </>
  );
}
