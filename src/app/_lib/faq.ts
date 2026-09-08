/** 공개 FAQ 허브 + 본문 추출용 데이터 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** 관련 내부 링크 (선택) */
  relatedHref?: string;
  relatedLabel?: string;
};

export type FaqGroup = {
  id: string;
  title: string;
  description: string;
  items: FaqItem[];
};

export const FAQ_HUB_GROUPS: FaqGroup[] = [
  {
    id: "start",
    title: "시작하기",
    description: "썸타임이 처음이라면, 여기부터 읽어보세요.",
    items: [
      {
        id: "who",
        question: "썸타임은 대학생만 이용할 수 있나요?",
        answer:
          "네. 매칭 등 주요 기능은 학교 인증 절차를 완료한 대학생이 이용할 수 있습니다. 가입·인증 가능 여부는 앱에 표시되는 현재 인증 기준을 확인해 주세요.",
        relatedHref: "/verification",
        relatedLabel: "학교 인증 방법 보기",
      },
      {
        id: "verify",
        question: "학교 인증 소개팅이 왜 중요한가요?",
        answer:
          "학교 인증은 매칭 등 주요 기능을 대학생 이용자 중심으로 운영하고 허위 가입을 줄이기 위한 절차입니다. 인증은 학교 이메일 또는 학생 신분 확인 자료로 진행할 수 있습니다.",
        relatedHref: "/verification",
        relatedLabel: "인증 경로 확인하기",
      },
      {
        id: "free",
        question: "썸타임은 무료로 이용할 수 있나요?",
        answer:
          "썸타임은 무료로 시작할 수 있으며, 일부 기능은 유료로 제공됩니다. 유료 기능의 비용과 이용 조건은 앱에서 사용 전에 확인할 수 있습니다.",
      },
    ],
  },
  {
    id: "matching",
    title: "매칭과 캠퍼스",
    description: "어떻게 연결되고, 무엇이 다른지.",
    items: [
      {
        id: "campus",
        question: "캠퍼스 매칭은 일반 소개팅 앱과 무엇이 다른가요?",
        answer:
          "썸타임은 학교 인증 정보와 앱에 등록된 지역을 바탕으로 대학생 매칭을 제공합니다. 실제 추천 범위와 이용 가능한 기능은 앱의 현재 설정과 안내에서 확인할 수 있습니다.",
      },
      {
        id: "choose",
        question: "대학생 소개팅 앱은 어떤 기준으로 골라야 하나요?",
        answer:
          "학교 인증 여부, 실제 만남 가능한 생활권, 프로필 검수와 신고 대응, 부담 없는 매칭 구조를 함께 확인하는 것이 좋습니다.",
        relatedHref: "/blog/yeonpick-vs-sometime",
        relatedLabel: "연픽 vs 썸타임 비교 읽기",
      },
      {
        id: "local",
        question: "지방 대학생도 소개팅 앱에서 만날 수 있나요?",
        answer:
          "지원되는 학교와 지역이라면 이용할 수 있습니다. 다만 지역별 이용 가능 여부나 매칭 결과는 고정되어 있지 않으므로 앱에서 학교 인증과 현재 안내를 확인해 주세요.",
      },
    ],
  },
  {
    id: "safety",
    title: "안전과 신뢰",
    description: "마음이 편해야 대화도 편해집니다.",
    items: [
      {
        id: "photo",
        question: "사진은 언제 공개되나요?",
        answer:
          "사진 공개 시점은 한 가지로 고정되지 않습니다. 앱에서 선택한 사진·캐릭터 공개 모드와 매칭별 공개 상태에 따라 상대에게 보이는 모습이 달라지며, 현재 상태는 앱의 프로필 공개 관리 화면에서 확인할 수 있습니다.",
        relatedHref: "/safety",
        relatedLabel: "프로필 안전 안내 보기",
      },
      {
        id: "report",
        question: "불편한 상대를 신고하거나 차단할 수 있나요?",
        answer:
          "네. 상대 프로필, 채팅방 또는 커뮤니티의 신고 기능을 이용하고 더 이상 연락받고 싶지 않다면 차단해 주세요. 긴급한 위험은 먼저 112 등 공식 기관에 연락해야 합니다.",
        relatedHref: "/safety",
        relatedLabel: "신고·차단 안내 보기",
      },
    ],
  },
];

