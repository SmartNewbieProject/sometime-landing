/**
 * 공개 안내 페이지(인증/개인정보/가이드라인/프레스) 콘텐츠.
 *
 * 정본: sometimes-api `src/seo/content/public-pages.ts` 해당 slug들.
 * verification은 검증(가드 테스트)된 개정본 그대로, 나머지는 브랜드 톤(해요체)으로
 * 다듬고 문의 채널을 공식 고객센터(notify@smartnewb.com)로 통일해 이식했다.
 * 수정 시 API 쪽 정본과 함께 맞춘다. 처리 기한·결과 보장, 확정형 제재 문구,
 * 가격 노출을 넣지 않는다.
 */

import type { InfoLink, InfoSection } from "../_components/public-content/InfoPageBody";

export type PublicInfoPage = {
  badge: string;
  breadcrumbLabel: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  answer: string[];
  sections: InfoSection[];
  links?: InfoLink[];
};

const TERMS_URL =
  "https://ruby-composer-6d2.notion.site/1cd1bbec5ba1805dbafbc9426a0aaa80";
const PRIVACY_URL =
  "https://ruby-composer-6d2.notion.site/1cd1bbec5ba180a3a4bbdf9301683145";

export const VERIFICATION_PAGE: PublicInfoPage = {
  badge: "VERIFICATION",
  breadcrumbLabel: "학교 인증 안내",
  title: "학교 인증 안내",
  metaTitle: "썸타임 학교 인증 안내 — 인증 경로와 확인 사항",
  description:
    "썸타임의 대학생 인증 목적, 두 가지 인증 경로, 인증 실패 시 확인할 내용을 안내해요.",
  keywords: [
    "썸타임 학교 인증",
    "대학생 인증 소개팅",
    "학생증 인증",
    "재학증명서 인증",
    "학교 이메일 인증",
  ],
  answer: [
    "썸타임은 대학생 전용 서비스 경험을 위해 학교 인증 절차를 사용해요.",
    "인증은 학교 이메일 또는 학생증·재학증명서 제출 두 가지 경로로 진행하고, 제출 자료는 안전하게 다뤄요.",
    "인증이 완료되기 전까지 프로필은 다른 이용자에게 노출되지 않고, 결과·예외 처리는 운영 정책을 따라요.",
  ],
  sections: [
    {
      id: "why",
      heading: "인증이 필요한 이유",
      body: [
        "학교 인증은 대학생 이용자 중심의 매칭 환경을 유지하기 위한 기본 절차예요.",
        "또한 허위 가입과 부적절한 이용을 줄이는 데 도움을 줘요.",
      ],
    },
    {
      id: "before",
      heading: "인증 전 확인할 것",
      items: [
        "인증 경로는 학교 이메일 인증과 학생증·재학증명서 제출 두 가지예요. 앱 안내에 따라 한 가지를 선택해요.",
        "학생증은 인증 목적으로만 사용되며, 인증 완료 후 안전하게 삭제돼요.",
        "학교 정보가 정확한지 확인해 주세요.",
        "앱에 안내된 제출 방식을 확인해 주세요.",
        "인증에 실패했다면 입력한 정보를 다시 확인해 주세요.",
        "인증이 완료되기 전에는 프로필이 다른 이용자에게 노출되지 않아요.",
      ],
    },
  ],
  links: [
    { label: "대학생 소개팅 앱 4곳 비교", href: "/dating-app-ranking" },
    { label: "썸타임 안전 안내", href: "/safety" },
    { label: "자주 묻는 질문", href: "/faq" },
  ],
};

