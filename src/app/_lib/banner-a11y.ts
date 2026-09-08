/**
 * 배너 이미지 접근성 가이드 (자동 규칙)
 *
 * 수동(권장, 어드민 업로드 시):
 * - alt: 이미지에 담긴 장면·의미를 한 문장으로 (장식용이면 빈 alt)
 * - caption: 독자에게 보이는 짧은 설명 (부제·한 줄 요약)
 *
 * 자동(랜딩 표시 시, 수동값 없을 때):
 * - alt = "{title} — 썸타임 콘텐츠 대표 이미지"
 * - caption = 이미지 자체에 대한 수동 설명만 사용 (도입부 중복 방지)
 */

export function getBannerAlt(title: string, explicitAlt?: string | null): string {
  const manual = explicitAlt?.trim();
  if (manual !== undefined && manual !== null) return manual;
  const clean = title.trim() || "썸타임 콘텐츠";
  return `${clean} — 썸타임 콘텐츠 대표 이미지`;
}

/** The API's optional media dimensions reserve space before the image loads. */
export function getBannerDimensions(asset?: { url?: string; width?: number; height?: number } | null) {
  const { width, height } = asset ?? {};
  return width && height && Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0
    ? { width, height }
    : {};
}

export function getBannerCaption(options: {
  caption?: string | null;
  subtitle?: string | null;
  excerpt?: string | null;
}): string | null {
  const manual = options.caption?.trim();
  if (manual) return manual;

  return null;
}
