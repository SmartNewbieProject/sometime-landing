"use client";
import { fadeUp } from "@/app/_lib/motion";
import { motion } from "framer-motion";

export default function Title() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="flex items-center justify-center mt-[80px]"
    >
      <motion.h2
        variants={fadeUp}
        className="font-wantedSans flex flex-col  text-[112px] gap-0 font-semibold leading-[112px] text-black"
      >
        <div>
          <span className="text-[#7A4AE2]">SOMETIME</span> FOR
        </div>

        <div>REAL CAMPUS LOVE</div>
      </motion.h2>
    </motion.div>
  );
}
