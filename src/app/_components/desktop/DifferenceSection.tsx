"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function DifferenceSection() {
    return (
        <div className="flex flex-col items-center justify-center font-wantedSans py-[140px] relative bg-[#FDFDFF]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center z-10"
            >
                <div className="text-[#7A4AE2] text-[16px] font-semibold leading-[16px] mb-[30px]">
                    Sometime is Different
                </div>

                <div className="text-[32px] font-bold leading-[48px] mb-[40px]">
                    썸타임은 다릅니다
                </div>

                <div className="text-[#555] text-[18px] leading-[32px] max-w-[800px]">
                    대부분의 데이팅 앱은 여러분이 앱에 오래 머물길 원합니다.
                    <br />
                    하지만 <span className="text-[#7A4AE2] font-bold">썸타임은 다릅니다.</span>
                    <br />
                    <br />
                    <span className="font-bold text-black text-[22px]">
                        좋은 인연을 만나 앱을 떠나는 것,
                        <br />
                        그게 저희가 원하는 성공입니다.
                    </span>
                    <br />
                    <br />
                    매칭 숫자가 아닌, <span className="font-bold text-black">한 분 한 분의 진짜 인연.</span>
                    <br />
                    그것이 썸타임이 추구하는 가치입니다.
                </div>
            </motion.div>

            <motion.div
                className="w-[600px] h-[600px] rounded-full blur-[120px] bg-[rgba(167,139,229,0.05)] absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    );
}
