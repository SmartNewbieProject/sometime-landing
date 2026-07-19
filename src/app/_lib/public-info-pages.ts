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
    "썸타임 이용자가 개인정보 처리 원칙을 쉽게 이해할 수 있도록 기본 내용을 요약했어요.",
  keywords: [
    "썸타임 개인정보",
    "소개팅 앱 개인정보",
    "개인정보 처리방침 요약",
  ],
  answer: [
    "이 페이지는 썸타임의 개인정보 처리 원칙을 쉽게 설명하기 위한 공개 안내예요.",
    "법적 기준이 되는 상세 내용은 공식 개인정보처리방침과 앱 내 고지를 따라요.",
    "개인정보 관련 문의는 고객센터(notify@smartnewb.com)로 보낼 수 있어요.",
  ],
  sections: [
    {
      id: "what-we-collect",
      heading: "어떤 정보가 필요한가요",
      body: [
        "서비스 제공을 위해 가입, 인증, 프로필, 매칭, 고객 문의에 필요한 정보가 처리될 수 있어요.",
        "구체적인 항목과 보관 기간은 공식 개인정보처리방침에서 확인해 주세요.",
      ],
    },
    {
      id: "your-rights",
      heading: "이용자가 할 수 있는 일",
      items: [
        "내 정보 확인 요청",
        "계정 삭제 요청",
        "개인정보 문의 접수",
        "앱 내 설정 확인",
      ],
    },
  ],
  links: [
    { label: "개인정보처리방침 전문", href: PRIVACY_URL },
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
    "커뮤니티 가이드라인은 이용자가 서로를 존중하며 서비스를 이용하기 위한 기본 규칙이에요.",
    "부적절한 프로필, 메시지, 게시물, 괴롭힘은 운영 정책에 따라 제한될 수 있어요.",
    "구체적인 조치는 앱 내 신고와 운영 검토 결과에 따라 달라질 수 있어요.",
  ],
  sections: [
    {
      id: "principles",
      heading: "기본 원칙",
      items: [
        "상대방을 존중해요.",
        "허위 정보로 프로필을 만들지 않아요.",
        "원치 않는 연락이나 괴롭힘을 하지 않아요.",
      ],
    },
    {
      id: "restricted",
      heading: "제한될 수 있는 행동",
      items: [
        "모욕적이거나 위협적인 표현",
        "타인의 개인정보 공유",
        "스팸성 홍보",
        "서비스 목적과 맞지 않는 이용",
      ],
    },
  ],
  links: [
    { label: "썸타임 안전 안내", href: "/safety" },
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
    "공식 서비스명, 운영사, 도메인, 스토어 링크는 이 페이지의 정보를 기준으로 확인할 수 있어요.",
    "언론 및 제휴 문의는 고객센터(notify@smartnewb.com)로 연락해 주세요.",
  ],
  sections: [
    {
      id: "official",
      heading: "공식 정보",
      items: [
        "서비스명: 썸타임",
        "운영사: 스마트뉴비",
        "공식 도메인: https://some-in-univ.com",
        "문의: notify@smartnewb.com",
      ],
    },
    {
      id: "downloads",
      heading: "다운로드 링크",
      items: [
        "App Store: https://apps.apple.com/kr/app/id6746120889",
        "Google Play: https://play.google.com/store/apps/details?id=com.smartnewb.sometimes",
      ],
    },
  ],
};
