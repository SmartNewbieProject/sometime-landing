import type { ReactNode } from "react";

/** 안내·목록 페이지 머리말. ArticleHeader 와 같은 분류·제목·부제 타이포(작성자 행 없음). */
export function PageHeader({
  eyebrow,
  title,
  lead,
  className = "mb-10",
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <header className={className}>
      {eyebrow ? <p className="mb-3 text-sm font-bold text-[#5B35B5]">{eyebrow}</p> : null}
      <h1 className="font-wantedSans text-[32px] font-extrabold leading-[1.3] tracking-[-0.04em] text-[#201823] sm:text-[44px]">
        {title}
      </h1>
      {lead ? <div className="mt-4 text-lg leading-[1.6] tracking-[-0.01em] text-[#625A68] sm:text-[21px]">{lead}</div> : null}
    </header>
  );
}
