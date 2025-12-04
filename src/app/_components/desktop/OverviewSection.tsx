"use client";
import { scaleInVariant } from "@/app/_lib/motion";
import { motion } from "framer-motion";
import Image from "next/image";

export default function OverviewSection() {
  return (
    <div className="flex justify-center font-wantedSans gap-[64px] pb-[140px] relative pt-[200px]">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="text-[#7A4AE2] text-[16px] font-semibold leading-[16px]">
          Overview
        </div>

        <div className="text-[25px] mt-[30px] mb-[20px] font-semibold flex flex-col gap-0 leading-[38px]">
          <div>같은 지역, 인접 대학에서</div>
          <div className="text-[#7A4AE2]">진정으로 의미 있는 만남의 시작</div>
        </div>

        <div className="text-[#898989] text-[20px] leading-[32px]">
          매칭 숫자가 아닌, <span className="font-bold text-[#7A4AE2]">한 분 한 분께</span> <span className="font-bold text-[#7A4AE2]">잘 맞는 인연</span>을 연결합니다
          <br />
          <br />
          같은 대학생이 만들어서 여러분의 고민을 이해합니다
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="z-10 relative"
      >
        <motion.div
          whileHover={{ x: 4, y: -4 }}
          transition={{ type: "spring", stiffness: 100 }}
        >

        </motion.div>
      </motion.div>

      <motion.div
        variants={scaleInVariant}
        className="w-[515px] h-[890px] right-[-140px] rounded-[890px]  top-0 blur-[100px] bg-[rgba(167,139,229,0.08)] absolute z-0"
      />
    </div>
  );
}
