export type CardNewsTextRemoval = {
  id: string;
  reason: "pricing-rationale" | "campaign-instructions";
  blocks: readonly string[];
};

/**
 * Approved, reversible public-response removals. The exact provider blocks are
 * retained here for review; legal, refund, and privacy notices are not listed.
 */
export const CARD_NEWS_TEXT_REMOVALS = [
  {
    id: "019cad1b-7df2-7fae-a002-74ac08e16fce",
    reason: "pricing-rationale",
    blocks: [
      "## 변경 배경\n\n작년 9월 이후 더 많은 분들이 부담 없이 이용하실 수 있도록 가격 인하와 할인 이벤트(좋아요 무료, 구슬 할인 등)를 지속적으로 운영해왔습니다. 다만, 이 방식을 계속 유지하기에는 광고비, 서버 비용, 개발비 등 기본적인 운영 비용을 충당하기 어려운 상황이 되었습니다.\n\n학생 혼자서 운영비 적자를 감당하는 데 한계가 있어, 이벤트 가격을 종료하고 구슬 체계를 새롭게 정리하기로 결정했습니다.",
    ],
  },
  {
    id: "6b21fae4-26e1-4c85-a72a-0768a633ddce",
    reason: "campaign-instructions",
    blocks: [
      "## 참여 방법\n\n1. 인스타 DM으로 학교명 보내기\n2. 저희가 에타 업로드용 문구 전달\n3. 게시 후 캡처 인증\n4. 확인 후 구슬 10개 지급\n\n**DM**\n[썸타임 인스타그램](https://www.instagram.com/sometime.in.univ/)",
    ],
  },
] as const satisfies readonly CardNewsTextRemoval[];

type CardNewsContent = { id: string; body?: string | null };

/** Remove only explicitly approved strategic blocks from the public response. */
export function repairCardNews<T extends CardNewsContent>(item: T): T {
  if (!item.body) return item;
  const removal = CARD_NEWS_TEXT_REMOVALS.find((entry) => entry.id === item.id);
  if (!removal) return item;

  let body = item.body;
  for (const block of removal.blocks) body = body.replace(block, "");
  if (body === item.body) return item;
  body = body.replace(/\n{3,}/g, "\n\n").trim();
  return { ...item, body };
}
