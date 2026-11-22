import { getCardNewsLifecycle } from "./public-content-lifecycle";
import { blogArticleUrl, SITE_URL } from "./public-content";
import type { CardNews, SometimeArticleListItem } from "./public-content";
import {
  ABOUT_PAGE,
  BLOCK_ACQUAINTANCES_FAQS,
  BLOCK_ACQUAINTANCES_PAGE,
  COLLEGE_MEETING_PAGE,
  KOREA_JAPAN_MATCHING_FAQS,
  KOREA_JAPAN_MATCHING_PAGE,
  PRIVACY_EASY_PAGE,
  VERIFICATION_PAGE,
  type PublicInfoFaq,
  type PublicInfoPage,
} from "./public-info-pages";
import { isOperationalNoticeTitle, isSitemapBlogSlug } from "./sitemap-helpers";

// Facts here are the ones already stated on /about, /faq and /verification.
// Counts that change daily (verified users, schools) stay on /about, where they carry a date.
const HEADER = `# 썸타임

> 썸타임은 학교·졸업·직장 인증을 기반으로 대학(원)생과 졸업생을 연결하는 소개팅 앱입니다. 학교 이메일 또는 학생증·재학증명서 등으로 인증하고, 같은 학교·학과 제외와 연락처 기반 지인 차단으로 아는 사람에게 노출되는 부담을 줄입니다. 운영사는 스마트뉴비입니다. iOS와 Android를 지원합니다.

- 인증이 끝나기 전에는 프로필이 다른 이용자에게 보이지 않습니다.
- 무료로 시작할 수 있고 일부 기능은 유료입니다. 비용과 조건은 앱에서 사용 전에 안내합니다.
- 실제 매칭 범위와 이용 가능한 기능은 앱의 현재 안내를 기준으로 합니다.

## 서비스 안내

- [썸타임이란](${SITE_URL}/about): 서비스 소개, 이용 흐름, 운영사 정보, 인증 현황
- [자주 묻는 질문](${SITE_URL}/faq): 이용 대상, 학교 인증, 요금, 사진 공개, 신고·차단
- [소개팅 어플 순위](${SITE_URL}/dating-app-ranking): 썸타임·연픽·클럽트웬티·하루야 대학생 소개팅 앱 4곳을 App Store 순위·평점과 함께 비교
- [소개팅 어플 순위 2026](${SITE_URL}/dating-app-ranking/all): 소개팅 어플 순위 2026, 앱 9종 유형별 비교
- [대학생 미팅](${SITE_URL}/college-meeting): 2:2 미팅 대신 시간·장소를 먼저 정해 1:1로 만나는 썸타임 약속 안내(올리는 법, 비용, 규칙)
- [한일 매칭 안내](${SITE_URL}/korea-japan-matching): 일본 대학생·20대 회원과 자동 번역 프로필·편지·채팅으로 만나는 한일 매칭 기능 안내
- [지인 차단·같은 학교 제외 안내](${SITE_URL}/block-acquaintances): 연락처 해시 기반 지인 차단과 같은 학교·학과 제외 설정 안내
- [썸타임 로테이션 소개팅](${SITE_URL}/rotation): 대학생 오프라인 로테이션 소개팅 일정과 신청 안내
- [썸타임 사주대학](${SITE_URL}/sajuniv): 연애 사주와 연애운 풀이 서비스
- [썸타임 연애 실험실](${SITE_URL}/dating-lab): 연애 성향 테스트와 캠퍼스 연애 콘텐츠
- [썸타임 후기](${SITE_URL}/reviews): App Store·Google Play 평점과 대표 후기
- [학교 인증 안내](${SITE_URL}/verification): 인증 경로와 제출 자료 처리 원칙
- [안전 안내](${SITE_URL}/safety): 신고·차단, 위반 조치, 미성년자 보호, 위급 연락처
- [쉬운 개인정보 안내](${SITE_URL}/privacy/easy): 개인정보 처리 원칙 요약
- [커뮤니티 가이드라인](${SITE_URL}/community-guidelines): 기본 이용 규칙
- [앱 다운로드](${SITE_URL}/download): App Store와 Google Play 공식 링크
- [학교별 안내](${SITE_URL}/university): 학교별 인증과 이용 경로
`;

