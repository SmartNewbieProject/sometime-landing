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

  return (
    <section className="mx-auto w-full max-w-[900px] px-5 pb-16 pt-8 sm:px-8 sm:pt-12" aria-labelledby={`${id}-title`}>
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide text-[#5B35B5]">{eyebrow}</p>
        <h1 id={`${id}-title`} className="mt-2 font-wantedSans text-4xl font-extrabold leading-tight tracking-tight text-[#201823] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-[#625A68]">{description}</p>
      </header>

      <div className="scroll-mt-24 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#EEE8FF] pb-4">
          <form action={path} method="get" className="flex min-w-0 max-w-full items-center gap-3">
            <label htmlFor={`${id}-category`} className="shrink-0 text-sm font-semibold text-[#625A68]">분류</label>
            <select
              id={`${id}-category`}
              key={state.category}
              name="category"
              defaultValue={state.category}
              aria-controls={`${id}-list`}
              className="min-h-11 min-w-0 max-w-full rounded-xl border border-[#EEE8FF] bg-[#FCFAFF] px-3 py-2 text-base font-semibold text-[#5B35B5]"
            >
              <option value="">전체 ({items.length})</option>
              {categories.map(({ label, count }) => (
                <option key={label} value={label}>{categoryLabels[label] ?? label} ({count})</option>
              ))}
            </select>
            <button type="submit" className="public-page-button shrink-0 px-3">보기</button>
          </form>
          <p role="status" aria-live="polite" aria-atomic="true" className="text-sm leading-6 text-[#625A68]">
            {result.total === 0 ? "등록된 글 없음" : `${result.start + 1}–${result.start + result.items.length} / ${result.total}편`}
          </p>
        </div>

        <ol id={`${id}-list`} start={result.start + 1} className="divide-y divide-[#EEE8FF]">
          {result.items.map((item) => {
            const hasImage = item.image && !IMAGE_FALLBACKS.some((fallback) => fallback === item.image);
            return (
              <li key={`${item.source}-${item.id}`}>
                <article>
                  <Link href={item.href} aria-label={item.title} title={item.title} className="group grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2 rounded-xl py-6 transition-colors duration-150 hover:bg-[#FCFAFF] sm:gap-x-6 sm:py-8">
                    <div className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-6 text-[#625A68]">
                      {item.archive ? <span className="rounded-md bg-[#F4F0FF] px-2 py-1 font-semibold text-[#5B35B5]">{item.archive.label} · <time dateTime={item.archive.endedOn}>{item.archive.endedOn}</time></span> : null}
                      <span className="font-semibold text-[#5B35B5]">{categoryLabels[item.label] ?? item.label}</span>
                      {item.meta ? <span>{item.meta}</span> : null}
                    </div>
                    <h2 className="col-span-2 font-wantedSans text-xl font-bold leading-8 tracking-tight text-[#201823] group-hover:text-[#5B35B5] sm:text-2xl sm:leading-9">
                      {contentDisplayTitle(item.title)}
                    </h2>
                    <div className="min-w-0">
                      {item.description ? <p className="line-clamp-2 text-base leading-7 text-[#625A68]">{item.description}</p> : null}
                      <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold leading-6 text-[#5B35B5]">
                        글 읽기 <span aria-hidden="true">→</span>
                      </span>
                    </div>
                    {hasImage ? (
                      <div className="relative aspect-square w-20 rounded-xl bg-[#F4F0FF] sm:w-36">
                        <ContentMedia src={item.image} seed={item.id} className="rounded-xl object-contain" sizes="(min-width: 640px) 144px, 80px" />
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
