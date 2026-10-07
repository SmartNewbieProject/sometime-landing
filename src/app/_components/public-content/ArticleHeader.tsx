import type { ReactNode } from "react";
import { CopyLinkButton } from "./CopyLinkButton";

/**
 * 글 상세 공통 머리말: 분류 → 제목 → 부제 → 작성자 행.
 * 작성자 행의 원은 이름 첫 글자이며, 프로필 사진이 아니다.
 */
export function ArticleHeader({
  category,
  title,
  subtitle,
  authorName,
  publishedAt,
  publishedLabel,
  readingMinutes,
  extra,
  notice,
}: {
  category: string;
  title: string;
  subtitle?: string;
  authorName: string;
  publishedAt?: string | null;
  publishedLabel?: string;
  readingMinutes?: number | null;
  extra?: string;
  notice?: ReactNode;
}) {
  const initial = Array.from(authorName.trim())[0] ?? "";
  const meta: ReactNode[] = [];
  if (publishedLabel) meta.push(<time key="date" dateTime={publishedAt ?? undefined}>{publishedLabel}</time>);
  if (readingMinutes) meta.push(<span key="read">{readingMinutes}분 읽기</span>);
  if (extra) meta.push(<span key="extra">{extra}</span>);

  return (
    <header className="mb-8">
      {notice}
      <p className="mb-3 text-sm font-bold text-[#5B35B5]">{category}</p>
      <h1 className="font-wantedSans text-[32px] font-extrabold leading-[1.3] tracking-[-0.04em] text-[#201823] sm:text-[44px]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-4 text-lg leading-[1.6] tracking-[-0.01em] text-[#625A68] sm:text-[21px]">{subtitle}</p>
      ) : null}
      <div className="mt-7 flex items-center gap-3 border-y border-[#EEE8FF] py-4">
        <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F4F0FF] text-[15px] font-extrabold text-[#5B35B5]">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-snug text-[#201823]">{authorName}</p>
          {meta.length > 0 ? (
            <p className="flex flex-wrap items-center gap-x-1.5 text-sm leading-snug text-[#625A68]">
              {meta.map((node, index) => (
                <span key={index} className="inline-flex items-center gap-x-1.5">
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  {node}
                </span>
              ))}
            </p>
          ) : null}
        </div>
        <div className="ml-auto"><CopyLinkButton /></div>
      </div>
    </header>
  );
}
