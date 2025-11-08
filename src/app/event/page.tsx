"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import * as amplitude from "@amplitude/analytics-browser";
import ReactFullpage from "@fullpage/react-fullpage";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function EventPage() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      window?.fullpage_api?.moveSectionDown();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDownloadClick = (platform: string) => {
    amplitude.track("Click_Download", {
      platform,
      type: "Mobile",
      location: "Event_CTA",
    });
    sendGTMEvent({ event: "click_download", platform });
  };

  return (
    <ReactFullpage
      scrollingSpeed={700}
      licenseKey={process.env.NEXT_PUBLIC_FULLPAGE_LICENSE_KEY}
      credits={{
        enabled: false,
        label: "",
      }}
      anchors={["gift", "intro", "about", "value", "features", "cta"]}
      render={() => {
        return (
          <div className="bg-white font-pretendard" id="fullpage-wrapper">
            <div className="section bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
              <div className="absolute top-10 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-3xl" />
              <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-3xl" />

              <div className="max-w-[440px] mx-auto px-5 h-full flex flex-col justify-center items-center relative z-10">
                <motion.div
                  className="text-center"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div
                    className="inline-block mb-4 px-4 py-2 bg-pink-100 rounded-full shadow-md"
                    variants={fadeUp}
                  >
                    <span className="text-[14px] font-semibold text-pink-600">11.11 빼빼로데이 특별 이벤트</span>
                  </motion.div>

                  <motion.h1
                    className="text-[24px] font-bold leading-[1.5] mb-6 px-2 text-gray-900"
                    variants={fadeUp}
                  >
                    누군가의 설레는 마음이<br />도착했습니다!
                  </motion.h1>

                  <motion.div
                    className="relative w-full max-w-[320px] mx-auto aspect-square mb-6"
                    variants={fadeUp}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl opacity-30 blur-xl" />
                    <Image
                      src="/images/pepero.jpg"
                      alt="빼빼로 선물"
                      fill
                      className="object-contain rounded-2xl relative z-10 shadow-2xl"
                      priority
                    />

                    <motion.div
                      animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-6 -left-6"
                    >
                      <Image
                        src="/images/heart.png"
                        alt="하트"
                        width={40}
                        height={40}
                      />
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, -12, 0], rotate: [0, -10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -bottom-6 -right-6"
                    >
                      <Image
                        src="/images/heart.png"
                        alt="하트"
                        width={35}
                        height={35}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.p
                    className="text-[14px] text-gray-600 italic"
                    variants={fadeUp}
                  >
                    당신을 위한 특별한 선물이 도착했어요 💌
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, 12, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => window?.fullpage_api?.moveSectionDown()}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-pink-600 opacity-70"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </div>


            <div className="section bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
              <div className="absolute top-20 left-5 w-24 h-24 bg-amber-300 rounded-full opacity-10 blur-2xl" />
              <div className="absolute bottom-10 right-5 w-36 h-36 bg-orange-300 rounded-full opacity-10 blur-2xl" />

              <div className="max-w-[440px] mx-auto px-5 h-full flex flex-col justify-center relative z-10">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={staggerContainer}
                >
                  <motion.div
                    className="flex justify-center mb-6"
                    variants={fadeUp}
                  >
                    <Image
                      src="/images/info-logo.png"
                      alt="썸타임 로고"
                      width={120}
                      height={40}
                    />
                  </motion.div>

                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-100 relative"
                    variants={fadeUp}
                  >
                    <motion.div
                      variants={floatVariants}
                      animate="animate"
                      whileHover={{ scale: 1.1 }}
                      className="absolute -top-4 -left-4"
                    >
                      <Image
                        src="/images/heart.png"
                        alt="하트 아이콘"
                        width={36}
                        height={36}
                      />
                    </motion.div>

                    <motion.div
                      variants={floatVariants}
                      animate="animate"
                      whileHover={{ scale: 1.1 }}
                      className="absolute -bottom-4 -right-4"
                    >
                      <Image
                        src="/images/send-letter.png"
                        alt="편지 아이콘"
                        width={38}
                        height={38}
                      />
                    </motion.div>

                    <div className="text-[15px] leading-[1.8] text-gray-800 space-y-3">
                      <p className="font-semibold text-[17px] text-[#7A4AE2]">
                        &ldquo;당신에게 꼭 주고 싶었대요&rdquo;
                      </p>
                      <p>
                        누군가 당신을 생각하며 신청한 빼빼로예요.<br />
                        직접 전하기엔 쑥스러웠는지, 저희 <span className="font-semibold text-[#7A4AE2]">썸타임</span>에게 대신 전달을 부탁하더라고요.
                      </p>
                      <p className="text-gray-600 text-[14px]">
                        (저희는 거들었을 뿐! 이 따뜻한 마음, 맛있게 즐겨주세요)
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, 12, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => window?.fullpage_api?.moveSectionDown()}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-700 opacity-70"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </div>


            <div className="section bg-gradient-to-br from-purple-50 via-pink-50 to-white relative overflow-hidden">
              <div className="absolute top-10 right-10 w-28 h-28 bg-pink-300 rounded-full opacity-15 blur-2xl" />
              <div className="absolute bottom-20 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-15 blur-2xl" />

              <div className="max-w-[440px] mx-auto px-5 h-full flex flex-col justify-center relative z-10">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={staggerContainer}
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    variants={fadeUp}
                  >
                    <Image
                      src="/images/logo.png"
                      alt="썸타임 로고"
                      width={60}
                      height={60}
                    />
                  </motion.div>

                  <motion.h2
                    className="text-[22px] font-bold text-center mb-6 text-gray-900"
                    variants={fadeUp}
                  >
                    그런데, 썸타임이 뭐냐구요?
                  </motion.h2>

                  <motion.div
                    className="text-[15px] leading-[1.8] text-gray-800 space-y-3 bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 shadow-lg relative"
                    variants={fadeUp}
                  >
                    <p className="font-semibold text-[17px] text-purple-700">
                      &ldquo;모든 대학생이 청춘을 후회 없이 보냈으면 좋겠다&rdquo;
                    </p>
                    <p>
                      저희는 이 한 마디에서 시작되었어요.
                    </p>
                    <p>
                      같은 대학생이었던 저희는 알고 있었거든요.<br />
                      대학 시절의 설렘과 만남이 얼마나 소중한지,<br />
                      그리고 그 빛나는 기회들을 놓치는 게 얼마나 아쉬운지요.
                    </p>

                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-3 -right-3"
                    >
                      <Image
                        src="/images/heart-balloon.png"
                        alt="하트 풍선"
                        width={40}
                        height={40}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, 12, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => window?.fullpage_api?.moveSectionDown()}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-600 opacity-70"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </div>


            <div className="section bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 relative overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-rose-300 rounded-full opacity-20 blur-xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-fuchsia-300 rounded-full opacity-20 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

              <div className="max-w-[440px] mx-auto px-5 h-full flex flex-col justify-center relative z-10">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={staggerContainer}
                >
                  <motion.div
                    className="flex justify-center mb-6"
                    variants={fadeUp}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Image
                        src="/images/pick-some.png"
                        alt="썸타임 픽썸"
                        width={300}
                        height={300}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 shadow-xl border-2 border-white/50 relative"
                    variants={fadeUp}
                  >
                    <div className="text-[15px] leading-[1.8] text-gray-800 space-y-3">
                      <p className="font-semibold text-[17px] text-purple-700">
                        단순한 소개팅 앱이 아니에요.
                      </p>
                      <p>
                        사람은 자아가 단단한 사람에게 본능적으로 끌린다고 하죠?<br />
                        썸타임은 당신이 스스로에 대해 더 깊이 생각하고,<br />
                        당신만의 가치관을 단단하게 만들 수 있도록 돕고 싶어요.
                      </p>
                      <p className="font-medium text-pink-700">
                        내가 나를 잘 알 때 가장 나다운 매력이 빛나고,<br />
                        그런 당신을 알아봐 줄 진짜 인연도 찾아오는 법이니까요.
                      </p>
                    </div>

                    <motion.div
                      animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-4 -left-4"
                    >
                      <Image
                        src="/images/heart.png"
                        alt="하트"
                        width={30}
                        height={30}
                      />
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -bottom-4 -right-4"
                    >
                      <Image
                        src="/images/heart.png"
                        alt="하트"
                        width={30}
                        height={30}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, 12, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => window?.fullpage_api?.moveSectionDown()}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-pink-600 opacity-70"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </div>


            <div className="section bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-amber-200 to-orange-200 opacity-30" />
              <div className="absolute top-0 left-20 w-1 h-full bg-gradient-to-b from-yellow-200 to-amber-200 opacity-20" />
              <div className="absolute top-0 right-20 w-1 h-full bg-gradient-to-b from-orange-200 to-amber-200 opacity-20" />

              <div className="max-w-[440px] mx-auto px-5 h-full flex flex-col justify-center relative z-10">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={staggerContainer}
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    variants={fadeUp}
                  >
                    <Image
                      src="/images/big-univ-verify.png"
                      alt="대학 인증"
                      width={200}
                      height={200}
                    />
                  </motion.div>

                  <motion.h2
                    className="text-[22px] font-bold text-center mb-8 text-gray-900"
                    variants={fadeUp}
                  >
                    그래서 썸타임은 이렇게 운영돼요
                  </motion.h2>

                  <div className="space-y-6">
                    <motion.div
                      className="flex items-start gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-orange-100 shadow-md"
                      variants={fadeUp}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-[18px] font-bold shadow-lg">
                        1
                      </div>
                      <div>
                        <h3 className="text-[18px] font-semibold mb-2 text-gray-900">
                          같은 지역 대학생끼리
                        </h3>
                        <p className="text-[15px] text-gray-700 leading-[1.7]">
                          멀리 가지 않아도 괜찮아요.<br />
                          가까운 곳에서 자연스러운 연결을 만들어 드려요.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-amber-100 shadow-md"
                      variants={fadeUp}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-[18px] font-bold shadow-lg">
                        2
                      </div>
                      <div>
                        <h3 className="text-[18px] font-semibold mb-2 text-gray-900">
                          100% 대학생 인증
                        </h3>
                        <p className="text-[15px] text-gray-700 leading-[1.7]">
                          철저한 인증을 거친 진짜 대학생들만 매칭되니<br />
                          안심하고 시작하세요.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-yellow-100 shadow-md"
                      variants={fadeUp}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-[18px] font-bold shadow-lg">
                        3
                      </div>
                      <div>
                        <h3 className="text-[18px] font-semibold mb-2 text-gray-900">
                          온·오프라인을 넘나들며
                        </h3>
                        <p className="text-[15px] text-gray-700 leading-[1.7]">
                          단순한 만남을 넘어, 대학생 여러분의 더 나은 청춘을<br />
                          응원하는 든든한 동반자가 될게요!
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, 12, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => window?.fullpage_api?.moveSectionDown()}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-orange-600 opacity-70"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </div>


            <div className="section bg-gradient-to-br from-pink-100 via-purple-100 to-fuchsia-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-40 h-40 bg-pink-300 rounded-full opacity-30 blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-300 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-fuchsia-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              <div className="max-w-[440px] mx-auto px-5 h-full flex flex-col justify-center items-center relative z-10">
                <motion.div
                  className="text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={staggerContainer}
                >
                  <motion.div
                    className="mb-6"
                    variants={fadeUp}
                  >
                    <Image
                      src="/images/logo.png"
                      alt="썸타임 로고"
                      width={80}
                      height={80}
                      className="mx-auto"
                    />
                  </motion.div>

                  <motion.h2
                    className="text-[22px] font-bold text-gray-900 mb-3"
                    variants={fadeUp}
                  >
                    후회 없는 청춘을 위한 첫걸음
                  </motion.h2>

                  <motion.p
                    className="text-[16px] text-gray-700 mb-8 leading-[1.7]"
                    variants={fadeUp}
                  >
                    오늘 도착한 이 설렘,<br />
                    여기서 끝내긴 좀 아쉽지 않나요?<br />
                    <span className="font-semibold text-[#7A4AE2]">지금 썸타임을 시작하세요</span>
                  </motion.p>

                  <motion.div
                    className="flex flex-col items-center gap-3"
                    variants={fadeUp}
                  >
                    <Link
                      href="https://apps.apple.com/kr/app/썸타임-지역-대학생-소개팅/id6746120889"
                      target="_blank"
                      onClick={() => handleDownloadClick("app_store")}
                      className="transform hover:scale-105 transition-transform"
                    >
                      <Image
                        src="/images/app-store.png"
                        width={140}
                        height={50}
                        alt="앱스토어 다운로드"
                      />
                    </Link>
                    <Link
                      href="https://play.google.com/store/apps/details?id=com.smartnewb.sometimes"
                      target="_blank"
                      onClick={() => handleDownloadClick("google_play")}
                      className="transform hover:scale-105 transition-transform"
                    >
                      <Image
                        src="/images/google-play.png"
                        width={140}
                        height={50}
                        alt="구글플레이 다운로드"
                      />
                    </Link>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-8 -left-8"
                  >
                    <Image
                      src="/images/heart-balloon.png"
                      alt="하트 풍선"
                      width={50}
                      height={50}
                    />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-8 -right-8"
                  >
                    <Image
                      src="/images/heart-arrow.png"
                      alt="하트 화살"
                      width={60}
                      height={60}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

