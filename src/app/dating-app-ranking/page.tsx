import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../_components/public-content/JsonLd";
import { ContentShell } from "../_components/public-content/ContentShell";
import { READING_BODY, READING_H2, READING_H3, READING_LINK, READING_MUTED } from "../_components/public-content/reading-styles";
import { StoreInstallCta } from "../_components/public-content/StoreInstallCta";
import {
  CHART_SIZE,
  formatCount,
  formatKstDate,
  getRankingSnapshot,
  type RankedApp,
  SOMETIME_APP_ID,
} from "../_lib/dating-app-ranking";
import { getReviewSummary } from "../_lib/public-reviews";
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata, SITE_NAME } from "../_lib/seo";
import { Reveal } from "./Reveal";
import styles from "./ranking.module.css";

const PATH = "/dating-app-ranking";
const TITLE = "소개팅 어플 순위·추천 | 대학생 소개팅 앱 비교";
const H1 = "소개팅 어플 순위, 대학생이라면 이렇게 골라요";
const DESCRIPTION =
  "소개팅 어플 6개를 오늘 App Store 순위·평점·평가 수로 나란히 비교했어요. 대학생이 소개팅 앱을 고르기 전에 볼 6가지와 앱별로 잘 맞는 사람까지 정리했어요. 순위는 매일 다시 읽어요.";

// 차트·평점은 하루에도 바뀐다. 6시간마다 다시 읽고, 실패하면 이전 페이지를 유지한다.
export const revalidate = 21600;

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: ["소개팅 어플 순위", "소개팅 어플 추천", "소개팅 앱 순위", "소개팅 앱 추천", "대학생 소개팅 앱", "소개팅 사이트", "무료 소개팅 어플"],
});

/** 각 앱의 App Store 소개 문구에서 그 앱이 스스로 내건 점만 옮겼다(2026-11-17 확인). 평가·순위 판단은 넣지 않는다. */
const FIT: Record<string, { who: string; basis: string }> = {
  [SOMETIME_APP_ID]: {
    who: "아는 사람에게 내 프로필이 보이는 게 걱정되는 대학생",
    basis: "학교 인증, 같은 학교·학과 제외와 지인 차단으로 노출 범위를 고를 수 있어요. 금·토 저녁 2:2 미팅도 있어요.",
  },
  "1661759931": { who: "사진을 먼저 올리기 부담스러운 대학생", basis: "앱 소개에 “사진 없이 시작하는 대학생 소개팅, 미팅 앱”이라고 적혀 있어요." },
  "6444236865": { who: "여럿이 만나는 미팅을 원하는 대학생", basis: "앱 소개에 혼자서도 참여하는 “오픈 미팅”과 다른 학교·전공 친구 만나기를 내걸어요." },
  "1261209014": { who: "동네에서 가볍게 친구부터 만나고 싶은 사람", basis: "앱 소개에 “우리동네 여사친, 남사친을 찾는 가장 빠른 방법”이라고 적혀 있어요." },
  "1058232900": { who: "연애와 결혼까지 생각하는 진지한 만남을 원하는 사람", basis: "앱 소개에 결혼까지 고려하는 인연과 AI·사람 삼중 검증을 내걸어요." },
  "1191259452": { who: "직장이나 학교 인증을 중요하게 보는 직장인", basis: "앱 소개에 직장 또는 학교 인증 소개팅 앱이자 직장인 익명 커뮤니티라고 적혀 있어요." },
};

