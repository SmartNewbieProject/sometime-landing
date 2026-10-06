// 서버 지역 코드의 한글 표기(solo-nestjs-api kr-region-expansion-path-builder.strategy.ts)와 동일하게 유지한다.
export const UNIVERSITY_REGION_LABELS: Record<string, string> = {
  BSN: "부산광역시",
  CAN: "천안시",
  CJU: "청주시",
  DGU: "대구광역시",
  DJN: "대전광역시",
  ICN: "인천광역시",
  KYG: "경기도",
  SEL: "서울특별시",
};

// 같은 학교명이 지역별 별도 코드(캠퍼스)로 등록돼 있고 canonical 별칭으로 합쳐지지 않은 쌍.
// 새 쌍이 생기면 여기에 추가한다. 별칭으로 합치는 쪽은 seo-canary-policy.ts 의 UNIVERSITY_CANONICAL_ALIASES.
const SHARED_NAME_UNIVERSITY_CODES = new Set([
  "KYGDKU",
  "CADKU",
  "KYGGCU",
  "ICNGCU",
  "SELSMU",
  "CASMU",
]);

type UniversityIdentity = {
  name: string;
  code: string;
  region?: string | null;
};

/** 제목·h1·구조화 데이터에 쓰는 학교 표시명. 동명 학교 쌍은 지역을 붙여 구분한다. */
export function universityDisplayName({ name, code, region }: UniversityIdentity): string {
  if (!SHARED_NAME_UNIVERSITY_CODES.has(code)) return name;

  const label = region ? UNIVERSITY_REGION_LABELS[region] : undefined;
  if (!label) {
    throw new Error(
      `University ${code} (${name}) shares its name with another campus but region "${region ?? ""}" has no label`,
    );
  }
  return `${name}(${label})`;
}
