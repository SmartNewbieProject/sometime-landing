"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const promises = [
    {
        title: "투명한 소통",
        desc: "문제를 숨기지 않고\n함께 해결합니다",
        icon: "/images/send-letter.png", // Reusing existing icon
    },
    {
        title: "질 높은 매칭",
        desc: "알고리즘을 계속\n개선하고 있습니다",
        icon: "/images/heart-balloon.png", // Reusing existing icon
    },
    {
        title: "유저와 함께",
        desc: "여러분의 피드백으로\n매일 나아집니다",
        icon: "/images/heart-some.png", // Reusing existing icon
    },
];

export default function PromiseSection() {
    return (
        <div className="flex flex-col items-center justify-center font-wantedSans py-[140px] relative">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center z-10 mb-[80px]"
            >
                <div className="text-[#7A4AE2] text-[16px] font-semibold leading-[16px] mb-[20px]">
                    Our Promise
                </div>
                <div className="text-[32px] font-bold leading-[48px]">
                    우리의 약속
                </div>
            </motion.div>

            <div className="flex gap-[40px] z-10">
                {promises.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        whileHover={{ y: -10 }}
                        className="flex flex-col items-center bg-white rounded-[30px] p-[40px] shadow-lg border border-[#F0F0F0] w-[280px] h-[320px] justify-center"
                    >
                        <div className="mb-[30px] relative w-[80px] h-[80px]">
                            <Image
                                src={item.icon}
                                alt={item.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="text-[22px] font-bold mb-[16px]">{item.title}</div>
                        <div className="text-[#555] font-medium text-[16px] text-center whitespace-pre-line leading-[26px]">
                            {item.desc}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
