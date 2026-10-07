import Link from "next/link";
import React from "react";
import { IMAGE_FALLBACKS } from "@/app/_lib/public-content";
import { ContentMedia } from "./ContentMedia";
import {
  contentListHref,
  contentDisplayTitle,
  type ContentListState,
  getContentCategories,
  getContentPage,
  type ContentPreview,
} from "./content-list";

export type { ContentPreview } from "./content-list";

const categoryLabels: Record<string, string> = {
  tips: "연애·소개팅 팁",
  story: "팀 이야기",
  safety: "안전 안내",
  update: "업데이트",
};

export function ContentHome({
  activeSource,
  eyebrow,
  title,
  description,
  items,
  state,
  path,
}: {
  activeSource: ContentPreview["source"];
  eyebrow: string;
  title: string;
  description: string;
  items: ContentPreview[];
  state: ContentListState;
  path: string;
}) {
  const id = `${activeSource}-archive`;
  const categories = getContentCategories(items);
  const result = getContentPage(items, state);
  const pageHref = (page: number) => contentListHref(path, { category: state.category, page });

  const tabClass = (active: boolean) =>
    `-mb-px inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 px-3.5 text-[15px] font-semibold transition-colors duration-150 ${
      active ? "border-[#201823] text-[#201823]" : "border-transparent text-[#625A68] hover:text-[#201823]"
    }`;

  return (
    <section className="mx-auto w-full max-w-[768px] px-6 pb-16 pt-8 sm:pt-12" aria-labelledby={`${id}-title`}>
      <header className="max-w-2xl">
        <p className="text-sm font-bold text-[#5B35B5]">{eyebrow}</p>
        <h1 id={`${id}-title`} className="mt-2 font-wantedSans text-[32px] font-extrabold leading-[1.3] tracking-[-0.04em] text-[#201823] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-[17px] leading-[1.7] text-[#625A68]">{description}</p>
      </header>

      <div className="scroll-mt-24 mt-6">
        <nav aria-label="분류" aria-controls={`${id}-list`} className="flex gap-1 overflow-x-auto border-b border-[#EEE8FF] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={contentListHref(path, { category: "", page: 1 })} rel="nofollow" aria-current={state.category ? undefined : "true"} className={tabClass(!state.category)}>
            전체
          </Link>
          {categories.map(({ label }) => (
            <Link
              key={label}
              href={contentListHref(path, { category: label, page: 1 })}
              rel="nofollow"
              aria-current={state.category === label ? "true" : undefined}
              className={tabClass(state.category === label)}
            >
              {categoryLabels[label] ?? label}
            </Link>
          ))}
        </nav>
        <p role="status" aria-live="polite" aria-atomic="true" className="mt-3 text-sm leading-6 text-[#625A68]">
          {result.total === 0 ? "등록된 글 없음" : `${result.start + 1}–${result.start + result.items.length} / ${result.total}편`}
        </p>

        <ol id={`${id}-list`} start={result.start + 1} className="divide-y divide-[#EEE8FF]">
          {result.items.map((item) => {
            const hasImage = item.image && !IMAGE_FALLBACKS.some((fallback) => fallback === item.image);
            return (
              <li key={`${item.source}-${item.id}`}>
                <article>
                  <Link href={item.href} aria-label={item.title} title={item.title} className="group grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 py-7">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] leading-5 text-[#625A68]">
                        {item.archive ? <span className="rounded-md bg-[#F4F0FF] px-2 py-0.5 font-semibold text-[#5B35B5]">{item.archive.label} · <time dateTime={item.archive.endedOn}>{item.archive.endedOn}</time></span> : null}
                        <span className="font-bold text-[#5B35B5]">{categoryLabels[item.label] ?? item.label}</span>
                        {item.meta ? <><span aria-hidden="true">·</span><span>{item.meta}</span></> : null}
                      </div>
                      <h2 className="mt-1.5 font-wantedSans text-xl font-extrabold leading-[1.45] tracking-[-0.03em] text-[#201823] group-hover:text-[#5B35B5] sm:text-[22px]">
                        {contentDisplayTitle(item.title)}
                      </h2>
                      {item.description ? <p className="mt-2 line-clamp-2 text-base leading-[1.65] text-[#625A68]">{item.description}</p> : null}
                    </div>
                    {hasImage ? (
                      <div className="relative aspect-square w-20 rounded-lg bg-[#F4F0FF] sm:w-28">
                        <ContentMedia src={item.image} seed={item.id} className="rounded-lg object-cover" sizes="(min-width: 640px) 112px, 80px" />
                      </div>
                    ) : null}
                  </Link>
                </article>
              </li>
            );
          })}
        </ol>
        {result.total === 0 ? <p className="py-8 text-base leading-7 text-[#625A68]">현재 표시할 글이 없습니다. 다른 공개 콘텐츠를 둘러보세요.</p> : null}
      </div>

      {result.pageCount > 1 ? (
        <nav aria-label="콘텐츠 페이지" className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-[#EEE8FF] pt-6">
          {result.page > 1 ? <Link href={pageHref(result.page - 1)} rel="prev" className="public-page-button px-4">이전</Link> : null}
          {Array.from({ length: result.pageCount }, (_, index) => index + 1).map((page) => (
            <Link key={page} href={pageHref(page)} aria-label={`${page}페이지`} aria-current={page === result.page ? "page" : undefined} className="public-page-button px-3">
              {page}
            </Link>
          ))}
          {result.page < result.pageCount ? <Link href={pageHref(result.page + 1)} rel="next" className="public-page-button px-4">다음</Link> : null}
        </nav>
      ) : null}

      <aside className="mt-10 border-t border-[#EEE8FF] pt-6" aria-label="다른 공개 콘텐츠">
        <p className="text-base font-semibold text-[#201823]">다른 이야기 둘러보기</p>
        <div className="mt-2 flex flex-wrap gap-x-6 text-sm font-semibold text-[#5B35B5]">
          {activeSource !== "story" ? <Link className="inline-flex min-h-11 items-center hover:underline" href="/blog">스토리</Link> : null}
          {activeSource !== "card-news" ? <Link className="inline-flex min-h-11 items-center hover:underline" href="/card-news">카드뉴스</Link> : null}
          {activeSource !== "community" ? <Link className="inline-flex min-h-11 items-center hover:underline" href="/stories">커뮤니티</Link> : null}
          <Link className="inline-flex min-h-11 items-center hover:underline" href="/download">앱 다운로드</Link>
        </div>
      </aside>
    </section>
  );
}
