import Link from "next/link";
import {
  formatFoundPartnerLine,
  formatStoreRatingLine,
  getPublicReviewsPage,
} from "../../_lib/public-reviews";
import { READING_BODY, READING_H2, READING_LINK, READING_MUTED, READING_SHELL } from "./reading-styles";

/**
 * 고의도 SEO 랜딩(/korea-japan-matching, /block-acquaintances 등)에
 * 실제 스토어 평점과 검증된 커플 후기 2건을 교차 배치해 전환 신뢰를 높인다.
 * API 일시 장애 시에는 조용히 비워 페이지 렌더를 막지 않는다.
 */
export async function PublicProofStrip({
  headingId = "sometime-real-proof",
}: {
  headingId?: string;
}) {
  let data: Awaited<ReturnType<typeof getPublicReviewsPage>> | null = null;
  try {
    data = await getPublicReviewsPage();
  } catch {
    return null;
  }
  if (!data) return null;

  const { summary, coupleReviews } = data;
  const featured = coupleReviews.slice(0, 2);

  return (
    <section aria-labelledby={headingId} className={`${READING_SHELL} pt-0`}>
      <div className="rounded-2xl border border-[#E5E8EB] bg-white p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id={headingId} className={READING_H2}>
            실제 이용자 평점과 후기
          </h2>
          <Link href="/reviews" className={`text-sm font-semibold ${READING_LINK}`}>
            후기 전체 보기
          </Link>
        </div>
        <div className="mt-3 space-y-1 text-sm text-[#4E5968]">
          <p className="font-semibold text-[#191F28]">{formatStoreRatingLine(summary)}</p>
          {summary.foundPartnerCount !== null && (
            <p>{formatFoundPartnerLine(summary.foundPartnerCount)}</p>
          )}
        </div>
        {featured.length > 0 && (
          <ul className="mt-5 space-y-4 border-t border-[#F2F4F6] pt-5">
            {featured.map((review) => (
              <li key={review.id} className="border-l-2 border-[#E5E8EB] pl-4">
                <blockquote className={READING_BODY}>{review.body}</blockquote>
                <p className={`mt-1 text-[13px] ${READING_MUTED}`}>
                  {review.authorUniversity} · {review.partnerUniversity} 학생과 만났어요
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
