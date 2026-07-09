"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Easing } from "framer-motion";
import { floatVariants } from "@/app/_lib/motion";
import TopSection from "../desktop/TopSection";
import { ContentCard } from "./ContentCard";
import { ContentMedia } from "./ContentMedia";

export type ContentPreview = {
  id: string;
  href: string;
  title: string;
  description: string;
  image: string;
  label: string;
  meta?: string;
  source: "story" | "card-news" | "community";
  score?: number;
};

const sourceLabels: Record<ContentPreview["source"], string> = {
  story: "스토리",
  "card-news": "카드뉴스",
  community: "커뮤니티",
};

const categories = ["전체", "연애 고민", "소개팅 팁", "캠퍼스 라이프", "학교 인증"] as const;
type Category = (typeof categories)[number];

const easeOut: Easing = "easeOut";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

const fadeUpStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.22, ease: easeOut },
  },
};

/** CTA mockup 보조 요소 — phone과 살짝 위상 차이 */
const floatDelayedVariants = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 2.4,
      delay: 0.45,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
    },
  },
};

function sortByScore(items: ContentPreview[]) {
  return [...items].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

/** 클라이언트 카테고리 매칭 — API 필터 전 임시. label/제목/설명 키워드 기반 */
function matchesCategory(item: ContentPreview, category: Category) {
  if (category === "전체") return true;

  const haystack = [item.label, item.title, item.description]
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, "");

  const needle = category.toLowerCase().replace(/\s+/g, "");
  if (haystack.includes(needle)) return true;

  // 짧은 별칭 (API 카테고리 표기 차이 흡수)
  const aliases: Record<Exclude<Category, "전체">, string[]> = {
    "연애 고민": ["연애고민", "연애", "고민", "love"],
    "소개팅 팁": ["소개팅팁", "소개팅", "팁", "dating"],
    "캠퍼스 라이프": ["캠퍼스라이프", "캠퍼스", "대학", "학교생활"],
    "학교 인증": ["학교인증", "인증", "univ", "verify"],
  };

  return aliases[category].some((alias) => haystack.includes(alias));
}

