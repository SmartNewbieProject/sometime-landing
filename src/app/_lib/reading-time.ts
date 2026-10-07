// 한국어 장문은 분당 약 500자 정도로 읽는다고 보고 계산한다(표시용 추정치).
const CHARS_PER_MINUTE = 500;

/** 마크다운 본문의 읽는 시간(분). 본문이 비어 있으면 값을 만들어 내지 않고 null. */
export function readingMinutes(markdown: string | null | undefined): number | null {
  const text = (markdown ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[#>*_`|~-]/g, "")
    .replace(/\s+/g, "");
  if (!text) return null;
  return Math.max(1, Math.ceil(text.length / CHARS_PER_MINUTE));
}
