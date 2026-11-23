export type ReplyGapOption = {
  label: string;
  score: 0 | 1 | 2;
};

export type ReplyGapQuestion = {
  id: string;
  prompt: string;
  options: [ReplyGapOption, ReplyGapOption, ReplyGapOption];
};

export type ReplyGapResultBand = {
  id: "strong" | "schedule" | "check" | "reset";
  minScore: number;
  maxScore: number;
  badge: string;
  title: string;
  summary: string;
  nextAction: string;
  links: Array<{ label: string; href: string }>;
};

export type ReplyGapFaq = {
  question: string;
  answer: string;
};

export const REPLY_GAP_QUESTIONS: ReplyGapQuestion[] = [
  {
    id: "avg-gap",
    prompt: "최근 3일 기준, 상대방의 평균 답장 시간은 어느 정도인가요?",
    options: [
      { label: "3시간 이내로 꾸준히 답장이 와요", score: 2 },
      { label: "반나절에서 12시간 안팎으로 와요", score: 1 },
      { label: "하루(24시간) 넘게 걸리는 일이 잦아요", score: 0 },
    ],
  },
  {
    id: "message-density",
    prompt: "답장이 왔을 때 메시지의 길이와 내용 밀도는 어떤가요?",
    options: [
      { label: "내 말에 반응하고 자기 일상도 덧붙여 줘요", score: 2 },
      { label: "무난하게 한두 문장 정도로 답해요", score: 1 },
      { label: "'네', 'ㅎㅎ', '그렇군요'처럼 단답으로 끝나요", score: 0 },
    ],
  },
  {
    id: "questions-back",
    prompt: "상대방이 나에게 질문을 되돌려 주는 편인가요?",
    options: [
      { label: "거의 매번 궁금한 점을 물어봐 줘요", score: 2 },
      { label: "가끔 흐름에 맞춰 물어보는 편이에요", score: 1 },
      { label: "내가 묻는 말에만 답하고 질문이 없어요", score: 0 },
    ],
  },
  {
    id: "busy-context",
    prompt: "답장이 늦었을 때 바쁜 일정에 대한 언급이 있나요?",
    options: [
      { label: "수업·알바·시험 등 일정을 자연스럽게 말해 줘요", score: 2 },
      { label: "별도 언급 없이 이어서 대화해요", score: 1 },
      { label: "답장은 없는데 SNS 활동만 보여요", score: 0 },
    ],
  },
  {
    id: "initiator",
    prompt: "대화를 먼저 여는(선톡) 비율은 어느 쪽이 더 높은가요?",
    options: [
      { label: "비슷하게 번갈아 가며 먼저 연락해요", score: 2 },
      { label: "내가 70% 이상 먼저 말을 걸어요", score: 1 },
      { label: "항상 내가 먼저 보내야 대화가 시작돼요", score: 0 },
    ],
  },
  {
    id: "next-date",
    prompt: "다음 약속이나 만남 얘기가 나왔을 때 상대 반응은 어떤가요?",
    options: [
      { label: "구체적인 요일이나 가고 싶은 곳을 함께 정해요", score: 2 },
      { label: "'시간 되면 봐요'처럼 열어 두는 편이에요", score: 1 },
      { label: "화제를 돌리거나 명확한 답이 없어요", score: 0 },
    ],
  },
  {
    id: "first-meet-vibe",
    prompt: "직전 만남(또는 첫 대화) 마무리 분위기는 어땠나요?",
    options: [
      { label: "잘 들어갔는지 묻고 아쉬움이 느껴졌어요", score: 2 },
      { label: "무난하고 예의 있게 마무리됐어요", score: 1 },
      { label: "조금 급하게 끝난 느낌이었어요", score: 0 },
    ],
  },
];

