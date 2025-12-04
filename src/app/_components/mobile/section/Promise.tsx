"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { bubbleVariants } from "@/app/_lib/motion";

const promises = [
    {
        title: "투명한 소통",
        desc: "문제를 숨기지 않고\n함께 해결합니다",
        icon: "/images/send-letter.png",
    },
    {
        title: "질 높은 매칭",
        desc: "알고리즘을 계속\n개선하고 있습니다",
        icon: "/images/heart-balloon.png",
    },
    {
        title: "유저와 함께",
        desc: "여러분의 피드백으로\n매일 나아집니다",
        icon: "/images/heart-some.png",
    },
];

export default function Promise() {
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
                Our Promise
            </motion.h2>

            <motion.h3
                variants={bubbleVariants}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-black z-10 text-[24px] font-bold leading-[34px] mb-[30px] text-center"
            >
                우리의 약속
            </motion.h3>

            <div className="flex flex-col gap-[16px] w-full max-w-[320px]">
                {promises.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={bubbleVariants}
                        className="flex items-center bg-white rounded-[20px] p-[20px] shadow-sm border border-[#F0F0F0] w-full"
                    >
                        <div className="relative w-[50px] h-[50px] mr-[20px] flex-shrink-0">
                            <Image
                                src={item.icon}
                                alt={item.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col text-left">
                            <div className="text-[16px] font-bold mb-[4px]">{item.title}</div>
                            <div className="text-[#555] text-[13px] font-medium whitespace-pre-line leading-[20px]">
                                {item.desc}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

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
                className="w-[400px] h-[400px] rounded-full blur-[100px] bg-[rgba(122,74,226,0.08)] absolute z-0 bottom-0 right-0"
            />
        </motion.div>
    );
}