function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={{
        hidden: fadeUp.hidden,
        visible: {
          ...fadeUp.visible,
          transition: { duration: 0.55, ease: easeOut, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ContentHome({
  activeSource,
  eyebrow,
  title,
  description,
  items,
  allItems,
  cardNewsItems,
}: {
  activeSource: ContentPreview["source"];
  eyebrow: string;
  title: string;
  description: string;
  items: ContentPreview[];
  allItems: ContentPreview[];
  cardNewsItems: ContentPreview[];
}) {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");
  const rankingItems = useMemo(() => sortByScore(allItems).slice(0, 5), [allItems]);
  const [rankingPreviewId, setRankingPreviewId] = useState<string | null>(null);

  // 랭킹 목록이 바뀌면 프리뷰 기본값을 1위로 유지
  useEffect(() => {
    if (rankingItems.length === 0) {
      setRankingPreviewId(null);
      return;
    }
    setRankingPreviewId((prev) => {
      if (prev && rankingItems.some((item) => `${item.source}-${item.id}` === prev)) {
        return prev;
      }
      return `${rankingItems[0].source}-${rankingItems[0].id}`;
    });
  }, [rankingItems]);

  const filteredItems = useMemo(
    () => items.filter((item) => matchesCategory(item, activeCategory)),
    [items, activeCategory],
  );

  const featured = filteredItems[0] ?? (activeCategory === "전체" ? allItems[0] : undefined);
  const gridItems = filteredItems.filter((item) => item.id !== featured?.id);
  const railItems = cardNewsItems.slice(0, 4);

  const rankingPreview =
    rankingItems.find((item) => `${item.source}-${item.id}` === rankingPreviewId) ??
    rankingItems[0];

  return (
    <>
      <TopSection />

      {/* Hero + category chips + featured */}
      <section className="bg-white px-[24px] pb-[72px] pt-[74px]">
        <div className="mx-auto max-w-[1280px]">
          <FadeUp className="text-center">
            <p className="mb-[18px] text-[16px] font-semibold leading-[16px] text-[#7A4AE2]">
              {eyebrow}
            </p>
            <h1 className="text-[34px] font-bold leading-[46px] text-black sm:text-[40px] sm:leading-[56px]">
              {title}
            </h1>
            <p className="mx-auto mt-[22px] max-w-[720px] text-[17px] font-medium leading-[31px] text-[#555]">
              {description}
            </p>
          </FadeUp>

          <FadeUp className="mt-[34px] flex flex-wrap justify-center gap-[10px]" delay={0.08}>
            {categories.map((category) => {
              const selected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={selected}
                  className={
                    selected
                      ? "rounded-[18px] bg-[#7A4AE2] px-[18px] py-[10px] text-[14px] font-semibold text-white transition duration-200"
                      : "rounded-[18px] border border-[#EEE8FF] bg-[#FCFAFF] px-[18px] py-[10px] text-[14px] font-semibold text-[#555] transition duration-200 hover:border-[#D4C6F5] hover:text-[#7A4AE2]"
                  }
                >
                  {category}
                </button>
              );
            })}
          </FadeUp>

          <AnimatePresence mode="wait">
            {featured ? (
              <motion.div
                key={`${featured.source}-${featured.id}-${activeCategory}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease: easeOut }}
              >
                <Link
                  href={featured.href}
                  className="group mt-[54px] grid overflow-hidden rounded-[30px] border border-[#EEE8FF] bg-[#FCFAFF] shadow-[0_18px_60px_rgba(122,74,226,0.10)] transition duration-300 hover:-translate-y-1 sm:grid-cols-[1.05fr_0.95fr]"
                >
                  {/* Featured image + hover zoom + CTA slide-up */}
                  <div className="relative min-h-[260px] overflow-hidden bg-[#F4F0FF] sm:min-h-[360px]">
                    <ContentMedia
                      src={featured.image}
                      seed={featured.id}
                      priority
                      className="object-cover transition duration-500 ease-out group-hover:scale-105"
                      sizes="(min-width: 900px) 460px, 100vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-3 justify-center pb-5 opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="rounded-[30px] bg-[#7A4AE2] px-[22px] py-[12px] text-[14px] font-semibold text-white shadow-[0_10px_28px_rgba(122,74,226,0.35)]">
                        읽어보기
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-[28px] sm:p-[38px]">
                    <div className="mb-[18px] flex flex-wrap gap-[8px]">
                      <span className="rounded-[14px] bg-[#7A4AE2] px-[12px] py-[7px] text-[12px] font-semibold text-white">
                        대표 콘텐츠
                      </span>
                      <span className="rounded-[14px] bg-white px-[12px] py-[7px] text-[12px] font-semibold text-[#7A4AE2]">
                        {sourceLabels[featured.source]}
                      </span>
                    </div>
                    <h2 className="text-[28px] font-bold leading-[38px] text-black">
                      {featured.title}
                    </h2>
                    <p className="mt-[16px] line-clamp-3 text-[15px] font-medium leading-[27px] text-[#666]">
                      {featured.description}
                    </p>
                    {featured.meta ? (
                      <p className="mt-[22px] text-[13px] font-semibold text-[#9B8EBD]">
                        {featured.meta}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </motion.div>
            ) : (
              <motion.p
                key={`empty-${activeCategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-[54px] rounded-[24px] border border-dashed border-[#E4DBF7] bg-[#FCFAFF] px-6 py-12 text-center text-[15px] font-medium text-[#888]"
              >
                이 카테고리에 해당하는 콘텐츠가 아직 없어요.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Feed + ranking — 넓은 컨테이너, PC 4열 그리드 */}
      <section className="bg-[#FCFAFF] px-[24px] py-[86px]">
        <div className="mx-auto max-w-[1280px]">
          <FadeUp className="mb-[28px] flex items-end justify-between gap-[18px]">
            <div>
              <p className="text-[15px] font-semibold leading-[16px] text-[#7A4AE2]">
                {sourceLabels[activeSource]}
              </p>
              <h2 className="mt-[10px] text-[28px] font-bold leading-[38px] text-black">
                새로 올라온 이야기
              </h2>
            </div>
            <Link
              href="https://some-in-univ.com"
              className="shrink-0 text-[14px] font-semibold text-[#7A4AE2]"
            >
              앱에서 이어보기
            </Link>
          </FadeUp>

          {/* 인기 랭킹: PC에서 좌 미리보기 + 우 리스트 (그리드 폭 침범 X) */}
          {rankingItems.length > 0 ? (
            <FadeUp className="mb-[34px]" delay={0.04}>
              <div className="overflow-hidden rounded-[28px] border border-[#EEE8FF] bg-white lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                {rankingPreview ? (
                  <Link
                    href={rankingPreview.href}
                    className="group relative hidden min-h-[240px] overflow-hidden lg:block"
                  >
                    <div className="absolute inset-0 bg-[#F4F0FF]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${rankingPreview.source}-${rankingPreview.id}`}
                          initial={{ opacity: 0, scale: 1.03 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.99 }}
                          transition={{ duration: 0.28, ease: easeOut }}
                          className="absolute inset-0"
                        >
                          <ContentMedia
                            src={rankingPreview.image}
                            seed={rankingPreview.id}
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(min-width: 1280px) 680px, 50vw"
                          />
                        </motion.div>
                      </AnimatePresence>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-[12px] font-semibold text-white/80">
                          인기 이야기 미리보기
                        </p>
                        <AnimatePresence mode="wait">
                          <motion.h3
                            key={`title-${rankingPreview.source}-${rankingPreview.id}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: easeOut }}
                            className="mt-1 line-clamp-2 text-[22px] font-bold leading-[30px] text-white"
                          >
                            {rankingPreview.title}
                          </motion.h3>
                        </AnimatePresence>
                      </div>
                    </div>
                  </Link>
                ) : null}

                <div className="p-[22px] sm:p-[26px]">
                  <p className="text-[15px] font-semibold leading-[16px] text-[#7A4AE2]">
                    실시간 인기 이야기
                  </p>
                  <div className="mt-[18px] flex flex-col gap-[4px]">
                    {rankingItems.map((item, index) => {
                      const itemKey = `${item.source}-${item.id}`;
                      const isActive = rankingPreviewId === itemKey;
                      return (
                        <Link
                          key={itemKey}
                          href={item.href}
                          onMouseEnter={() => setRankingPreviewId(itemKey)}
                          onFocus={() => setRankingPreviewId(itemKey)}
                          className={
                            isActive
                              ? "grid grid-cols-[28px_1fr] gap-[12px] rounded-[16px] bg-[#F4F0FF] px-2 py-2.5 transition duration-200"
                              : "grid grid-cols-[28px_1fr] gap-[12px] rounded-[16px] px-2 py-2.5 transition duration-200 hover:bg-[#FCFAFF]"
                          }
                        >
                          <span
                            className={
                              isActive
                                ? "text-[20px] font-bold leading-[28px] text-[#7A4AE2]"
                                : "text-[20px] font-bold leading-[28px] text-[#C8B8F4]"
                            }
                          >
                            {index + 1}
                          </span>
                          <span>
                            <span
                              className={
                                isActive
                                  ? "line-clamp-2 text-[14px] font-semibold leading-[22px] text-[#5B35B5]"
                                  : "line-clamp-2 text-[14px] font-semibold leading-[22px] text-black"
                              }
                            >
                              {item.title}
                            </span>
                            <span className="mt-[3px] block text-[12px] font-medium leading-[18px] text-[#888]">
                              {sourceLabels[item.source]} · {item.score ?? 0}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </FadeUp>
          ) : null}

          {/* 카드 그리드: 모바일 1 / 태블릿 2 / PC 4 */}
          <motion.div
            className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[20px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={fadeUpStagger}
          >
            <AnimatePresence mode="popLayout">
              {gridItems.map((item) => (
                <motion.div
                  key={`${item.source}-${item.id}`}
                  layout
                  variants={cardItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="min-w-0"
                >
                  <ContentCard
                    href={item.href}
                    image={item.image}
                    label={item.label}
                    title={item.title}
                    description={item.description}
                    meta={item.meta}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {gridItems.length === 0 && featured ? (
            <p className="mt-4 text-[14px] font-medium text-[#999]">
              이 카테고리의 다른 이야기는 곧 업데이트될 예정이에요.
            </p>
          ) : null}
        </div>
      </section>

      {/* Card news — mobile horizontal swipe rail, desktop grid */}
      {railItems.length > 0 ? (
        <section className="bg-white py-[86px]">
          <div className="mx-auto max-w-[1280px]">
            <FadeUp className="mb-[28px] flex items-end justify-between gap-[18px] px-[24px] lg:px-0">
              <div>
                <p className="text-[15px] font-semibold leading-[16px] text-[#7A4AE2]">
                  CARD NEWS
                </p>
                <h2 className="mt-[10px] text-[28px] font-bold leading-[38px] text-black">
                  가볍게 넘겨보는 썸타임 소식
                </h2>
              </div>
              <Link
                href="/card-news"
                className="shrink-0 text-[14px] font-semibold text-[#7A4AE2]"
              >
                전체 보기
              </Link>
            </FadeUp>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUpStagger}
              className="flex gap-[14px] overflow-x-auto px-[24px] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-[18px] lg:overflow-visible lg:px-0 lg:pb-0 lg:snap-none [&::-webkit-scrollbar]:hidden"
            >
              {railItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardItem}
                  className="w-[72%] max-w-[280px] shrink-0 snap-start lg:w-auto lg:max-w-none lg:shrink"
                >
                  <Link
                    href={item.href}
                    className="group block h-full overflow-hidden rounded-[24px] border border-[#EEE8FF] bg-[#FCFAFF] transition duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F0FF]">
                      <ContentMedia
                        src={item.image}
                        seed={item.id}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(min-width: 900px) 210px, 72vw"
                      />
                    </div>
                    <div className="p-[16px]">
                      <p className="line-clamp-2 text-[14px] font-semibold leading-[22px] text-black">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* App CTA */}
      <section className="scroll-mt-[112px] bg-white px-[24px] pb-[100px] pt-[24px]">
        <FadeUp>
          <div className="relative mx-auto max-w-[900px] overflow-hidden rounded-[32px] bg-[#7A4AE2] px-[28px] py-[34px] shadow-[0_24px_70px_rgba(122,74,226,0.22)] sm:px-[46px] sm:py-[46px]">
            <div className="pointer-events-none absolute right-[-90px] top-[-130px] h-[280px] w-[280px] rounded-full bg-white/15 blur-[8px]" />
            <div className="pointer-events-none absolute bottom-[-150px] left-[32%] h-[260px] w-[260px] rounded-full bg-[#FDC5EB]/25 blur-[14px]" />
            <div className="pointer-events-none absolute left-[22px] top-[26px] h-[1px] w-[120px] bg-white/35" />

            <div className="relative z-10 grid gap-[32px] md:grid-cols-[minmax(0,1fr)_310px] md:items-center">
              <div>
                <p className="text-[14px] font-semibold leading-[16px] text-[#E6DBFF]">
                  SOMETIME APP
                </p>
                <h2 className="mt-[14px] max-w-[520px] text-[30px] font-bold leading-[42px] text-white sm:text-[34px] sm:leading-[48px]">
                  읽은 이야기가
                  <br />
                  새로운 인연으로 이어지도록
                </h2>
                <p className="mt-[18px] max-w-[520px] text-[15px] font-medium leading-[29px] text-[#E6DBFF] sm:text-[16px] sm:leading-[30px]">
                  학교 인증으로 안전하게, 취향으로 자연스럽게. 콘텐츠에서 발견한 관심사를
                  썸타임 앱에서 더 깊은 대화로 이어가세요.
                </p>

                <div className="mt-[28px] flex flex-wrap items-center gap-[12px]">
                  <Link
                    href="https://apps.apple.com/kr/app/썸타임-지역-대학생-소개팅/id6746120889"
                    target="_blank"
                    className="transition duration-300 hover:-translate-y-0.5"
                  >
                    <Image
                      src="/images/big-app-store.png"
                      alt="App Store"
                      width={491}
                      height={150}
                      className="h-auto w-[142px] sm:w-[156px]"
                    />
                  </Link>
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.smartnewb.sometimes"
                    target="_blank"
                    className="transition duration-300 hover:-translate-y-0.5"
                  >
                    <Image
                      src="/images/big-google-play.png"
                      alt="Google Play"
                      width={491}
                      height={150}
                      className="h-auto w-[142px] sm:w-[156px]"
                    />
                  </Link>
                </div>

                <div className="mt-[26px] flex flex-wrap gap-[10px] text-[13px] font-medium text-white/80">
                  {["학교 인증", "취향 매칭", "캠퍼스 이야기"].map((item) => (
                    <span
                      key={item}
                      className="rounded-[18px] border border-white/18 bg-white/10 px-[13px] py-[8px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[268px]">
                <motion.div
                  variants={floatVariants}
                  animate="animate"
                  className="absolute right-[4px] top-[2px] w-[246px] rounded-[28px] border border-white/30 bg-white/92 p-[12px] shadow-[0_24px_54px_rgba(38,21,84,0.26)] sm:right-[18px] md:right-0"
                >
                  <div className="relative h-[138px] overflow-hidden rounded-[22px] bg-[#F7F2FF]">
                    <ContentMedia
                      src={featured?.image ?? "/images/intro1.png"}
                      seed={featured?.id ?? "cta"}
                      className="object-cover"
                      sizes="246px"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-[64px] bg-gradient-to-t from-black/45 to-transparent" />
                    <span className="absolute bottom-[12px] left-[12px] rounded-[14px] bg-white/90 px-[10px] py-[6px] text-[11px] font-semibold text-[#7A4AE2]">
                      오늘의 이야기
                    </span>
                  </div>
                  <div className="px-[4px] pb-[3px] pt-[14px]">
                    <p className="line-clamp-2 text-[17px] font-bold leading-[25px] text-black">
                      {featured?.title ?? "캠퍼스에서 시작되는 이야기"}
                    </p>
                    <p className="mt-[7px] line-clamp-2 text-[12px] font-medium leading-[20px] text-[#6F6B79]">
                      {featured?.description ??
                        "익숙한 하루의 작은 관심사가 누군가와 이어지는 순간을 만나보세요."}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={floatDelayedVariants}
                  animate="animate"
                  className="absolute left-[2px] top-[38px] hidden w-[148px] rounded-[24px] border border-white/30 bg-white/88 px-[16px] py-[14px] shadow-[0_18px_38px_rgba(38,21,84,0.20)] backdrop-blur sm:block"
                >
                  <p className="text-[12px] font-semibold text-[#7A4AE2]">인연 시작</p>
                  <p className="mt-[7px] text-[20px] font-bold leading-[24px] text-black">+23</p>
                  <p className="mt-[5px] text-[11px] font-medium leading-[17px] text-[#7B7487]">
                    오늘 앱에서 이어진 캠퍼스 대화
                  </p>
                </motion.div>

                <motion.div
                  variants={floatDelayedVariants}
                  animate="animate"
                  className="absolute bottom-[12px] left-[58px] hidden items-center gap-[10px] rounded-[24px] border border-white/30 bg-white/90 px-[15px] py-[12px] shadow-[0_18px_36px_rgba(38,21,84,0.18)] sm:flex"
                >
                  <Image
                    src="/images/heart-balloon.png"
                    alt=""
                    width={38}
                    height={38}
                  />
                  <div>
                    <p className="text-[12px] font-semibold text-black">학교 인증 완료</p>
                    <p className="mt-[3px] text-[11px] font-medium text-[#7B7487]">안전한 만남만</p>
                  </div>
                </motion.div>
                <motion.div
                  variants={floatVariants}
                  animate="animate"
                  className="absolute bottom-[48px] right-[10px] hidden sm:block"
                >
                  <Image
                    src="/images/send-letter.png"
                    alt=""
                    width={74}
                    height={74}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