export function allFaqItems(groups: FaqGroup[] = FAQ_HUB_GROUPS): FaqItem[] {
  return groups.flatMap((g) => g.items);
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

const FAQ_HEADING =
  /^(#{2,3})\s*(FAQ|Q\s*&\s*A|자주\s*묻는\s*질문|자주묻는질문)\s*$/i;

/**
 * 본문에서 FAQ 섹션을 분리.
 * ## FAQ / ## 자주 묻는 질문 아래의 ### 질문을 Q, 이어지는 문단을 A로 파싱.
 */
export function splitContentAndFaq(markdown: string): {
  body: string;
  faqs: FaqItem[];
} {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let fence = "";
  const faqStart = lines.findIndex((line) => {
    const marker = line.trim().match(/^(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = "";
      return false;
    }
    return !fence && FAQ_HEADING.test(line.trim());
  });

  if (faqStart < 0) {
    return { body: markdown, faqs: [] };
  }

  const level = lines[faqStart].trim().match(FAQ_HEADING)![1].length;
  const nextHeading = lines.findIndex((line, index) => {
    if (index <= faqStart) return false;
    const heading = line.trim().match(/^(#{1,6})\s+/);
    return heading !== null && heading[1].length <= level;
  });
  const faqEnd = nextHeading < 0 ? lines.length : nextHeading;
  const faqLines = lines.slice(faqStart + 1, faqEnd);
  const faqs: FaqItem[] = [];
  let unparsed = false;

  let currentQ: string | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (!currentQ) return;
    const answer = answerLines.join("\n").trim();
    if (answer) {
      faqs.push({
        id: `inline-${faqs.length + 1}`,
        question: currentQ,
        answer,
      });
    } else unparsed = true;
    currentQ = null;
    answerLines = [];
  };

  for (const raw of faqLines) {
    const line = raw.trim();
    if (!line) {
      if (currentQ) answerLines.push("");
      continue;
    }
    const questionHeading = line.match(/^(#{1,6})\s+(.+)$/);
    if (questionHeading && questionHeading[1].length === level + 1) {
      flush();
      currentQ = questionHeading[2].trim();
      continue;
    }
    // Q. / Q: 패턴
    const qMatch = line.match(/^(?:\*\*)?Q[.、:：)]\s*(.+?)(?:\*\*)?$/i);
    if (qMatch) {
      flush();
      currentQ = qMatch[1].trim();
      continue;
    }
    if (currentQ) {
      const aMatch = line.match(/^(?:\*\*)?A[.、:：)]\s*(.+?)(?:\*\*)?$/i);
      answerLines.push(aMatch ? aMatch[1] : line);
    } else unparsed = true;
  }
  flush();

  // Do not remove a section unless every nonempty line belongs to a parsed Q/A.
  if (unparsed || faqs.length === 0) return { body: markdown, faqs: [] };
  const body = [...lines.slice(0, faqStart), ...lines.slice(faqEnd)].join("\n").trim();
  return { body, faqs };
}

/** 본문에 FAQ가 없을 때 상세 하단에 붙일 기본 질문 (과하지 않게 3개) */
export function defaultDetailFaqs(kind: "story" | "card-news" | "community"): FaqItem[] {
  const base = allFaqItems().slice(0, 3);
  if (kind === "card-news") {
    return [
      {
        id: "card-what",
        question: "카드뉴스는 앱에서도 볼 수 있나요?",
        answer:
          "네. 공개 카드뉴스는 info 사이트에서 먼저 읽고, 더 많은 이야기와 매칭은 썸타임 앱에서 이어갈 수 있습니다.",
      },
      ...base.slice(0, 2),
    ];
  }
  return base;
}
