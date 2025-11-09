"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ReactFullpage from "@fullpage/react-fullpage";
import { sendGTMEvent } from "@next/third-parties/google";
import * as amplitude from "@amplitude/analytics-browser";

interface MessageData {
  message: string;
  applicantName: string;
}

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

export default function MessagePage() {
  const params = useParams();
  const router = useRouter();
  const shortId = params.shortId as string;

  const [data, setData] = useState<MessageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/message/${shortId}`);

        if (!response.ok) {
          setError(true);
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch message:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (shortId) {
      fetchMessage();
    }
  }, [shortId]);

  const handleDownloadClick = (platform: string) => {
    amplitude.track("Click_Download", {
      platform,
      type: "Mobile",
      location: "Gift_Message_CTA",
    });
    sendGTMEvent({ event: "click_download", platform });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-pretendard">메시지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 font-pretendard">
            메시지를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-6 font-pretendard">
            유효하지 않은 링크이거나 만료된 메시지입니다.
          </p>
          <button
            onClick={() => router.push('/event')}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-all font-pretendard"
          >
            이벤트 페이지로 이동
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <ReactFullpage
      scrollingSpeed={700}
      licenseKey={process.env.NEXT_PUBLIC_FULLPAGE_LICENSE_KEY}
      credits={{
        enabled: false,
        label: "",
      }}
      anchors={["gift", "message", "about", "value", "features", "cta"]}
      render={() => {
        return (
          <div className="bg-white font-pretendard" id="fullpage-wrapper">
            {/* Section 1: Gift */}
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
                      animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -bottom-6 -right-6"
                    >
                      <Image
                        src="/images/send-letter.png"
                        alt="편지"
                        width={44}
                        height={44}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.p
                    className="text-[15px] text-gray-600 mb-4"
                    variants={fadeUp}
                  >
                    아래로 스크롤해서<br />
                    <span className="font-semibold text-[#7A4AE2]">따뜻한 마음</span>을 확인해보세요
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

            {/* Section 2: Message */}
            <div className="section bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 relative overflow-hidden">
              <div className="absolute top-20 left-5 w-24 h-24 bg-purple-300 rounded-full opacity-10 blur-2xl" />
              <div className="absolute bottom-10 right-5 w-36 h-36 bg-pink-300 rounded-full opacity-10 blur-2xl" />

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
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-100 relative mb-6"
                    variants={fadeUp}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
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
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
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

                      {/* 메시지 카드 */}
                      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 relative mt-4">
                        <div className="absolute top-3 left-3 text-3xl opacity-20">&ldquo;</div>
                        <div className="absolute bottom-3 right-3 text-3xl opacity-20 rotate-180">&rdquo;</div>
                        <p className="text-gray-800 text-[20px] leading-[1.8] whitespace-pre-wrap text-center relative z-10 font-nanum-pen">
                          {data.message}
                        </p>
                      </div>

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

            {/* Section 3: About */}
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

            {/* Section 4: Value */}
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
                    className="flex justify-center mb-4"
                    variants={fadeUp}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-32 h-32 sm:w-40 sm:h-40 relative"
                    >
                      <Image
                        src="/images/pick-some.png"
                        alt="썸타임 픽썸"
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-white/50 relative"
                    variants={fadeUp}
                  >
                    <div className="text-[14px] sm:text-[15px] leading-[1.7] sm:leading-[1.8] text-gray-800 space-y-2 sm:space-y-3">
                      <p className="font-semibold text-[15px] sm:text-[17px] text-purple-700">
                        썸타임은 단순한 소개팅 앱이 아니에요.
                      </p>
                      <p className="font-medium text-pink-700">
                        &ldquo;나를 이해하고, 나다운 매력을 찾는 시작점이에요.&rdquo;
                      </p>
                      <p>
                        사람은 자아가 선명한 사람에게 자연스럽게 끌린다죠?<br />
                        그래서 우리는 당신이 스스로를 더 잘 알고,<br />
                        당신만의 매력을 잃지 않도록 돕고 싶어요.
                      </p>
                      <p className="font-medium text-purple-700">
                        내가 어떤 사람인지 명확해질 때,<br />
                        그런 &lsquo;나&rsquo;를 진짜로 알아봐 줄 인연도 찾아오니까요.
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

            {/* Section 5: Features */}
            <div className="section bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-200 to-pink-200 opacity-30" />
              <div className="absolute top-0 left-20 w-1 h-full bg-gradient-to-b from-pink-200 to-purple-200 opacity-20" />
              <div className="absolute top-0 right-20 w-1 h-full bg-gradient-to-b from-purple-200 to-pink-200 opacity-20" />

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
                    <div className="w-28 h-28 sm:w-32 sm:h-32 relative">
                      <Image
                        src="/images/big-univ-verify.png"
                        alt="대학 인증"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </motion.div>

                  <motion.h2
                    className="text-[18px] sm:text-[20px] font-bold text-center mb-6 sm:mb-8 text-gray-900"
                    variants={fadeUp}
                  >
                    그래서 썸타임은 이렇게 운영돼요
                  </motion.h2>

                  <div className="space-y-4 sm:space-y-6">
                    <motion.div
                      className="flex items-start gap-3 sm:gap-4 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-100 shadow-md"
                      variants={fadeUp}
                    >
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center text-white text-[16px] sm:text-[18px] font-bold shadow-lg">
                        1
                      </div>
                      <div>
                        <h3 className="text-[15px] sm:text-[17px] font-semibold mb-1 sm:mb-2 text-gray-900">
                          같은 지역 대학생끼리
                        </h3>
                        <p className="text-[13px] sm:text-[15px] text-gray-700 leading-[1.6] sm:leading-[1.7]">
                          멀리 가지 않아도 괜찮아요.<br />
                          가까운 곳에서 자연스러운 연결을 만들어 드려요.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-3 sm:gap-4 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-pink-100 shadow-md"
                      variants={fadeUp}
                    >
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center text-white text-[16px] sm:text-[18px] font-bold shadow-lg">
                        2
                      </div>
                      <div>
                        <h3 className="text-[15px] sm:text-[17px] font-semibold mb-1 sm:mb-2 text-gray-900">
                          100% 대학생 인증
                        </h3>
                        <p className="text-[13px] sm:text-[15px] text-gray-700 leading-[1.6] sm:leading-[1.7]">
                          철저한 인증을 거친 진짜 대학생들만 매칭되니<br />
                          안심하고 시작하세요.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-3 sm:gap-4 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-100 shadow-md"
                      variants={fadeUp}
                    >
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-300 to-fuchsia-300 rounded-full flex items-center justify-center text-white text-[16px] sm:text-[18px] font-bold shadow-lg">
                        3
                      </div>
                      <div>
                        <h3 className="text-[15px] sm:text-[17px] font-semibold mb-1 sm:mb-2 text-gray-900">
                          온·오프라인을 넘나들며
                        </h3>
                        <p className="text-[13px] sm:text-[15px] text-gray-700 leading-[1.6] sm:leading-[1.7]">
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

            {/* Section 6: CTA */}
            <div className="section bg-gradient-to-br from-pink-100 via-purple-100 to-fuchsia-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-40 h-40 bg-pink-300 rounded-full opacity-30 blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-300 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-fuchsia-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              <div className="max-w-[440px] mx-auto px-5 h-full flex flex-col justify-center items-center relative z-10">
                <motion.div
                  className="text-center w-full"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={staggerContainer}
                >
                  {/* 로고 */}
                  <motion.div
                    className="mb-4 sm:mb-6"
                    variants={fadeUp}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 relative mx-auto">
                      <Image
                        src="/images/logo.png"
                        alt="썸타임 로고"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </motion.div>

                  {/* 메인 텍스트 */}
                  <motion.h2
                    className="text-[18px] sm:text-[22px] font-bold text-gray-900 mb-2 sm:mb-3 px-4"
                    variants={fadeUp}
                  >
                    후회 없는 대학 생활을 위한 첫걸음
                  </motion.h2>

                  <motion.p
                    className="text-[14px] sm:text-[16px] text-gray-700 mb-6 sm:mb-8 leading-[1.6] sm:leading-[1.7] px-4"
                    variants={fadeUp}
                  >
                    오늘 도착한 이 설렘,<br />
                    여기서 끝내긴 좀 아쉽지 않나요?<br />
                    <span className="font-semibold text-[#7A4AE2]">지금 썸타임을 시작하세요</span>
                  </motion.p>

                  {/* 앱 다운로드 버튼 */}
                  <motion.div
                    className="flex flex-col items-center gap-3 sm:gap-4"
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
                        width={160}
                        height={53}
                        alt="앱스토어 다운로드"
                        className="w-[160px] sm:w-[180px] h-auto"
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
                        width={160}
                        height={53}
                        alt="구글플레이 다운로드"
                        className="w-[160px] sm:w-[180px] h-auto"
                      />
                    </Link>
                  </motion.div>

                  {/* 추가 강조 문구 */}
                  <motion.p
                    className="text-[13px] sm:text-[14px] text-gray-600 mt-6 sm:mt-8 leading-[1.6] px-4"
                    variants={fadeUp}
                  >
                    우리 대학, 우리 지역에서 시작하는 진심 어린 만남<br />
                    <span className="font-semibold text-purple-700">썸타임에서 당신의 특별한 인연을 시작하세요</span>
                  </motion.p>

                  {/* 사업자 정보 */}
                  <motion.div
                    className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-300/50 px-4"
                    variants={fadeUp}
                  >
                    <div className="text-[10px] sm:text-[11px] text-gray-500 leading-[1.6] space-y-1">
                      <p>상호명: 스마트 뉴비 | 사업장 소재지: 대전광역시 서구 둔산중로 74번길 42, 4층 407호 | 대표: 대표명 | 사업자 등록번호: 제 2025-대전서구-0000호</p>
                      <p>문의번호: 010-8465-2476 | 이메일: notify@smartnewb.com | 사업자정보확인</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-2">
                        <a href="#" className="hover:underline">개인정보처리방침</a>
                        <span>|</span>
                        <a href="#" className="hover:underline">개인정보 수집 및 이용동의</a>
                        <span>|</span>
                        <a href="#" className="hover:underline">서비스 이용약관</a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -left-4 hidden sm:block"
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
                    className="absolute -bottom-4 -right-4 hidden sm:block"
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
