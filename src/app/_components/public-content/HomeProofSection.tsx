import {
  formatHomeProofCount,
  formatHomeProofReviewMeta,
  formatHomeProofUniversity,
  getHomeProof,
  HOME_PROOF_MATCHING_BODY,
  HOME_PROOF_MATCHING_HEADING,
  HOME_PROOF_REVIEWS_HEADING,
  HOME_PROOF_TITLE,
  HOME_PROOF_VERIFICATION_BODY,
  HOME_PROOF_VERIFICATION_HEADING,
} from "@/app/_lib/home-proof";

const H3_CLASS = "mb-2 font-wantedSans text-[17px] font-bold leading-[26px] text-black";
const BODY_CLASS = "text-[16px] leading-[26px] text-neutral-700";

/**
 * 결정(2026-10-06): 페이지 맨 아래의 접이식 한 줄. 접힌 상태에서는 제목만 보이고
 * 방문자가 펼치면 전부 보인다. 네이티브 <details> 라 JS 없이 동작하고, 접힌 내용도 HTML 에 있다.
 * 값은 빌드 시점 기준이고 못 구하면 빌드가 실패한다.
 */
export async function HomeProofSection() {
  const proof = await getHomeProof();

  return (
    <details className="group mx-auto -mt-8 w-full max-w-4xl px-5 pb-20">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 border-t border-[#EEE8FF] pt-6 [&::-webkit-details-marker]:hidden">
        <h2 className="inline font-wantedSans text-[16px] font-bold leading-[24px] text-black">
          {HOME_PROOF_TITLE}
        </h2>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 flex-none text-neutral-400 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>

      <div className="pt-6">
        <p className="font-wantedSans text-[20px] font-bold leading-[30px] text-black">
          {formatHomeProofCount(proof)}
        </p>
        <p className="mt-1 font-wantedSans text-[16px] font-bold leading-[26px] text-black">
          {formatHomeProofUniversity(proof)}
        </p>
        <p className="mt-1 text-[13px] leading-[20px] text-neutral-500">{proof.asOf} 기준</p>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className={H3_CLASS}>{HOME_PROOF_VERIFICATION_HEADING}</h3>
            <p className={BODY_CLASS}>{HOME_PROOF_VERIFICATION_BODY}</p>
          </div>
          <div>
            <h3 className={H3_CLASS}>{HOME_PROOF_MATCHING_HEADING}</h3>
            <p className={BODY_CLASS}>{HOME_PROOF_MATCHING_BODY}</p>
          </div>
          <div>
            <h3 className={H3_CLASS}>{HOME_PROOF_REVIEWS_HEADING}</h3>
            <div className="space-y-5">
              {proof.reviews.map((review) => (
                <figure key={review.id} className="border-l-2 border-[#EEE8FF] pl-4">
                  <blockquote className={BODY_CLASS}>{review.body}</blockquote>
                  <figcaption className="mt-2 text-[13px] leading-[20px] text-neutral-500">
                    {formatHomeProofReviewMeta(review)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </details>
  );
}
