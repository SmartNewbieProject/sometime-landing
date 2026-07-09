/**
 * 배너 이미지 접근성 가이드 (자동 규칙)
 *
 * 수동(권장, 어드민 업로드 시):
 * - alt: 이미지에 담긴 장면·의미를 한 문장으로 (장식용이면 빈 alt)
 * - caption: 독자에게 보이는 짧은 설명 (부제·한 줄 요약)
 *
 * 자동(랜딩 표시 시, 수동값 없을 때):
 * - alt = "{title} — 썸타임 콘텐츠 대표 이미지"
 * - caption = subtitle 또는 excerpt 1문장 (있으면)
 */

export function getBannerAlt(title: string, explicitAlt?: string | null): string {
  const manual = explicitAlt?.trim();
  if (manual) return manual;
  const clean = title.trim() || "썸타임 콘텐츠";
  return `${clean} — 썸타임 콘텐츠 대표 이미지`;
}

export function getBannerCaption(options: {
  caption?: string | null;
  subtitle?: string | null;
  excerpt?: string | null;
}): string | null {
  const manual = options.caption?.trim();
  if (manual) return manual;

  const subtitle = options.subtitle?.trim();
  if (subtitle) return subtitle;

  const excerpt = options.excerpt?.trim();
  if (!excerpt) return null;
  // 캡션은 짧게
  return excerpt.length > 90 ? `${excerpt.slice(0, 87)}…` : excerpt;
}
