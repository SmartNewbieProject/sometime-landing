"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { FaqItem } from "@/app/_lib/faq";
import { READING_H2, READING_LINK } from "./reading-styles";

type FaqAccordionProps = {
  items: FaqItem[];
  title?: string;
  description?: string;
  /** 페이지 내 여러 아코디언 구분 */
  className?: string;
};

export function FaqAccordion({
  items,
  title = "자주 묻는 질문",
  description,
  className = "",
}: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) return null;

  return (
    <section
      className={className}
      aria-labelledby={`${baseId}-heading`}
    >
      <h2
        id={`${baseId}-heading`}
        className={READING_H2}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-[17px] leading-[1.7] text-[#625A68]">{description}</p>
      ) : null}

      <div className="mt-4 divide-y divide-[#EEE8FF] border-y border-[#EEE8FF]">
        {items.map((item, index) => {
          const panelId = `${baseId}-panel-${item.id}`;
          const buttonId = `${baseId}-btn-${item.id}`;
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className="overflow-hidden"
            >
              <h3 className="m-0">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-150"
                >
                  <span className="text-[18px] font-bold leading-[1.6] tracking-[-0.02em] text-[#201823]">
                    <span className="mr-2 text-[#625A68]" aria-hidden="true">
                      Q{index + 1}.
                    </span>
                    {item.question}
                  </span>
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F4F0FF] text-[18px] font-medium text-[#5B35B5] transition ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="pb-5"
              >
                <p className="break-keep text-pretty text-[19px] leading-[1.85] tracking-[-0.01em] text-[#2A2330] sm:text-xl">{item.answer}</p>
                {item.relatedHref ? (
                  <Link
                    href={item.relatedHref}
                    className={`mt-3 inline-flex min-h-11 items-center text-[15px] ${READING_LINK}`}
                  >
                    {item.relatedLabel ?? "관련 글 보기"} →
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