export const PRIVACY_EASY_PAGE: PublicInfoPage = {
  badge: "PRIVACY",
  breadcrumbLabel: "쉬운 개인정보 안내",
  title: "쉬운 개인정보 안내",
  metaTitle: "썸타임 쉬운 개인정보 안내 — 처리 원칙 요약",
  description:
    "썸타임에서 처리하는 개인정보의 범주, 보관 원칙과 이용자 권리 행사 방법을 공식 방침에 따라 요약했어요.",
  keywords: [
    "썸타임 개인정보",
    "소개팅 앱 개인정보",
    "개인정보 처리방침 요약",
  ],
  answer: [
    "썸타임은 가입·본인확인 정보, 학교·프로필 정보, 서비스 이용 기록을 서비스 제공과 이용자 보호에 필요한 범위에서 처리해요.",
    "연락처 동기화와 위치정보는 해당 기능을 이용하고 권한에 동의한 경우에 처리되며, 결제 기능을 쓰면 결제 기록이 처리돼요.",
    "이 페이지는 쉬운 요약이며, 정확한 항목·목적·보관 기간은 아래 공식 개인정보처리방침이 기준이에요.",
  ],
  sections: [
    {
      id: "what-we-collect",
      heading: "어떤 정보를 처리하나요",
      items: [
        "가입과 본인확인: 소셜 로그인 식별자, 연락처와 가입 확인에 필요한 정보",
        "학교와 프로필: 학교 정보, 학교 인증 자료, 프로필 사진과 이용자가 입력한 특성·관심사",
        "서비스 이용: 매칭·채팅·커뮤니티·문의 기록과 기기·접속 기록",
        "선택 기능: 연락처 동기화, 위치 기반 기능, 결제를 이용할 때 필요한 정보와 기록",
      ],
    },
    {
      id: "retention",
      heading: "언제까지 보관하나요",
      body: [
        "처리 목적이 끝나거나 회원이 탈퇴하면 개인정보를 파기하는 것이 원칙이에요.",
        "다만 결제·분쟁·서비스 이용 기록처럼 법령 또는 방침에 별도 기간이 적힌 정보는 그 기간 동안 분리 보관한 뒤 파기해요. 항목별 기간은 공식 방침에서 확인할 수 있어요.",
      ],
    },
    {
      id: "your-rights",
      heading: "내 정보 확인·수정·삭제하기",
      items: [
        "앱의 마이페이지 > 설정 > 개인정보 관리에서 관련 설정을 확인해요.",
        "위치 이용 동의는 앱의 마이페이지 > 설정 > 위치기반서비스 동의 관리에서 변경해요.",
        "열람·정정·삭제·처리정지 또는 동의 철회가 필요하면 고객센터 이메일로 요청할 수 있어요.",
      ],
    },
  ],
  links: [
    { label: "개인정보처리방침 전문", href: PRIVACY_URL },
    { label: "개인정보 문의 메일 보내기", href: "mailto:notify@smartnewb.com" },
    { label: "썸타임 안전 안내", href: "/safety" },
  ],
};

export const COMMUNITY_GUIDELINES_PAGE: PublicInfoPage = {
  badge: "COMMUNITY",
  breadcrumbLabel: "커뮤니티 가이드라인",
  title: "커뮤니티 가이드라인",
  metaTitle: "썸타임 커뮤니티 가이드라인 — 기본 이용 규칙",
  description:
    "썸타임 이용자가 서로를 존중하며 서비스를 사용하기 위한 기본 커뮤니티 규칙이에요.",
  keywords: [
    "썸타임 커뮤니티 가이드라인",
    "소개팅 앱 이용 규칙",
    "커뮤니티 규칙",
  ],
  answer: [
    "상대를 사칭하거나 괴롭히고, 원치 않는 연락·광고를 보내거나 타인의 개인정보를 공개하면 안 돼요.",
    "문제가 생기면 해당 프로필·채팅·게시물에서 신고하고 상대를 차단해 주세요.",
    "신고 내용은 운영 검토를 거치며, 위반 내용과 정도에 따라 경고나 이용 제한 등 조치가 달라질 수 있어요.",
  ],
  sections: [
    {
      id: "principles",
      heading: "기본 원칙",
      items: [
        "프로필, 메시지와 게시물에서 상대방을 존중해요.",
        "본인의 정보와 사진을 사용하고 다른 사람을 사칭하지 않아요.",
        "상대가 원하지 않는 연락, 성적 표현, 협박이나 괴롭힘을 하지 않아요.",
      ],
    },
    {
      id: "restricted",
      heading: "제한될 수 있는 행동",
      items: [
        "모욕적·차별적이거나 위협적인 표현",
        "타인의 연락처, 사진 등 개인정보를 동의 없이 공유하는 행동",
        "반복 홍보, 스팸, 금전 요구 또는 불법 거래를 권하는 행동",
        "허위 프로필, 사칭 또는 신고·제재를 피하기 위한 계정 이용",
      ],
    },
    {
      id: "report",
      heading: "신고하고 도움받기",
      items: [
        "대화를 중단하고 상대 프로필이나 채팅방, 커뮤니티 게시물의 신고 기능을 이용해요.",
        "더 이상 연락받고 싶지 않다면 차단 기능을 함께 이용해요.",
        "앱에서 신고하기 어렵거나 추가 자료를 전달해야 하면 고객센터 이메일로 문의해요.",
        "당장 위험한 상황이면 서비스 문의보다 먼저 112 등 긴급 기관에 연락해요.",
      ],
    },
  ],
  links: [
    { label: "신고·차단과 위급 상황 안내", href: "/safety" },
    { label: "고객센터 메일 보내기", href: "mailto:notify@smartnewb.com" },
    { label: "이용약관 전문", href: TERMS_URL },
  ],
};

