"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { FaqItem } from "@/app/_lib/faq";

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
      className={`rounded-[28px] border border-[#EEE8FF] bg-[#FCFAFF] p-6 sm:p-8 ${className}`}
      aria-labelledby={`${baseId}-heading`}
    >
      <h2
        id={`${baseId}-heading`}
        className="font-wantedSans text-[22px] font-bold leading-[30px] text-black sm:text-[26px] sm:leading-[34px]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-[15px] font-medium leading-[24px] text-[#666]">{description}</p>
      ) : null}

      <div className="mt-6 flex flex-col gap-2">
        {items.map((item, index) => {
          const panelId = `${baseId}-panel-${item.id}`;
          const buttonId = `${baseId}-btn-${item.id}`;
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-[18px] border border-[#EEE8FF] bg-white"
            >
              <h3 className="m-0">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-[#FCFAFF] sm:px-5"
                >
                  <span className="text-[15px] font-semibold leading-[22px] text-[#201823] sm:text-[16px] sm:leading-[24px]">
                    <span className="mr-2 text-[#9B8EBD]" aria-hidden="true">
                      Q{index + 1}.
                    </span>
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F4F0FF] text-[18px] font-medium text-[#7A4AE2] transition ${
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
                className="border-t border-[#F1ECFA] px-4 pb-4 pt-3 sm:px-5"
              >
                <p className="text-[15px] font-medium leading-[26px] text-[#555]">{item.answer}</p>
                {item.relatedHref ? (
                  <Link
                    href={item.relatedHref}
                    className="mt-3 inline-flex text-[14px] font-semibold text-[#7A4AE2] underline-offset-4 hover:underline"
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
