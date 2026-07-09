import { ContentMedia } from "./ContentMedia";
import { getBannerAlt, getBannerCaption } from "@/app/_lib/banner-a11y";

type ContentBannerProps = {
  src: string;
  title: string;
  seed?: string;
  /** 수동 alt (없으면 자동 규칙) */
  alt?: string | null;
  /** 수동 캡션 (없으면 subtitle/excerpt) */
  caption?: string | null;
  subtitle?: string | null;
  excerpt?: string | null;
  priority?: boolean;
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
}: ContentBannerProps) {
  const resolvedAlt = getBannerAlt(title, alt);
  const resolvedCaption = getBannerCaption({ caption, subtitle, excerpt });

  return (
    <figure className="mb-10">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[32px] bg-[#f4edf8] shadow-[0_24px_90px_rgba(76,47,100,0.16)]">
        <ContentMedia
          src={src}
          alt={resolvedAlt}
          seed={seed ?? title}
          className="object-cover"
          priority={priority}
          sizes="(min-width: 900px) 800px, 100vw"
        />
      </div>
      {resolvedCaption ? (
        <figcaption className="mt-3 px-1 text-[13px] font-medium leading-[20px] text-[#9B8EBD]">
          {resolvedCaption}
        </figcaption>
      ) : null}
    </figure>
  );
}