export const PRESS_PAGE: PublicInfoPage = {
  badge: "PRESS",
  breadcrumbLabel: "프레스 안내",
  title: "썸타임 프레스 안내",
  metaTitle: "썸타임 프레스 안내 — 공식 소개와 문의",
  description:
    "썸타임과 스마트뉴비의 공식 소개, 문의, 다운로드 링크를 확인할 수 있는 프레스 페이지예요.",
  keywords: ["썸타임", "스마트뉴비", "프레스", "보도자료"],
  answer: [
    "썸타임은 스마트뉴비가 운영하는 대학생 전용 지역 기반 소개팅 앱이에요.",
    "아래 공식 서비스 정보와 승인된 이미지 파일은 기사·소개 자료 작성에 사용할 수 있어요.",
    "언론 및 제휴 문의는 notify@smartnewb.com으로 보내 주세요.",
  ],
  sections: [
    {
      id: "official",
      heading: "공식 정보",
      items: [
        "서비스명: 썸타임 (Sometime)",
        "운영사: 주식회사 스마트뉴비",
        "공식 도메인: https://some-in-univ.com",
        "서비스 형태: 대학생·대학원생·졸업생(20대) 학교 인증 기반 지역 매칭 및 한일 매칭 앱",
        "공식 엔티티: Wikidata Q142258923 · 나무위키 썸타임(어플)",
      ],
    },
    {
      id: "coverage",
      heading: "주요 언론 보도",
      items: [
        "2026-05-12 · 한국공공정책신문 — 모쏠 대학생활에서 시작된 문제의식, 대학생 소개팅 앱 '썸타임'으로 이어지다",
        "2025-11-15 · 브릿지경제 — 한밭대 학생창업 '스마트뉴비', AI 기반 지역 대학생 소개팅 플랫폼 '썸타임' 눈길",
      ],
    },
    {
      id: "downloads",
      heading: "승인된 이미지 자료",
      body: [
        "소셜 공유 이미지와 제품 화면은 아래 파일 링크에서 원본으로 내려받을 수 있어요. 이미지를 임의로 서비스 화면처럼 합성하거나 사실과 다른 설명을 붙이지 말아 주세요.",
      ],
    },
  ],
  links: [
    { label: "한국공공정책신문 보도 기사 (2026-05-12)", href: "http://knpp.co.kr/news/499340" },
    { label: "브릿지경제 보도 기사 (2025-11-15)", href: "https://www.viva100.com/article/20251115500186" },
    { label: "언론·제휴 문의 메일", href: "mailto:notify@smartnewb.com" },
    { label: "썸타임 공식 웹사이트", href: "https://some-in-univ.com" },
    { label: "App Store 공식 페이지", href: "https://apps.apple.com/kr/app/id6746120889" },
    { label: "Google Play 공식 페이지", href: "https://play.google.com/store/apps/details?id=com.smartnewb.sometimes" },
    { label: "소셜 공유 이미지 (1200×630 JPG)", href: "/images/social/sometime-share-20260908.jpg", download: true },
    { label: "제품 화면 1 — 캠퍼스 모먼트", href: "/images/download/01-campus-moment.webp", download: true },
    { label: "제품 화면 2 — 프로필 관심사", href: "/images/download/02-profile-interests.webp", download: true },
    { label: "제품 화면 3 — 개인정보 설정", href: "/images/download/03-privacy-settings.webp", download: true },
    { label: "제품 화면 4 — 학교 인증", href: "/images/download/04-university-verification.webp", download: true },
    { label: "제품 화면 5 — 매칭 이유", href: "/images/download/05-matching-reason.webp", download: true },
    { label: "제품 화면 6 — 대화", href: "/images/download/06-conversation.webp", download: true },
  ],
};