const CRITERIA = [
  { title: "누구를 만나는 앱인가", body: "대학생, 직장인, 동네 친구처럼 앱마다 모이는 사람이 달라요. 앱 이름과 소개 문구에 대상이 적혀 있어요.", sometime: "학교 인증을 마친 대학생끼리 만나요." },
  { title: "인증은 어떻게 하나", body: "인증이 없거나 느슨하면 나이·학교를 속인 사람을 거르기 어려워요. 인증 방식과 인증 표시가 프로필에 보이는지 확인해요.", sometime: "학교 이메일 또는 학생증·재학증명서로 인증하고, 인증 전에는 프로필이 보이지 않아요." },
  { title: "아는 사람에게 보이지 않나", body: "같은 학교 사람이 많은 대학생에게 가장 큰 걱정이에요. 학교·학과 제외나 연락처 차단 기능이 있는지 봐요.", sometime: "같은 학교·학과 제외와 연락처 기반 지인 차단을 쓸 수 있어요." },
  { title: "사진은 언제 공개되나", body: "처음부터 사진을 다 보여 주는 앱이 있고, 대화가 이어진 뒤 공개하는 앱도 있어요. 내가 편한 방식을 고르면 돼요.", sometime: null },
  { title: "돈은 언제 드나", body: "무료로 시작해도 메시지·매칭에서 비용이 드는 경우가 많아요. 무엇에 비용이 드는지 가입 전에 앱 안내를 확인해요.", sometime: "무료로 시작할 수 있고 일부 기능은 유료예요. 비용은 쓰기 전에 앱에서 보여 줘요." },
  { title: "써 본 사람들의 평가", body: "평점만 보지 말고 평가 수와 최근 후기를 같이 봐요. 평가 수가 적으면 몇 명의 의견으로 평점이 크게 흔들려요.", sometime: "App Store·Google Play 후기와 썸타임에서 만난 사람들의 이야기를 후기 페이지에 모아 뒀어요." },
];

const RELATED = [
  { label: "썸타임 후기", href: "/reviews" },
  { label: "대학생 미팅", href: "/college-meeting" },
  { label: "학교 인증 안내", href: "/verification" },
  { label: "연픽과 썸타임 비교", href: "/blog/yeonpick-vs-sometime" },
  { label: "클럽트웬티와 썸타임 비교", href: "/blog/clubtwenty-vs-sometime" },
  { label: "자주 묻는 질문", href: "/faq" },
];

const rankLabel = (app: RankedApp) => (app.chartRank === null ? `${CHART_SIZE}위 밖` : `${app.chartRank}위`);

