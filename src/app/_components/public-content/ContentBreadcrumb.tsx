import Link from "next/link";

export type Crumb = {
  href?: string;
  label: string;
};

type ContentBreadcrumbProps = {
  items: Crumb[];
};

/**
 * 캠퍼스 톤 브레드크럼 — 감성 구분선 + 접근성 트리
 */
export function ContentBreadcrumb({ items }: ContentBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="현재 위치" className="mb-7">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium leading-[20px] text-[#9B8EBD]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? (
                <span className="text-[#D4C6F5]" aria-hidden="true">
                  ·
                </span>
              ) : (
                <span className="text-[#C8B8F4]" aria-hidden="true">
                  ✦
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-[#7A4AE2]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "line-clamp-1 max-w-[min(100%,280px)] text-[#666]" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
