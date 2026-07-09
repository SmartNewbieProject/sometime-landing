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
          "썸타임은 대학생의 안전한 만남을 위해 학교 인증을 중요한 기준으로 사용합니다. 진짜 대학생끼리 더 자연스럽게 대화하고 만날 수 있도록 설계했습니다.",
      },
      {
        id: "verify",
        question: "학교 인증 소개팅이 왜 중요한가요?",
        answer:
          "학교 인증은 낯선 만남의 불안을 줄이고, 같은 생활권과 캠퍼스 문화를 공유하는 사람과 연결될 가능성을 높입니다.",
        relatedHref: "/blog",
        relatedLabel: "스토리에서 더 읽기",
      },
      {
        id: "free",
        question: "썸타임은 무료로 매칭을 받을 수 있나요?",
        answer:
          "썸타임은 매주 목요일과 일요일 무료 매칭을 제공해 대학생이 부담 없이 소개팅을 시작할 수 있도록 돕습니다. 좋아요 자체에도 비용이 들지 않는 구조입니다.",
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
          "캠퍼스 매칭은 단순히 많은 사람을 보여주는 방식이 아니라 같은 지역, 인접 대학, 실제 만남 가능한 생활권을 고려해 대학생에게 맞는 연결을 돕습니다.",
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
          "가능합니다. 전국 단위로 사람만 많이 보여주는 앱보다 같은 지역과 인접 대학 생활권을 함께 보는 서비스가 실제 만남으로 이어질 가능성이 높습니다.",
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
          "썸타임은 프로필 사진을 기반으로 매칭이 이뤄지며, 운영 검수와 신고 대응을 통해 신뢰를 지킵니다. 상대를 존중하는 대화 예절이 가장 중요합니다.",
      },
      {
        id: "one-friend",
        question: "한 학교 한 친구 원칙이 뭔가요?",
        answer:
          "같은 대학 내에서 이미 매칭된 상대와 중복으로 연결되지 않도록 운영하는 원칙입니다. 지인 노출에 민감한 대학생 정서를 반영한 기준입니다.",
        relatedHref: "/blog",
        relatedLabel: "운영 이야기 보러 가기",
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
  const faqStart = lines.findIndex((line) => FAQ_HEADING.test(line.trim()));

  if (faqStart < 0) {
    return { body: markdown, faqs: [] };
  }

  const body = lines.slice(0, faqStart).join("\n").trimEnd();
  const faqLines = lines.slice(faqStart + 1);
  const faqs: FaqItem[] = [];

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
    }
    currentQ = null;
    answerLines = [];
  };

  for (const raw of faqLines) {
    const line = raw.trim();
    if (!line) {
      if (currentQ) answerLines.push("");
      continue;
    }
    // 다음 대제목이면 FAQ 섹션 종료
    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) {
      flush();
      break;
    }
    if (/^###\s+/.test(line)) {
      flush();
      currentQ = line.replace(/^###\s+/, "").trim();
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
    }
  }
  flush();

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
