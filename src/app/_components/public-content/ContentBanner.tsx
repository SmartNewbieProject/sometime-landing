import { ContentMedia } from "./ContentMedia";
import { getBannerAlt, getBannerCaption } from "@/app/_lib/banner-a11y";

type ContentBannerProps = {
  src: string;
  title: string;
  seed?: string;
  /** 수동 alt (없으면 자동 규칙) */
  alt?: string | null;
  /** 이미지 자체의 설명만 사용; 도입부는 캡션으로 반복하지 않음 */
  caption?: string | null;
  subtitle?: string | null;
  excerpt?: string | null;
  priority?: boolean;
  width?: number;
  height?: number;
};

/**
 * 상세 히어로 배너 — alt/캡션 자동·수동 규칙 적용
 */
export function ContentBanner({
  src,
  title,
  seed,
  alt,
  caption,
  subtitle,
  excerpt,
  priority = true,
  width,
  height,
}: ContentBannerProps) {
  const resolvedAlt = getBannerAlt(title, alt);
  const resolvedCaption = getBannerCaption({ caption, subtitle, excerpt });

  return (
    <figure className="mb-10">
      <div className="mx-auto max-w-[640px]">
        <ContentMedia
          src={src}
          alt={resolvedAlt}
          seed={seed ?? title}
          className="rounded-2xl object-contain"
          fill={false}
          width={width}
          height={height}
          enlarge
          priority={priority}
          sizes="(min-width: 900px) 800px, 100vw"
        />
      </div>
      {resolvedCaption ? (
        <figcaption className="mt-3 px-1 text-[13px] font-medium leading-[20px] text-[#625A68]">
          {resolvedCaption}
        </figcaption>
      ) : null}
    </figure>
  );
}