const FOOTER = `
## 문의

- [프레스 안내](${SITE_URL}/press): 공식 소개와 언론 문의
- 고객센터: notify@smartnewb.com

## Optional

- [전체 안내 (llms-full.txt)](${SITE_URL}/llms-full.txt)
- [블로그 RSS](${SITE_URL}/feed.xml)
- [사이트맵](${SITE_URL}/sitemap.xml)
`;

function oneLine(value?: string | null): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function entry(title: string, url: string, summary?: string | null): string {
  const text = oneLine(summary);
  return text ? `- [${oneLine(title)}](${url}): ${text}` : `- [${oneLine(title)}](${url})`;
}

function byNewest<T extends { publishedAt?: string | null }>(a: T, b: T): number {
  return new Date(b.publishedAt ?? 0).valueOf() - new Date(a.publishedAt ?? 0).valueOf();
}

/**
 * llms.txt lists only what the sitemap submits for indexing: Naver mirrors and jp- posts are
 * noindex elsewhere, and card-news notices, campaigns and duplicates are not reading material.
 */
export function buildLlmsTxt(input: {
  articles: SometimeArticleListItem[];
  cardNews: CardNews[];
}): string {
  const articles = input.articles
    .filter((article) => isSitemapBlogSlug(article.slug) && article.publishedAt)
    .sort(byNewest)
    .map((article) =>
      entry(article.title, blogArticleUrl(article.slug), article.excerpt ?? article.subtitle),
    );

  const cardNews = input.cardNews
    .filter((item) => {
      const lifecycle = getCardNewsLifecycle(item.id);
      return (
        item.publishedAt &&
        lifecycle.intent === "editorial" &&
        !lifecycle.canonicalId &&
        !isOperationalNoticeTitle(item.title)
      );
    })
    .sort(byNewest)
    .map((item) =>
      entry(item.title, `${SITE_URL}/card-news/${item.id}`, item.description ?? item.subtitle),
    );

  const sections = [HEADER];
  if (articles.length) sections.push(`## 블로그\n\n${articles.join("\n")}\n`);
  if (cardNews.length) sections.push(`## 카드뉴스\n\n${cardNews.join("\n")}\n`);
  sections.push(FOOTER);
  return sections.join("\n");
}

function renderInfoPageSection(
  path: string,
  page: PublicInfoPage,
  faqs?: PublicInfoFaq[],
): string {
  const lines: string[] = [
    `## ${page.title} (${SITE_URL}${path})`,
    "",
    ...page.answer.map((line) => `> ${line}`),
    "",
  ];
  for (const section of page.sections) {
    lines.push(`### ${section.heading}`, "");
    if (section.body) {
      for (const p of section.body) lines.push(p, "");
    }
    if (section.items) {
      for (const item of section.items) lines.push(`- ${item}`);
      lines.push("");
    }
  }
  if (faqs?.length) {
    lines.push("### 자주 묻는 질문", "");
    for (const faq of faqs) {
      lines.push(`- **Q. ${faq.question}** ${faq.answer}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function buildLlmsFullTxt(input: {
  articles: SometimeArticleListItem[];
  cardNews: CardNews[];
}): string {
  const base = buildLlmsTxt(input);
  const fullPages = [
    renderInfoPageSection("/about", ABOUT_PAGE),
    renderInfoPageSection("/korea-japan-matching", KOREA_JAPAN_MATCHING_PAGE, KOREA_JAPAN_MATCHING_FAQS),
    renderInfoPageSection("/block-acquaintances", BLOCK_ACQUAINTANCES_PAGE, BLOCK_ACQUAINTANCES_FAQS),
    renderInfoPageSection("/college-meeting", COLLEGE_MEETING_PAGE),
    renderInfoPageSection("/verification", VERIFICATION_PAGE),
    renderInfoPageSection("/privacy/easy", PRIVACY_EASY_PAGE),
  ];
  return `${base}\n---\n\n# 주요 서비스 상세 안내 (Full Context)\n\n${fullPages.join("\n")}`;
}