export const ABOUT_PAGE: PublicInfoPage = {
  badge: "ABOUT",
  breadcrumbLabel: "썸타임 소개",
  title: "썸타임이란",
  metaTitle: "썸타임이란 — 학교 인증 대학생 소개팅 앱 소개",
  description:
    "썸타임은 학교 인증 표시를 확인하고 같은 지역 대학(원)생·졸업생과 만나는 소개팅 앱이에요. 같은 학교·학과 제외, 지인 차단, 한일 매칭과 운영사 스마트뉴비 정보를 확인하세요.",
  keywords: ["썸타임이란", "대학생 소개팅 앱", "학교 인증 소개팅", "캠퍼스 매칭", "지인 차단 소개팅 앱"],
  answer: [
    "썸타임은 대학생이 학교 인증을 거쳐 같은 지역의 대학생과 연결될 수 있도록 만든 소개팅 앱이에요.",
    "매칭 등 주요 기능은 학교 인증을 완료한 대학생이 이용할 수 있고, 실제 이용 가능 여부는 앱의 현재 인증 기준을 따라요.",
    "서비스 운영사는 스마트뉴비이며 공식 도메인은 some-in-univ.com이에요.",
  ],
  sections: [
    {
      id: "operator",
      heading: "운영사",
      body: [
        "상호 스마트뉴비",
        "대표 전준영",
        "사업자등록번호 498-05-02914",
        "통신판매업신고 제2026-대전유성-0328호",
        "주소 대전광역시 유성구 동서대로 125, S9동 한밭인큐베이터타운 405호",
        "문의 notify@smartnewb.com",
      ],
    },
    {
      id: "how-it-works",
      heading: "이용 흐름",
      items: [
        "공식 앱을 설치하고 가입 정보를 입력해요.",
        "앱에 안내된 방법으로 학교 인증과 프로필 준비를 진행해요.",
        "인증을 마치면 앱에서 현재 제공되는 매칭 기능과 이용 조건을 확인해요.",
      ],
    },
    {
      id: "trust",
      heading: "이용 전에 확인할 정보",
      items: [
        "학교 인증 경로와 실패 시 도움받는 방법",
        "신고·차단 기능과 안전한 첫 만남 안내",
        "개인정보 처리 원칙과 공식 정책 전문",
      ],
    },
  ],
  links: [
    { label: "대학생 소개팅 앱 4곳 비교", href: "/dating-app-ranking" },
    { label: "학교 인증 방법", href: "/verification" },
    { label: "썸타임 안전 안내", href: "/safety" },
    { label: "쉬운 개인정보 안내", href: "/privacy/easy" },
    { label: "자주 묻는 질문", href: "/faq" },
    { label: "앱 다운로드", href: "/download" },
  ],
};

export const DOWNLOAD_PAGE: PublicInfoPage = {
  badge: "DOWNLOAD",
  breadcrumbLabel: "앱 다운로드",
  title: "썸타임 다운로드",
  metaTitle: "썸타임 다운로드 — App Store와 Google Play 공식 링크",
  description:
    "썸타임 공식 앱 다운로드 링크예요. App Store와 Google Play에서 썸타임을 설치할 수 있어요.",
  keywords: ["썸타임 다운로드", "썸타임 앱", "App Store", "Google Play"],
  answer: [
    "썸타임은 App Store와 Google Play에서 다운로드할 수 있어요.",
    "공식 스토어 링크로 앱을 설치하면 대학생 인증과 매칭 기능을 이용할 수 있어요.",
    "아래 공식 링크에서 바로 설치를 시작할 수 있어요.",
  ],
  sections: [
    {
      id: "store-links",
      heading: "공식 스토어 링크",
      items: [
        "App Store: https://apps.apple.com/kr/app/id6746120889",
        "Google Play: https://play.google.com/store/apps/details?id=com.smartnewb.sometimes",
      ],
    },
    {
      id: "after-install",
      heading: "설치 후 이용 흐름",
      body: [
        "앱을 설치한 뒤 회원가입, 학교 인증, 프로필 입력을 진행해요.",
        "인증과 프로필 절차가 완료되면 앱에서 매칭과 관련 기능을 사용할 수 있어요.",
      ],
    },
  ],
  links: [
    { label: "대학생 소개팅 앱 4곳 비교", href: "/dating-app-ranking" },
    { label: "썸타임 소개", href: "/about" },
    { label: "썸타임 안전 안내", href: "/safety" },
  ],
};

