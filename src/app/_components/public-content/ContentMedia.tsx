"use client";

import Image from "next/image";
import { useState } from "react";
import { fallbackImage, IMAGE_FALLBACKS } from "@/app/_lib/public-content";

type ContentMediaProps = {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** fill 컨테이너 안에서 사용 (기본 true) */
  fill?: boolean;
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
  seed = "",
}: ContentMediaProps) {
  const [current, setCurrent] = useState(src);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const handleError = () => {
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

  if (fill) {
    return (
      <Image
        src={current}
        alt={alt}
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

  return (
    <Image
      src={current}
      alt={alt}
      width={1200}
      height={750}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={handleError}
      unoptimized={isRemote(current)}
    />
  );
}
