/** A short source-derived deck; never repeat a whole imported preview as a caption. */
export function contentSummary(value?: string | null, fallback = ""): string {
  const text = (value?.trim() || fallback)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[(?:button:)?([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/(^|\s)_([^_]+)_(?=\s|$|[.,!?])/g, "$1$2")
    .replace(/[#>*`~]/g, "")
    .replace(/-{3,}/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = text.match(/[^.!?]+[.!?]+(?:[”’"']|$)?|[^.!?]+$/g) ?? [];
  const short = sentences.slice(0, 2).join("").trim();
  if (short.length <= 140) return short;
  const boundary = short.lastIndexOf(" ", 136);
  return `${short.slice(0, boundary > 70 ? boundary : 136).trimEnd()}…`;
}

/** One compact next action, selected from the article's purpose, not a sales stack. */
export function detailEndAction(kind: "story" | "card-news" | "community", title: string, intent?: "editorial" | "notice" | "campaign") {
  if (kind === "community") return { href: "/stories", label: "다른 커뮤니티 이야기 보기" };
  if (/약관/.test(title)) return { href: "https://ruby-composer-6d2.notion.site/1cd1bbec5ba1805dbafbc9426a0aaa80", label: "이용약관 전문 확인" };
  if (/개인정보/.test(title)) return { href: "/privacy/easy", label: "개인정보 안내 확인" };
  if (intent === "notice" || /환불|오류|장애|보상|문의|고객|가격|구슬/.test(title)) return { href: "mailto:notify@smartnewb.com", label: "고객센터에 이용 문의" };
  if (/학생증|학교 인증|학교인증/.test(title)) return { href: "/verification", label: "학교 인증 안내 보기" };
  if (/안전|차단/.test(title)) return { href: "/safety", label: "안전한 이용 안내 보기" };
  if (/로테이션/.test(title)) return { href: "/rotation", label: "로테이션 소개팅 안내 확인" };
  if (intent === "campaign" || /모집|이벤트/.test(title)) return { href: "/card-news", label: "다른 소식 확인" };
  return kind === "story"
    ? { href: "/blog", label: "다른 스토리 읽기" }
    : { href: "/card-news", label: "다른 카드뉴스 읽기" };
}