/**
 * 대학생 미팅 안내. API 정본이 없는 랜딩 전용 페이지다.
 * 2:2 미팅은 없어졌고, 지금은 1:1 약속 기능을 안내한다.
 * 사실 출처: sometimes-app 약속 문구(src/shared/libs/locales/ko/features/promise.json, origin/main).
 * 주소(/college-meeting)는 "대학생 미팅" 검색 유입이 쌓여 있어 그대로 둔다.
 */
export const COLLEGE_MEETING_PAGE: PublicInfoPage = {
  badge: "MEETING",
  breadcrumbLabel: "대학생 미팅",
  title: "대학생 미팅 대신, 썸타임은 1:1 약속으로 만나요",
  metaTitle: "대학생 미팅·소개팅 앱 썸타임 | 시간·장소를 먼저 정하는 1:1 약속",
  description:
    "썸타임에는 2:2 미팅이 없어요. 대신 학교나 직장 인증과 실물 사진을 마친 사람끼리, 시간과 장소를 먼저 정해 1:1로 만나는 약속 기능이 있어요. 올리는 법, 비용, 규칙을 정리했어요.",
  keywords: [
    "대학생 미팅",
    "대학생 미팅 앱",
    "대학교 미팅",
    "대학생 소개팅",
    "1:1 소개팅",
    "소개팅 앱 약속",
  ],
  answer: [
    "썸타임에는 2:2 미팅이 없어요. 대신 만날 시간과 장소를 먼저 정하고 1:1로 만나는 약속 기능이 있어요.",
    "약속을 올리면 신청한 사람 가운데 한 명을 고르고, 고르는 순간 약속이 잡히고 채팅방이 열려요.",
    "학교나 직장 인증과 승인된 실물 사진을 마친 사람끼리만 쓸 수 있어요.",
  ],
  sections: [
    {
      id: "how",
      heading: "약속은 이렇게 잡혀요",
      items: [
        "언제 만날지 고르고, 카페·밥·산책·전시·팝업·영화·방탈출·보드게임 가운데 할 일을 정해요.",
        "장소는 내 학교 근처의 사람 많은 공개 장소에서 골라요. 술집·숙소는 고를 수 없어요.",
        "올린 사람은 신청한 사람의 사진과 나이를 보고 한 명을 골라요. 고르면 바로 약속이 잡히고 채팅방이 열려요.",
        "같은 학교 사람에게는 내 약속이 보이지 않아요.",
      ],
    },
    {
      id: "cost",
      heading: "비용",
      items: [
        "여성은 약속을 올리거나 신청할 때 무료예요.",
        "남성은 구슬을 맡기고 신청해요. 다른 분이 뽑히면 바로, 늦어도 약속 1시간 전에 맡긴 구슬을 돌려받아요.",
        "남성도 구슬로 약속을 올릴 수 있어요. 필요한 구슬 수는 앱에서 올리거나 신청하기 전에 보여 드려요.",
      ],
    },
    {
      id: "who",
      heading: "누가 쓸 수 있나요",
      body: [
        "학교나 직장 인증을 마친 사람만 약속을 올리고 신청할 수 있어요.",
        "실제로 만나는 기능이라 승인된 실물 사진이 1장 이상 있어야 해요.",
      ],
    },
    {
      id: "promise",
      heading: "약속을 지키기 위해",
      items: [
        "한 번 잡힌 약속은 취소할 수 없어요. 잡히기 전에는 신청을 취소할 수 있어요.",
        "남성이 올린 약속에 신청이 3명 이상 왔는데 아무도 고르지 않으면, 7일 동안 약속을 올릴 수 없어요.",
        "불편한 일이 생기면 앱에서 신고하거나 차단할 수 있어요.",
      ],
    },
    {
      id: "vs",
      heading: "미팅·과팅·소개팅과 뭐가 달라요",
      body: [
        "과팅은 과끼리 여럿이 날을 잡고, 소개팅은 주선자를 거쳐 1:1로 만나요.",
        "썸타임 약속은 주선자 없이 내가 시간과 장소를 먼저 정해 올리고, 신청한 사람 가운데 한 명과 1:1로 만나요. 같이 갈 친구를 모을 필요가 없어요.",
        "여럿이 함께 만나는 미팅을 찾는다면 아래 대학생 소개팅 앱 4곳 비교에서 오픈 미팅이 있는 앱을 확인해 보세요.",
      ],
    },
  ],
  links: [
    { label: "대학생 소개팅 앱 4곳 비교", href: "/dating-app-ranking" },
    { label: "썸타임 후기", href: "/reviews" },
    { label: "학교 인증 안내", href: "/verification" },
    { label: "썸타임 안전 안내", href: "/safety" },
    { label: "과팅 준비 가이드", href: "/blog/gwating-guide" },
    { label: "자주 묻는 질문", href: "/faq" },
  ],
};

