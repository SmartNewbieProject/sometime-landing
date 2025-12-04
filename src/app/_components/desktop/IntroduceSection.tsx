"use client";
import { fadeUp } from "@/app/_lib/motion";
import { Easing, motion } from "framer-motion";
import Image from "next/image";

const floatUp = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
    },
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

export default function IntroduceSection() {
  return (
    <div className="font-wantedSans overflow-x-hidden overflow-y-hidden pt-[60px] relative mx-auto pb-[180px]">
      <motion.div
        className="flex mb-[120px] relative w-fit mx-auto flex-col gap-0 font-bold text-[40px] leading-[60px] text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.div
          className="absolute -top-[20px] -scale-x-100 left-[48px]"
          variants={fadeUp}
        >
          <motion.div variants={floatUp} animate="animate">
            <Image
              src={"/images/heart-balloon.png"}
              width={67}
              height={67}
              alt=""
            />
          </motion.div>
        </motion.div>
        <motion.div variants={fadeUp}>
          안전하고 의미 있는 만남을 위해
        </motion.div>
      </motion.div>

      <div className="max-w-[850px] mx-auto">
        <motion.div
          className="flex items-start justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Image
            src={"/images/univ-verify.png"}
            alt=""
            width={360}
            height={312}
          />
          <div className="flex flex-col gap-[20px]">
            <div className="text-[25px] font-semibold leading-[38px]">
              대학생 인증 필수
            </div>
            <div className="text-black opacity-50 text-[16px] leading-[24px] font-medium">
              <span className="font-bold text-[#7A4AE2]">진짜 대학생</span>끼리만 매칭돼요
              <br />
              안심하고 시작하실 수 있어요
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center mt-[24px] justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="flex flex-col gap-[20px]">
            <div className="text-[25px] font-semibold leading-[38px]">
              같은 지역, 인접 대학 우선
            </div>
            <div className="text-black opacity-50 text-[16px] leading-[24px] font-medium">
              통학 거리, 생활권을 고려한 매칭으로
              <br />
              <span className="font-bold text-[#7A4AE2]">실제로 만날 수 있는 인연</span>을 연결해드려요
            </div>
          </div>
          <motion.div
            className="z-10 flex flex-col gap-[2px] justify-center items-center relative min-w-[362px] min-h-[172px]"
            variants={floatUp}
            animate="animate"
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
        </motion.div>

        <motion.div
          className="flex items-center mt-[72px] justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <motion.div
            className="z-10 flex flex-col gap-[2px] justify-center items-center relative min-w-[362px] min-h-[172px]"
            variants={floatUp}
            animate="animate"
          >
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
              매주 목/일 무료 매칭
            </div>
            <div className="text-black opacity-50 text-[16px] leading-[24px] font-medium">
              부담 없이 시작하세요
              <br />
              기다림 끝에 만나는 <span className="font-bold text-[#7A4AE2]">특별한 순간</span>이 있어요
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="w-[515px] h-[578px] left-[-100px] rounded-[578px] top-[260px] blur-[100px] bg-[rgba(167,139,229,0.06)] absolute z-0"
        viewport={{ once: true }}
      />
    </div>
  );
}
