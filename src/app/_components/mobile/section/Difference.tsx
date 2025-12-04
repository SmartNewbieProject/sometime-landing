"use client";

import { motion } from "framer-motion";
import { bubbleVariants } from "@/app/_lib/motion";

export default function Difference() {
    return (
        <motion.div
            className="font-wantedSans relative flex flex-col items-center justify-center w-full h-full overflow-hidden z-10 px-[20px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.2,
                    },
                },
            }}
        >
            <motion.h2
                variants={bubbleVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[#7A4AE2] z-10 text-[14px] font-semibold leading-[20px] mb-[10px]"
            >
                Sometime is Different
            </motion.h2>

            <motion.h3
                variants={bubbleVariants}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-black z-10 text-[24px] font-bold leading-[34px] mb-[30px] text-center"
            >
                썸타임은 다릅니다
            </motion.h3>

            <motion.div
                variants={bubbleVariants}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-[#555] text-[15px] leading-[26px] text-center mb-[40px]"
            >
                대부분의 데이팅 앱은
                <br />
                여러분이 앱에 오래 머물길 원합니다.
                <br />
                하지만 <span className="text-[#7A4AE2] font-bold">썸타임은 다릅니다.</span>
                <br />
                <br />
                <span className="font-bold text-black text-[17px]">
                    좋은 인연을 만나 앱을 떠나는 것,
                    <br />
                    그게 저희가 원하는 성공입니다.
                </span>
            </motion.div>

            <motion.div
                variants={bubbleVariants}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="text-black text-[16px] font-medium leading-[28px] text-center"
            >
                매칭 숫자가 아닌,
                <br />
                <span className="font-bold text-[18px]">한 분 한 분의 진짜 인연.</span>
                <br />
                그것이 썸타임이 추구하는 가치입니다.
            </motion.div>

            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
                onClick={() => window?.fullpage_api?.moveSectionDown()}
                className="absolute bottom-[32px] z-10 cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-black opacity-70"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="w-[400px] h-[400px] rounded-full blur-[100px] bg-[rgba(167,139,229,0.1)] absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        </motion.div>
    );
}