export type PublicInfoFaq = {
  question: string;
  answer: string;
};

export const KOREA_JAPAN_MATCHING_FAQS: PublicInfoFaq[] = [
  {
    question: "일본어를 못해도 썸타임 한일 매칭을 이용할 수 있나요?",
    answer:
      "네. 프로필, 좋아요 편지, 채팅 메시지와 커뮤니티 글이 한국어·일본어로 자동 번역되어 한국어만 써도 대화할 수 있어요.",
  },
  {
    question: "한일 매칭에서는 어떤 일본 회원을 만나게 되나요?",
    answer:
      "일본에서는 대학생과 20대 직장인 회원이 함께 참여하며, 한일 매칭을 켜면 홈 카드에 '일본' 우표가 붙은 프로필로 소개돼요.",
  },
  {
    question: "한일 매칭은 꼭 켜야 하나요? 나중에 끌 수도 있나요?",
    answer:
      "아니요, 선택 기능이에요. 동의하지 않아도 국내 매칭은 그대로 이용할 수 있고, 켠 뒤에도 앱 설정이나 고객센터(notify@smartnewb.com)에서 언제든 끄고 동의를 철회할 수 있어요.",
  },
  {
    question: "한일 매칭 이용 비용은 어떻게 되나요?",
    answer:
      "처음 방문 시 일본 회원 1명을 무료로 만날 수 있어요. 추가 매칭 등 일부 기능은 구슬을 사용하며, 필요한 조건은 앱에서 사용 전에 안내해요.",
  },
];

