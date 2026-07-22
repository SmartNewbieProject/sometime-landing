export type ContentStoreCtaKind = "comparison" | "trust" | "campus" | "relationship";

type ContentStoreCtaCopy = {
  kind: ContentStoreCtaKind;
  heading: string;
  description: string;
};

const comparisonKeywords = ["비교", "추천", "연픽", "캠퍼스팅", "짝꿍", "소개팅 앱"];
const trustKeywords = ["학교 인증", "학생 인증", "안전", "지인 차단", "신고", "사기", "신원", "허위 프로필"];
const campusKeywords = ["캠퍼스", "대학교", "대학생", "과팅", "미팅", "학교", "학과"];

function containsAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

export function resolveContentStoreCta(input: {
  title: string;
  category?: string | null;
  keywords?: string[] | null;
  description?: string | null;
}): ContentStoreCtaCopy {
  const searchable = [input.title, input.category, input.description, ...(input.keywords ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (containsAny(searchable, comparisonKeywords)) {
    return {
      kind: "comparison",
      heading: "대학생 소개팅 앱, 공식 앱에서 직접 확인해보세요",
      description: "학교 인증과 캠퍼스 매칭을 확인하고 내 기준에 맞는지 부담 없이 시작할 수 있어요.",
    };
  }

  if (containsAny(searchable, trustKeywords)) {
    return {
      kind: "trust",
      heading: "안전 기준을 확인했다면 공식 앱에서 시작하세요",
      description: "학교 인증과 신고·차단 기능을 바탕으로 대학생 인연을 안전하게 만나보세요.",
    };
  }

  if (containsAny(searchable, campusKeywords)) {
    return {
      kind: "campus",
      heading: "학교 인증하고 가까운 캠퍼스 인연을 만나보세요",
      description: "같은 지역과 인접 대학을 중심으로 연결되는 썸타임 공식 앱에서 시작할 수 있어요.",
    };
  }

  return {
    kind: "relationship",
    heading: "읽은 이야기를 새로운 인연으로 이어가세요",
    description: "취향과 관계의 속도를 존중하는 썸타임 공식 앱에서 나에게 맞는 인연을 만나보세요.",
  };
}
