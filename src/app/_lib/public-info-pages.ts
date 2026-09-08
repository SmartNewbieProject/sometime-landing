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
        "서비스명: 썸타임",
        "운영사: 스마트뉴비",
        "공식 도메인: https://some-in-univ.com",
        "서비스 형태: 대학생 학교 인증 기반 지역 매칭 앱",
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
  metaTitle: "썸타임이란 — 대학생 전용 소개팅 앱 소개",
  description:
    "썸타임은 학교 인증 대학생을 위한 지역 기반 소개팅 앱으로, 스마트뉴비가 운영해요.",
  keywords: ["썸타임이란", "대학생 소개팅 앱", "학교 인증 소개팅", "캠퍼스 매칭"],
  answer: [
    "썸타임은 대학생이 학교 인증을 거쳐 같은 지역의 대학생과 연결될 수 있도록 만든 소개팅 앱이에요.",
    "매칭 등 주요 기능은 학교 인증을 완료한 대학생이 이용할 수 있고, 실제 이용 가능 여부는 앱의 현재 인증 기준을 따라요.",
    "서비스 운영사는 스마트뉴비이며 공식 도메인은 some-in-univ.com이에요.",
  ],
  sections: [
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
    { label: "썸타임 소개", href: "/about" },
    { label: "썸타임 안전 안내", href: "/safety" },
  ],
};