export const KOREA_JAPAN_MATCHING_PAGE: PublicInfoPage = {
  badge: "KOREA-JAPAN MATCHING",
  breadcrumbLabel: "한일 매칭 안내",
  title: "한일 매칭·일본인 소개팅 앱 썸타임",
  metaTitle: "한일 매칭·일본인 소개팅 앱 썸타임 | AI 자동 번역 채팅",
  description:
    "일본어를 못해도 한국어 그대로 대화하는 한일 매칭. 썸타임에서 일본 대학생·20대 회원과 자동 번역 프로필·편지·채팅으로 만나는 방법을 확인하세요.",
  keywords: [
    "한일 매칭",
    "일본인 소개팅 앱",
    "일본인 친구 앱",
    "한일 소개팅",
    "자동 번역 소개팅 앱",
    "썸타임 한일 매칭",
  ],
  answer: [
    "썸타임 한일 매칭은 한국과 일본 회원을 연결하고, 프로필·편지·채팅을 AI로 자동 번역해 주는 선택 기능이에요.",
    "일본은 대학생과 20대 직장인 회원이 함께 참여하며, 한국어로 보내면 일본어로, 일본어로 받으면 한국어로 자연스럽게 번역돼요.",
    "동의하지 않아도 국내 매칭은 그대로 이용할 수 있고, 켠 뒤에도 언제든 끄거나 동의를 철회할 수 있어요.",
  ],
  sections: [
    {
      id: "how-it-works",
      heading: "한일 매칭은 어떻게 작동하나요?",
      items: [
        "프로필 사진 등록과 이상형 설정을 마친 뒤, 선택 동의(개인정보 국외 제공 동의)를 하면 한일 매칭이 켜져요.",
        "한일 매칭을 켜면 홈 카드에 오른쪽 위 '일본' 우표가 붙은 일본 회원 프로필이 함께 소개돼요.",
        "마음에 드는 상대에게 좋아요를 보내거나 자동 번역 편지를 함께 전할 수 있고, 상대가 수락하면 실시간 번역 채팅이 열려요.",
        "일본 회원이 작성한 커뮤니티 글도 한국어로 번역되어 읽고 쪽지를 보낼 수 있어요.",
      ],
    },
    {
      id: "translation",
      heading: "일본어를 못해도 대화할 수 있나요?",
      body: [
        "내가 한국어로 입력하면 상대에게는 일본어로, 상대가 일본어로 보내면 나에게는 한국어로 AI가 자연스럽게 번역해 줘요.",
        "프로필 소개글과 관심사 키워드도 자동으로 번역되며, 채팅과 프로필에서 원문과 번역문을 함께 확인할 수 있어요.",
      ],
    },
    {
      id: "cost-and-privacy",
      heading: "비용과 개인정보 처리는 어떻게 되나요?",
      items: [
        "처음 방문 시 일본 회원 1명을 무료로 만날 수 있고, 추가 매칭 등 일부 기능은 구슬을 사용해요. 조건과 비용은 앱에서 사용 전에 안내해요.",
        "한일 매칭에 필요한 프로필 정보는 회사의 국내 서버에 저장되며, 일본 회원은 앱 화면에서 조회만 할 수 있어요.",
        "한일 매칭을 끄거나 상대를 차단·탈퇴하면 그때부터 일본 회원에게 프로필이 보이지 않아요.",
      ],
    },
  ],
  links: [
    { label: "지인 차단·같은 학교 제외 안내", href: "/block-acquaintances" },
    { label: "대학생 소개팅 앱 4곳 비교", href: "/dating-app-ranking" },
    { label: "썸타임 후기", href: "/reviews" },
    { label: "학교 인증 안내", href: "/verification" },
    { label: "썸타임 안전 안내", href: "/safety" },
    { label: "자주 묻는 질문", href: "/faq" },
  ],
};

export const BLOCK_ACQUAINTANCES_FAQS: PublicInfoFaq[] = [
  {
    question: "지인 차단 기능이 잘 되어 있는 대학생 소개팅 앱 추천 기준은 무엇인가요?",
    answer:
      "전화번호 연락처 차단만으로는 같은 캠퍼스나 같은 학과 사람을 모두 피하기 어렵습니다. 썸타임(Sometime)처럼 연락처 해시 기반 지인 차단과 같은 학교·같은 학과 제외 설정을 함께 제공하고, 학교 인증으로 가입자를 검증하는 앱을 선택하는 것이 노출 부담을 줄이는 데 유리해요.",
  },
  {
    question: "지인 차단을 쓰면 내 연락처가 서버에 그대로 저장되나요?",
    answer:
      "아니요. 전화번호는 해시 처리하여 저장하며, 지인에게 내 프로필이 노출되지 않도록 매칭 제외 용도로만 사용해요.",
  },
  {
    question: "같은 학교나 같은 학과 사람만 따로 피할 수도 있나요?",
    answer:
      "네. 앱 설정에서 '같은 학교 제외'와 '같은 학과 제외'를 각각 켜거나 끌 수 있어요. 켜면 다음 소개부터 해당 범위의 사람은 제외하고 추천해요.",
  },
  {
    question: "연락처 동기화에 동의하지 않으면 앱을 못 쓰나요?",
    answer:
      "아니요. 연락처 기반 지인 차단은 선택 기능이에요. 동의하지 않아도 기본 매칭은 그대로 이용할 수 있어요.",
  },
  {
    question: "지인 차단 기능을 켜면 아는 사람을 100% 안 마주치나요?",
    answer:
      "연락처에 저장되지 않은 번호, 번호 변경, 새 계정 등 예외 상황이 있을 수 있어 모든 상황에서의 노출 방지를 100% 보장하지는 않아요. 다만 연락처 차단과 같은 학교·학과 제외를 함께 켜면 노출 부담을 크게 줄일 수 있어요.",
  },
];

