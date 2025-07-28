"use client";

import Image from "next/image";
import React from "react";
import { Easing, motion } from "framer-motion";
import { floatVariants } from "@/app/_lib/motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut" as Easing,
    },
  }),
};

const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
    },
  },
};

export default function ScreenListSection() {
  return (
    <div className="relative flex flex-col items-center font-wantedSans mb-[204px] mt-[100px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-black leading-[60px] font-bold text-[40px] text-center"
      >
        <span className="text-[#7A4AE2]">썸타임</span>으로 시작된 대학생들의 이야기
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-black opacity-50 text-[25px] font-medium leading-[38px] text-center"
      >
        이런 연결, 이런 이야기들이 있었어요
      </motion.div>

      <div className="flex relative items-center justify-center mt-[100px] gap-[18px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="absolute top-10 -scale-x-100 z-30 -left-[40px]"
          variants={fadeUp}
        >
          <motion.div variants={floatVariants} animate="animate" whileHover={{ scale: 1.1 }}>
            <Image src={"/images/heart-balloon.png"} alt="말풍선 아이콘" width={77} height={77} />
          </motion.div>
        </motion.div>

        {[5, 6, 7].map((num, i) => (
          <motion.div
            key={num}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Image src={`/images/${num}.png`} width={255} height={550} alt={`screen ${num}`} />
          </motion.div>
        ))}

        <motion.div className="absolute -bottom-[120px] -right-[44px]" variants={float} animate="animate">
          <Image src="/images/pick-some.png" width={289} height={133} alt="pick some" />
        </motion.div>
      </div>
    </div>
  );
}
