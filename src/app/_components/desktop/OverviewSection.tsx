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
          <div>주변에서 만남으로, 만남에서 설렘으로</div>
          <div>같은 지역에서 대학생만을 위한</div>
          <div className="text-[#7A4AE2]">설렘이 필요한 순간</div>
        </div>

        <div className="text-[#898989] text-[16px] leading-[24px]">
          썸타임은 대학생을 위한 지역 기반 소개팅 앱이에요
        </div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-4 -top-[40px]"
        >
          <Image
            src={"/images/send-letter.png"}
            width={82}
            height={82}
            alt=""
          />
        </motion.div>
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
          <Image
            src="/images/korea-map.png"
            width={310}
            height={300}
            className="z-0"
            alt="sometime 서비스 지도"
          />
        </motion.div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 bottom-[100px]"
        >
          <Image
            src={"/images/heart-arrow.png"}
            width={63}
            height={63}
            alt=""
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={scaleInVariant}
        className="w-[515px] h-[890px] right-[-140px] rounded-[890px]  top-0 blur-[100px] bg-[rgba(122,74,226,0.10)] absolute z-0"
      />
    </div>
  );
}
