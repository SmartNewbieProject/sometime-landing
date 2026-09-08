"use client";

import Image from "next/image";
import { useState } from "react";
import { fallbackImage, IMAGE_FALLBACKS } from "@/app/_lib/public-content";
import { safeContentUrl } from "./MarkdownBody";

type ContentMediaProps = {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** fill 컨테이너 안에서 사용 (기본 true) */
  fill?: boolean;
  /** Readable detail media links to the original, never a cropped preview. */
  enlarge?: boolean;
  width?: number;
  height?: number;
  seed?: string;
};

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

/**
 * 콘텐츠 썸네일/히어로용 안전 이미지.
 * CDN 403·최적화 실패 시 로컬 브랜드 폴백으로 전환.
 */
export function ContentMedia({
  src,
  alt = "",
  className = "object-cover",
  priority = false,
  sizes = "(min-width: 1280px) 280px, (min-width: 768px) 33vw, 100vw",
  fill = true,
  enlarge = false,
  width,
  height,
  seed = "",
}: ContentMediaProps) {
  const [current, setCurrent] = useState(src);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (fallbackIndex >= IMAGE_FALLBACKS.length) {
      setFailed(true);
      return;
    }
    const next =
      IMAGE_FALLBACKS[fallbackIndex] ??
      fallbackImage(seed || current) ??
      IMAGE_FALLBACKS[0];

    if (next === current) {
      const altFallback =
        IMAGE_FALLBACKS[(fallbackIndex + 1) % IMAGE_FALLBACKS.length];
      setFallbackIndex((i) => i + 1);
      setCurrent(altFallback);
      return;
    }

    setFallbackIndex((i) => i + 1);
    setCurrent(next);
  };

  if (failed && fill) return <p role="status">이미지를 불러오지 못했습니다. {alt}</p>;

  const imageAlt = current === src ? alt : "원본 이미지를 불러오지 못해 표시한 썸타임 대체 이미지";
  if (fill) {
    return (
      <Image
        src={current}
        alt={imageAlt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
        onError={handleError}
        // 외부 CDN은 간헐적 403/대용량이 있어 최적화 실패 시 원본 직접 노출
        unoptimized={isRemote(current)}
      />
    );
  }

  // Reserve real source proportions when known. Otherwise this is explicitly
  // a stable viewing frame, not an invented image dimension or a cover crop.
  const aspectRatio = width && height ? `${width} / ${height}` : "3 / 4";
  const image = (
    <div data-content-media-frame className="relative w-full" style={{ aspectRatio }}>
      {failed ? <p role="status" className="absolute inset-0 flex items-center justify-center p-4">이미지를 불러오지 못했습니다. {alt}</p> : <Image
        src={current}
        alt={imageAlt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
        style={{ objectFit: "contain" }}
        onError={handleError}
        unoptimized
      />}
    </div>
  );

  const href = safeContentUrl(src);
  return enlarge && href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      aria-label={`${alt || "첨부 이미지"} — 원본 이미지 확대 (새 탭)`}
    >
      {image}
      <span className="mt-2 flex min-h-11 items-center justify-center text-sm font-semibold text-[#625A68] underline underline-offset-4">원본 이미지 확대 (새 탭)</span>
    </a>
  ) : image;
}