export const BLOCK_ACQUAINTANCES_PAGE: PublicInfoPage = {
  badge: "PRIVACY CONTROLS",
  breadcrumbLabel: "지인 차단·같은 학교 제외",
  title: "지인 차단 소개팅 앱 추천 — 연락처 차단·같은 학교·학과 제외 썸타임(Sometime)",
  metaTitle: "지인 차단 소개팅 앱 추천 | 연락처 차단·같은 학교 제외 썸타임(Sometime)",
  description:
    "지인 차단 소개팅 앱을 찾는 대학생을 위해 썸타임(Sometime)의 2중 지인 차단(연락처 해시 차단 + 같은 학교·같은 학과 제외)과 일반 소개팅 앱 비교 기준을 정리했어요.",
  keywords: [
    "지인 차단 소개팅 앱 추천",
    "지인 차단 소개팅 앱",
    "지인 안 마주치는 소개팅 앱",
    "같은 학교 피하는 소개팅 앱",
    "연락처 차단 소개팅 앱",
    "대학생 소개팅 앱 지인 차단",
    "썸타임 지인 차단",
    "Sometime",
  ],
  answer: [
    "지인 차단 기능이 중요한 대학생에게 썸타임(Sometime)은 연락처 해시 기반 지인 차단과 같은 학교·같은 학과 제외 설정을 함께 제공하는 대학생 전용 소개팅 앱이에요.",
    "일반 소개팅 앱이 전화번호 차단만 지원하는 것과 달리, 썸타임은 학교 이메일·학생증 인증을 기반으로 같은 학교 전체 또는 같은 학과 단위까지 매칭에서 제외할 수 있어 캠퍼스 내 노출 부담을 줄여줘요.",
    "연락처 차단은 전화번호를 해시 처리해 저장하며, 미저장 연락처·번호 변경 등 예외 상황은 안내하되 원치 않는 상대는 프로필·채팅방에서 즉시 차단·신고할 수 있어요.",
  ],
  sections: [
    {
      id: "contact-block",
      heading: "1. 연락처 기반 지인 차단 (앱 전용·선택)",
      items: [
        "앱에서 연락처 동기화에 동의하면 내 연락처에 저장된 지인에게 내 프로필이 보이지 않도록 설정할 수 있어요.",
        "수집된 전화번호는 해시 처리하여 저장되며, 동의하지 않아도 기본 매칭은 그대로 이용할 수 있어요.",
        "연락처 기반 지인 차단 기능은 모바일 앱(iOS·Android)에서 이용할 수 있어요.",
      ],
    },
    {
      id: "same-school-exclude",
      heading: "2. 같은 학교·같은 학과 제외",
      items: [
        "같은 학교 제외: 켜면 다음 소개부터 같은 학교 사람은 빼고 추천해요.",
        "같은 학과 제외: 같은 학교는 괜찮고 같은 학과만 피하고 싶을 때 학과 단위로 제외할 수 있어요.",
        "설정을 바꾸면 다음 소개부터 적용되며, 이미 매칭된 상대와의 연결은 그대로 유지돼요.",
      ],
    },
    {
      id: "limits-and-safety",
      heading: "알아두어야 할 한계와 추가 보호 기능",
      body: [
        "지인 차단과 같은 학교·학과 제외는 아는 사람과 마주칠 위험을 줄이는 설정이에요. 연락처에 없는 번호이거나 상대가 번호를 바꾼 경우 등 모든 상황에서의 노출 방지를 보장하지는 않아요.",
        "원치 않는 상대가 보이면 프로필·채팅방에서 즉시 차단하거나 신고할 수 있고, 학교 인증과 안전 안내에서 추가 보호 기준을 확인할 수 있어요.",
      ],
    },
  ],
  links: [
    { label: "한일 매칭 안내", href: "/korea-japan-matching" },
    { label: "썸타임 안전 안내", href: "/safety" },
    { label: "학교 인증 안내", href: "/verification" },
    { label: "쉬운 개인정보 안내", href: "/privacy/easy" },
    { label: "대학생 소개팅 앱 4곳 비교", href: "/dating-app-ranking" },
    { label: "자주 묻는 질문", href: "/faq" },
  ],
};
