"use client";
import { Easing, motion } from "framer-motion";
import Image from "next/image";
import IncreaseBg from "../icon/IncreaseBg";
import IncreaseArrow from "../icon/IncreaseArrow";
import NumberCounter from "../mobile/NumberCounter";

const scaleFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay, ease: "easeOut" as Easing },
  }),
};

export default function BackgroundSection() {
  return (
    <div className="relative flex flex-col items-center font-wantedSans mb-[280px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="text-[#7A4AE2] text-center text-[16px]  font-semibold leading-[16px]">
          Background
        </div>

        <div className="text-center text-[25px] mt-[30px] mb-[20px] font-semibold flex flex-col gap-0 leading-[38px]">
          <div>
            전국 <span className="text-[#7A4AE2]">230만명</span> 이상의 대학생,
          </div>
          <div>
            이제는 자연스럽게 <span className="text-[#7A4AE2]">앱만추</span>하는
            시대에요
          </div>
        </div>

        <div className="text-[#898989] text-center text-[16px] leading-[24px] flex flex-col gap-0">
          <div>20대 중 65% 이상이 소개팅 앱 만남에 긍정적이라고 답했어요</div>
          <div>
            썸타임은 같은 지역의 대학생끼리 편하고 안전하게 연결되는 새로운
            소개팅 문화를 만들어가고 있어요
          </div>
        </div>
      </motion.div>

      <div className="relative flex items-end pt-[180px] gap-[12px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleFade}
          custom={0}
          className="flex flex-col items-center gap-[14px]"
        >
          <div className="w-[162px] h-[162px] bg-[#E4E4E4] rounded-full flex items-center text-[28px] font-medium justify-center">
            약 100만명
          </div>
          <div className="text-[20px]">2020년</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="self-center relative"
        >
          <IncreaseArrow />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleFade}
          custom={0.8} // delay 0.8초
          className="flex flex-col items-center text-white gap-[36px] relative"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute -left-[196px] -z-10 top-1"
          >
            <IncreaseBg />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute -top-[130px] z-20 left-1/2 -translate-x-1/2"
          >
            <Image
              alt="즐거운 마스코트 이미지"
              src={"/images/happy-some.png"}
              width={194}
              height={198}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute leading-[56px] -top-[40px] -left-[180px]  bg-[#7A4AE2] z-20  text-white text-center text-[25px] font-semibold w-[230px] h-[56px] rounded-[10px]"
          >
            70% 이상의 성장
            <svg
              className="-bottom-[14px] right-[50px] absolute"
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="14"
              viewBox="0 0 17 14"
              fill="none"
            >
              <path
                d="M0.730469 0.21875H13.5754C12.2909 1.50324 15.181 9.67403 16.7866 13.5989C10.3642 14.027 3.40649 4.85719 0.730469 0.21875Z"
                fill="#7A4AE2"
              />
            </svg>
          </motion.div>

          <div className="w-[278px] relative h-[278px] z-10 bg-[#7A4AE2] rounded-full flex items-center text-[45px] font-semibold justify-center">
            <div>
              약 <NumberCounter target={178} duration={1} />
              만명
            </div>
          </div>
          <div className="text-[20px] text-black">2025년</div>
        </motion.div>
      </div>
    </div>
  );
}
