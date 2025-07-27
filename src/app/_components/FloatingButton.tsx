"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import GoApp from "./icon/GoApp";
import AuthIcon from "./icon/AuthIcon";
import XIcon from "./icon/XIcon";
import { deeplinkToApp } from "../_lib/utils";
import { useRouter } from "next/navigation";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const buttons = [
    { label: "앱으로 이동", id: 1, Icon: GoApp, onClick: () => deeplinkToApp("") },
    {
      label: "로그인 및 회원가입",
      id: 2,
      Icon: AuthIcon,
      onClick: () => router.push("https://some-in-univ.com/auth/login"),
    },
  ];

  return (
    <>
      {/* 오버레이 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end">
        {/* 메뉴 버튼들 */}
        <AnimatePresence>
          {isOpen &&
            buttons.map(({ label, id, Icon, onClick }, index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -(index + 1) * 75 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute flex  justify-end items-center gap-[12px] right-0"
              >
                <span className="mb-1 font-wantedSans text-[15px] leading-[23px] font-semibold text-white  whitespace-nowrap">
                  {label}
                </span>
                <button
                  onClick={onClick}
                  className="w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg bg-white"
                >
                  <Icon />
                </button>
              </motion.div>
            ))}
        </AnimatePresence>

        {/* 메인 버튼 */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg bg-[#7A4AE2]"
        >
          {isOpen ? <XIcon /> : <Image src={"/images/send-letter.png"} alt="플로팅 버튼" width={50} height={50} />}
        </motion.button>
      </div>
    </>
  );
};

export default FloatingButton;