export const REPLY_GAP_RESULTS: ReplyGapResultBand[] = [
  {
    id: "strong",
    minScore: 11,
    maxScore: 14,
    badge: "11~14점 · 긍정 신호",
    title: "확실한 호감 신호형",
    summary:
      "답장 속도에 약간의 간격이 있더라도 내용 밀도와 질문이 살아 있어요. 상대방도 대화를 이어 갈 의사가 충분한 상태예요.",
    nextAction:
      "카톡만 길게 끌기보다 2~3일 안에 편한 요일과 동네를 물어 가벼운 다음 약속을 잡아 보세요.",
    links: [
      { label: "대학생 소개팅 첫 만남 대화 주제", href: "/blog/first-date-conversation" },
      { label: "1:1 약속으로 바로 만나기", href: "/college-meeting" },
    ],
  },
  {
    id: "schedule",
    minScore: 7,
    maxScore: 10,
    badge: "7~10점 · 리듬 차이",
    title: "일정·리듬 변수형",
    summary:
      "관심은 열려 있지만 시험·수업·알바 같은 생활 리듬 차이로 연락 텀이 길어졌을 가능성이 커요.",
    nextAction:
      "재촉하거나 이유를 추궁하기보다, 답하기 쉬운 가벼운 새 주제를 한 번 건네 보며 대화 온도를 지켜보세요.",
    links: [
      { label: "소개팅 후 연락 텀, 12시간·하루 기준 대처", href: "/blog/sogaeting-reply-gap" },
      { label: "소개팅 첫 카톡·선톡 멘트 7가지", href: "/blog/sogaeting-first-kakao" },
    ],
  },
  {
    id: "check",
    minScore: 4,
    maxScore: 6,
    badge: "4~6점 · 온도 확인",
    title: "온도 확인 필요형",
    summary:
      "상대가 망설이고 있거나 대화 소재가 끊겨 어색해진 구간이에요. 혼자 기다리기만 하면 마음 소모가 커지기 쉬워요.",
    nextAction:
      "부담 없는 질문이나 가벼운 약속 제안으로 딱 한 번만 의사를 확인해 보고, 반응에 따라 속도를 조절하세요.",
    links: [
      { label: "소개팅 첫 카톡·선톡 멘트 7가지", href: "/blog/sogaeting-first-kakao" },
      { label: "소개팅 후 연락 텀 대처 가이드", href: "/blog/sogaeting-reply-gap" },
    ],
  },
  {
    id: "reset",
    minScore: 0,
    maxScore: 3,
    badge: "0~3점 · 정리 권장",
    title: "마음 소모 정리 추천형",
    summary:
      "현재 신호만 보면 상대방이 대화를 이어 갈 에너지가 낮아 보여요. 억지로 답장을 끌어내기보다 내 일상으로 돌아오는 편이 건강해요.",
    nextAction:
      "신원과 학교가 확인된 또래들과 부담 없이 새로운 대화를 시작해 보는 것도 좋은 전환이 돼요.",
    links: [
      { label: "지인 차단·같은 학교 제외 안내", href: "/block-acquaintances" },
      { label: "사진 없이 시작하는 블라인드 소개팅 가이드", href: "/blog/blind-dating-app-guide" },
    ],
  },
];

export const REPLY_GAP_FAQS: ReplyGapFaq[] = [
  {
    question: "소개팅 연락 텀 호감도 자가진단은 무료인가요?",
    answer:
      "네, 별도 로그인이나 결제 없이 웹에서 바로 무료로 7문항을 체크하고 결과를 확인할 수 있어요.",
  },
  {
    question: "테스트 결과는 다른 사람에게 공개되나요?",
    answer:
      "아니요. 모든 계산은 브라우저 안에서만 이루어지며, 본인이 결과 텍스트를 직접 공유하지 않으면 외부에 저장되거나 공개되지 않아요.",
  },
  {
    question: "점수가 낮게 나오면 무조건 가능성이 없는 건가요?",
    answer:
      "단정하기는 어려워요. 시험기간이나 갑작스러운 일정처럼 예외 변수가 있을 수 있으므로, 점수 결과는 참고 기준으로 삼고 부담 없는 질문 한 번으로 실제 반응을 확인해 보세요.",
  },
  {
    question: "썸타임은 어떤 소개팅 앱인가요?",
    answer:
      "썸타임은 학교 이메일 또는 학생증·재학증명서 인증을 기반으로 대학(원)생과 졸업생을 연결하는 20대 소개팅 앱이에요. 연락처 지인 차단과 같은 학교·학과 제외 설정을 지원하며 무료로 시작할 수 있어요.",
  },
];

export function scoreReplyGapCheck(scores: number[]): {
  total: number;
  band: ReplyGapResultBand;
} {
  const total = scores.reduce((sum, val) => sum + (Number.isFinite(val) ? val : 0), 0);
  const clamped = Math.max(0, Math.min(14, total));
  const band =
    REPLY_GAP_RESULTS.find((item) => clamped >= item.minScore && clamped <= item.maxScore) ??
    REPLY_GAP_RESULTS[REPLY_GAP_RESULTS.length - 1];
  return { total: clamped, band };
}
