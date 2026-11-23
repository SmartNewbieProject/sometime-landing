export type UniversityFaqItem = {
  question: string;
  answer: string;
};

export type UniversityLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const UNIVERSITY_PROOF_FACTS = [
  { label: "학교 인증", value: "학교 이메일 또는 학생증·재학·졸업증명서" },
  { label: "지인 차단", value: "연락처 해시 차단 + 같은 학교·같은 학과 제외" },
  { label: "프로필 시작", value: "외모 점수 심사 없음 · 캐릭터 시작 및 선택 사진 공개" },
  { label: "1:1 첫 답장 속도", value: "채팅방 2,361개 기준 중앙값 11.7분 · 24시간 내 답장률 96.2%" },
] as const;

const CAMPUS_HUB_BASE = "https://campus.some-in-univ.com";

const CAMPUS_SEO_SLUG_BY_CODE: Record<string, string> = {
  HBU: "hanbat-university",
  CNU: "chungnam-national-university",
  KAIST: "kaist",
  DJU: "daejeon-university",
  MWU: "mokwon-university",
  PJU: "paichai-university",
  CBNU: "chungbuk-national-university",
  SELHYU: "hanyang-university",
  SELKOR: "korea-university",
  SELSSU: "soongsil-university",
  SELCAU: "chung-ang-university",
  SELSNU: "seoul-national-university",
  SELSKK: "sungkyunkwan-university",
  SELKMU: "kookmin-university",
  SELDGU: "dongguk-university",
  SELYSN: "yonsei-university",
  SELSTU: "seoultech",
};

export function buildUniversityCampusLinks({
  code,
  displayName,
}: {
  code: string;
  displayName: string;
}): UniversityLinkItem[] {
  const slug = CAMPUS_SEO_SLUG_BY_CODE[code.toUpperCase()];
  if (!slug) {
    return [
      {
        label: "전국 대학 학식·공지·학사일정 허브 보기",
        href: `${CAMPUS_HUB_BASE}/campus`,
        external: true,
      },
    ];
  }

  return [
    {
      label: `${displayName} 오늘 학식 보기`,
      href: `${CAMPUS_HUB_BASE}/campus/${slug}/meal`,
      external: true,
    },
    {
      label: `${displayName} 공지사항·학사일정`,
      href: `${CAMPUS_HUB_BASE}/campus/${slug}`,
      external: true,
    },
  ];
}

export function buildUniversityFaqs({
  displayName,
  region,
  regionLabel,
}: {
  displayName: string;
  region?: string | null;
  regionLabel?: string;
}): UniversityFaqItem[] {
  const regionAnswer =
    region === "DJN"
      ? "네. 썸타임은 대전권(충남대·KAIST·한밭대 등)에서 시작해 전국 대학으로 확장한 서비스로, 같은 생활권 인근 대학 또래와 1:1 매칭은 물론 대전 지역 오프라인 로테이션 소개팅도 정기적으로 운영하고 있어요."
      : regionLabel
        ? `네. ${regionLabel} 생활권과 인근 대학의 인증된 20대 또래를 중심으로 1:1 매칭이 연결되며, 앱 설정에서 같은 학교·같은 학과 제외 범위를 직접 조정할 수 있어요.`
        : "네. 가까운 생활권과 인근 대학의 인증된 20대 또래를 중심으로 1:1 매칭이 연결되며, 앱 설정에서 같은 학교·같은 학과 제외 범위를 직접 조정할 수 있어요.";

  return [
    {
      question: `${displayName} 학생은 썸타임 학교 인증을 어떻게 진행하나요?`,
      answer:
        "학교 이메일 인증 또는 학생증·재학·졸업증명서 제출 두 가지 경로 중 하나를 선택해 인증할 수 있어요. 인증이 끝나기 전에는 프로필이 다른 이용자에게 보이지 않아요.",
    },
    {
      question: `${displayName} 같은 학교나 같은 학과 사람을 피할 수 있나요?`,
      answer:
        "네. 앱 안에서 '같은 학교 제외'와 '같은 학과 제외' 설정을 각각 켜고 끌 수 있고, 모바일 앱에서는 연락처 해시 기반 지인 차단도 선택해 이용할 수 있어요.",
    },
    {
      question: `${displayName} 학생은 외모 점수 심사(3점컷) 없이 시작할 수 있나요?`,
      answer:
        "네. 썸타임은 타인이 점수를 매기는 외모 컷 심사가 없어요. 기본 프로필 검수와 학교 인증만 거치며, 캐릭터 프로필로 먼저 시작해 대화가 통하는 상대에게만 사진을 공개할 수 있어요.",
    },
    {
      question: `${displayName} 주변${regionLabel ? `(${regionLabel})` : ""} 인근 대학 또래와도 매칭되나요?`,
      answer: regionAnswer,
    },
    {
      question: `${displayName} 학생도 무료로 시작할 수 있나요?`,
      answer:
        "네. 무료로 가입해 시작할 수 있고 일부 기능은 유료예요. 필요한 조건과 비용은 앱에서 사용 전에 안내해요.",
    },
  ];
}

export function buildUniversityRelatedLinks({
  region,
}: {
  region?: string | null;
}): UniversityLinkItem[] {
  const isNonCapital = Boolean(region && !["SEL", "KYG", "ICN"].includes(region));

  return [
    { label: "지인 차단·같은 학교 제외 안내", href: "/block-acquaintances" },
    { label: "위피 vs 썸타임 비교 (2026)", href: "/blog/wippy-vs-sometime" },
    { label: "아만다 vs 썸타임 비교 (2026)", href: "/blog/amanda-vs-sometime" },
    ...(isNonCapital
      ? [{ label: "지방·거점 국립대 소개팅 앱 선택 기준", href: "/blog/regional-univ-dating-app-guide" }]
      : [{ label: "대학생 소개팅 앱 4곳 비교", href: "/dating-app-ranking" }]),
    { label: "한일 매칭·자동 번역 채팅", href: "/korea-japan-matching" },
    { label: "썸타임 실제 사용 후기", href: "/reviews" },
    { label: "시간·장소 먼저 정하는 1:1 약속", href: "/college-meeting" },
    { label: "전체 학교별 안내 보기", href: "/university" },
  ];
}
