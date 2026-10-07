import Link from "next/link";
import { IMAGE_FALLBACKS, formatDate, pickImageFor, type SometimeArticleListItem } from "@/app/_lib/public-content";
import { contentSummary } from "@/app/_lib/content-presentation";
import { ContentMedia } from "./ContentMedia";

/** 글 끝 "이어서 읽기": 목록 행과 같은 모양으로 2~3개. */
export function RelatedArticles({ articles }: { articles: SometimeArticleListItem[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="related-articles-title" className="mt-12">
      <h2 id="related-articles-title" className="text-[15px] font-bold text-[#625A68]">이어서 읽기</h2>
      <ul className="divide-y divide-[#EEE8FF]">
        {articles.map((article) => {
          const image = pickImageFor(article.id, article.thumbnail, article.coverImage);
          const hasImage = image && !IMAGE_FALLBACKS.some((fallback) => fallback === image);
          const summary = contentSummary(article.excerpt ?? article.subtitle);
          return (
            <li key={article.id}>
              <Link
                href={`/blog/${encodeURIComponent(article.slug)}`}
                className="group grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-5 py-5"
              >
                <div className="min-w-0">
                  <p className="text-[13px] text-[#625A68]">
                    <span className="font-bold text-[#5B35B5]">{article.category}</span>
                    {article.publishedAt ? <> · {formatDate(article.publishedAt)}</> : null}
                  </p>
                  <h3 className="mt-1 font-wantedSans text-lg font-extrabold leading-[1.5] tracking-[-0.02em] text-[#201823] group-hover:text-[#5B35B5]">
                    {article.title}
                  </h3>
                  {summary ? <p className="mt-1 line-clamp-2 text-[15px] leading-[1.6] text-[#625A68]">{summary}</p> : null}
                </div>
                {hasImage ? (
                  <div className="relative aspect-square w-20 rounded-lg bg-[#F4F0FF] sm:w-24">
                    <ContentMedia src={image} seed={article.id} className="rounded-lg object-cover" sizes="96px" />
                  </div>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