export default async function DatingAppRankingPage() {
  const [snapshot, summary] = await Promise.all([getRankingSnapshot(), getReviewSummary()]);
  const date = formatKstDate(snapshot.checkedAt);
  const leaderIsUs = snapshot.collegeLeader?.id === SOMETIME_APP_ID;
  const sometime = snapshot.apps.find((a) => a.id === SOMETIME_APP_ID)!;

  return (
    <ContentShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: TITLE,
            description: DESCRIPTION,
            url: absoluteUrl(PATH),
            inLanguage: "ko-KR",
            dateModified: snapshot.checkedAt,
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
          },
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "소개팅 어플 순위", path: PATH },
          ]),
        ]}
      />

      {/* 1. Wrapped 식 첫 화면 */}
      <section className={styles.hero} aria-labelledby="ranking-title">
        <div className={styles.wipe} aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1040px] px-6 pb-16 pt-12 sm:px-10 sm:pb-24 sm:pt-16">
          <p className={`text-[15px] font-semibold text-[#B0B8C1]`}>썸타임이 만든 비교 · {date} 기준</p>
          <h1 id="ranking-title" className={`mt-3 max-w-[760px] font-wantedSans text-[30px] font-extrabold leading-[1.3] tracking-[-0.03em] sm:text-[44px]`}>
            {H1}
          </h1>

          {leaderIsUs ? (
            <div className="mt-10 flex flex-col gap-6 sm:mt-14 sm:flex-row sm:items-end sm:gap-10">
              <p className={`font-wantedSans ${styles.bigNumber}`} aria-hidden="true">1</p>
              <div className="pb-2">
                <p className={`font-wantedSans text-[28px] font-extrabold leading-[1.3] tracking-[-0.03em] sm:text-[38px] ${styles.rise} ${styles.rise2}`}>
                  대학생 소개팅 앱 중<br />오늘 App Store 순위 1위
                </p>
                <p className={`mt-4 max-w-[520px] text-[15px] leading-[1.7] text-[#B0B8C1] ${styles.rise} ${styles.rise3}`}>
                  {date} App Store 소셜 네트워킹 무료 차트에서 썸타임은 {sometime.chartRank}위예요. 차트 상위 {CHART_SIZE}개 중 이름에 “대학생”을 내건 앱 가운데 가장 높아요.
                </p>
              </div>
            </div>
          ) : (
            <p className={`mt-8 max-w-[620px] text-[18px] leading-[1.75] text-[#D1D6DB] ${styles.rise} ${styles.rise2}`}>
              오늘 App Store 순위와 평점으로 소개팅 어플 6개를 나란히 놓았어요. 순위는 매일 다시 읽어요.
            </p>
          )}
        </div>

        <div className={`${styles.statBand} relative`}>
          <dl className="mx-auto grid w-full max-w-[1040px] grid-cols-3 gap-4 px-6 py-7 sm:px-10">
            {[
              { k: "App Store 평점", v: `${sometime.rating.toFixed(1)}점`, s: `평가 ${formatCount(sometime.ratingCount)}개` },
              { k: "Google Play 평점", v: `${summary.playStore.average.toFixed(1)}점`, s: `평가 ${formatCount(summary.playStore.count)}개` },
              summary.foundPartnerCount !== null
                ? { k: "썸타임에서 만난 인연", v: `${formatCount(summary.foundPartnerCount)}명`, s: "2025년 5월부터" }
                : { k: "오늘 소셜 차트", v: rankLabel(sometime), s: "App Store 무료" },
            ].map((stat) => (
              <div key={stat.k}>
                <dt className="text-[13px] text-[#B0B8C1]">{stat.k}</dt>
                <dd className="mt-1 font-wantedSans text-[26px] font-extrabold tracking-[-0.03em] sm:text-[34px]">{stat.v}</dd>
                <dd className="text-[13px] text-[#8B95A1]">{stat.s}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Apple 식 나란한 비교 */}
      <section aria-labelledby="compare" className="mx-auto w-full max-w-[1040px] px-6 pt-16 sm:px-10 sm:pt-24">
        <Reveal>
          <h2 id="compare" className={READING_H2}>소개팅 어플 6개, 오늘 순위로 나란히</h2>
          <p className={`mt-3 max-w-[680px] text-[16px] leading-[1.75] ${READING_MUTED}`}>
            App Store 소셜 네트워킹 무료 차트 순위가 높은 순서예요. 상위 {CHART_SIZE}위 밖인 앱은 평가가 많은 순서로 뒤에 놓았어요. 평점과 평가 수는 App Store 한국 기준이에요.
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0">
          {snapshot.apps.map((app, i) => (
            <Reveal key={app.id} delay={i * 70} className="min-w-0 lg:border-l lg:border-[#E5E8EB] lg:px-4 lg:first:border-l-0 lg:first:pl-0">
              <article aria-labelledby={`app-${app.id}`}>
                <p className={`inline-block rounded-md px-2 py-0.5 text-[12px] font-bold ${app.id === SOMETIME_APP_ID ? "bg-[#7A4AE2] text-white" : "bg-[#F2F4F6] text-[#191F28]"}`}>
                  소셜 {rankLabel(app)}
                </p>
                <h3 id={`app-${app.id}`} className="mt-3 font-wantedSans text-[22px] font-extrabold tracking-[-0.03em] text-[#191F28]">{app.name}</h3>
                <p className="mt-1 min-h-[44px] text-[13px] leading-[1.6] text-[#4E5968]">{app.tagline ?? "—"}</p>
                <p className="mt-4 font-wantedSans text-[44px] font-extrabold leading-none tracking-[-0.04em] text-[#191F28]">{app.rating.toFixed(1)}</p>
                <p className="mt-1 text-[13px] text-[#4E5968]">App Store 평점</p>
                <dl className="mt-4 divide-y divide-[#E5E8EB] border-t border-[#E5E8EB] text-[14px]">
                  <div className="py-2.5"><dt className="text-[#8B95A1]">평가 수</dt><dd className="font-semibold text-[#191F28]">{formatCount(app.ratingCount)}개</dd></div>
                  <div className="py-2.5"><dt className="text-[#8B95A1]">대학생 앱</dt><dd className="font-semibold text-[#191F28]">{app.isCollege ? "이름에 “대학생”" : "—"}</dd></div>
                </dl>
                <a href={app.storeUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-[14px] font-semibold text-[#4E5968] underline underline-offset-4">
                  App Store에서 보기<span className="sr-only"> (새 탭)</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <p className={`mt-4 text-[13px] leading-[1.7] ${READING_MUTED}`}>
          출처: App Store 한국 소셜 네트워킹 무료 차트 상위 {CHART_SIZE}위, App Store 앱 정보 · {date} 확인. Google Play 는 공개 순위 자료가 없어 싣지 않았어요.
        </p>
      </section>

      <div className="mx-auto w-full max-w-[728px] px-6 pb-20 sm:px-0">
        {/* 3. 고르는 기준 */}
        <section aria-labelledby="criteria" className="pt-20">
          <Reveal><h2 id="criteria" className={READING_H2}>소개팅 어플, 고르기 전에 볼 6가지</h2></Reveal>
          <ol className="mt-8 space-y-10">
            {CRITERIA.map((c, i) => (
              <Reveal key={c.title}>
                <li>
                  <h3 className={READING_H3}><span className="mr-2 text-[#8B95A1]">{i + 1}</span>{c.title}</h3>
                  <p className={`mt-2 ${READING_BODY}`}>{c.body}</p>
                  {c.sometime && <p className={`mt-2 text-[16px] leading-[1.7] ${READING_MUTED}`}>썸타임은: {c.sometime}</p>}
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* 4. 이런 사람에겐 이 앱 */}
        <section aria-labelledby="fit" className="pt-20">
          <Reveal>
            <h2 id="fit" className={READING_H2}>이런 사람에겐 이 앱</h2>
            <p className={`mt-3 text-[16px] leading-[1.75] ${READING_MUTED}`}>각 앱이 App Store 소개에서 스스로 내건 점을 옮겼어요(2026년 11월 17일 확인).</p>
          </Reveal>
          <ul className="mt-6 divide-y divide-[#F1ECFA]">
            {snapshot.apps.map((app) => (
              <li key={app.id} className="py-5">
                <p className="text-[17px] font-bold text-[#201823]">{FIT[app.id].who} → {app.name}</p>
                <p className={`mt-1 text-[16px] leading-[1.7] ${READING_MUTED}`}>{FIT[app.id].basis}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. 자주 묻는 질문 */}
        <section aria-labelledby="ranking-faq" className="pt-20">
          <h2 id="ranking-faq" className={READING_H2}>자주 묻는 질문</h2>
          <div className="mt-6 space-y-8">
            <div>
              <h3 className={READING_H3}>소개팅 어플 순위는 어떻게 정했나요?</h3>
              <p className={`mt-2 ${READING_BODY}`}>App Store 한국 소셜 네트워킹 무료 차트의 그날 순위를 그대로 썼어요. 썸타임이 순서를 손대지 않고, 6시간마다 다시 읽어요.</p>
            </div>
            <div>
              <h3 className={READING_H3}>대학생 소개팅 앱에는 뭐가 있나요?</h3>
              <p className={`mt-2 ${READING_BODY}`}>
                이 비교에서 이름에 “대학생”을 내건 앱은 {snapshot.apps.filter((a) => a.isCollege).map((a) => a.name).join(", ")}이에요. 셋 다 대학생끼리 만나는 걸 내걸지만 사진 공개 방식과 미팅 여부가 달라요.
              </p>
            </div>
            <div>
              <h3 className={READING_H3}>무료 소개팅 어플이 있나요?</h3>
              <p className={`mt-2 ${READING_BODY}`}>여기 있는 앱은 모두 무료로 설치할 수 있어요. 다만 대부분 일부 기능에 비용이 들어서, 무엇에 비용이 드는지 앱 안내를 먼저 확인하는 게 좋아요.</p>
            </div>
            <div>
              <h3 className={READING_H3}>이 비교는 누가 만들었나요?</h3>
              <p className={`mt-2 ${READING_BODY}`}>썸타임 운영사 스마트뉴비가 만들었어요. 그래서 순위와 평점은 공개 자료 그대로 싣고, 우리 의견은 “썸타임은” 줄에만 적었어요.</p>
            </div>
          </div>
        </section>

        <div className="pt-16">
          <StoreInstallCta surface="landing_public_guide" heading="대학생 소개팅, 썸타임으로 시작해 보세요" />
        </div>

        <section className="mt-12 border-t border-[#EEE8FF] pt-8">
          <h2 className="mb-3 text-[15px] font-bold text-[#625A68]">같이 보면 좋은 안내</h2>
          <ul className="grid gap-1 sm:grid-cols-2 sm:gap-x-5">
            {RELATED.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`inline-flex min-h-11 items-center py-2 text-[16px] leading-6 ${READING_LINK}`}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentShell>
  );
}
