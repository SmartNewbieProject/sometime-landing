const HOME_PROOF_URL =
  process.env.SOMETIME_HOME_PROOF_URL ?? "https://api.some-in-univ.com/web/public-data/home-proof";

export const HOME_PROOF_TITLE = "가입 전에 다들 궁금해하는 것";
export const HOME_PROOF_VERIFICATION_HEADING = "학교 인증 방식";
export const HOME_PROOF_VERIFICATION_BODY =
  "가입할 때 학교 고르고, 학교 메일이나 학생증·재학증명서로 인증하면 끝이에요.";
export const HOME_PROOF_MATCHING_HEADING = "무료 매칭";
export const HOME_PROOF_MATCHING_BODY = "매칭이 열릴 때마다 한 명씩 무료로 추천해 줘요.";
export const HOME_PROOF_REVIEWS_HEADING = "스토어 후기";

const SOURCE_LABELS = { APP_STORE: "App Store", PLAY_STORE: "Google Play" } as const;

export type HomeProofReview = {
  id: string;
  source: keyof typeof SOURCE_LABELS;
  rating: number;
  body: string;
  author: { nickname: string; universityName: string | null } | null;
};

export type HomeProof = {
  verifiedCountFloor: number;
  verifiedUniversityCountFloor: number;
  asOf: string;
  reviews: HomeProofReview[];
};

/** 값이 없거나 모양이 다르면 대체값 없이 던진다. 빌드가 실패하면 이전 배포가 유지된다. */
export function parseHomeProof(payload: unknown): HomeProof {
  const body = (payload ?? {}) as Partial<HomeProof>;
  const { verifiedCountFloor, verifiedUniversityCountFloor, asOf, reviews } = body;

  if (!Number.isInteger(verifiedCountFloor) || (verifiedCountFloor as number) < 1000) {
    throw new Error(`home-proof: verifiedCountFloor 가 올바르지 않다 (${verifiedCountFloor})`);
  }
  if (
    !Number.isInteger(verifiedUniversityCountFloor) ||
    (verifiedUniversityCountFloor as number) < 10
  ) {
    throw new Error(
      `home-proof: verifiedUniversityCountFloor 가 올바르지 않다 (${verifiedUniversityCountFloor})`,
    );
  }
  if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) {
    throw new Error(`home-proof: asOf 가 올바르지 않다 (${asOf})`);
  }
  if (!Array.isArray(reviews) || reviews.length < 1) {
    throw new Error("home-proof: reviews 가 비어 있다");
  }
  reviews.forEach((review, index) => {
    const valid =
      Object.hasOwn(SOURCE_LABELS, review?.source) &&
      Number.isFinite(review?.rating) &&
      typeof review?.body === "string" &&
      review.body.trim() !== "";
    if (!valid) throw new Error(`home-proof: reviews[${index}] 형식이 올바르지 않다`);
  });

  return {
    verifiedCountFloor: verifiedCountFloor as number,
    verifiedUniversityCountFloor: verifiedUniversityCountFloor as number,
    asOf,
    reviews,
  };
}

export async function getHomeProof(): Promise<HomeProof> {
  const response = await fetch(HOME_PROOF_URL, {
    next: { revalidate: 86400 },
    headers: { Accept: "application/json", "X-Country": "kr" },
  });
  if (!response.ok) {
    throw new Error(`home-proof: ${HOME_PROOF_URL} 가 ${response.status} 를 돌려줬다`);
  }
  return parseHomeProof(await response.json());
}

export function formatHomeProofStats(proof: HomeProof): string {
  const count = String(proof.verifiedCountFloor).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `학교 인증한 사람 ${count}명+ · 대학 ${proof.verifiedUniversityCountFloor}곳+ (Google Play·App Store·웹 합산, ${proof.asOf} 기준)`;
}

export function formatHomeProofReviewMeta(review: HomeProofReview): string {
  const parts: string[] = [SOURCE_LABELS[review.source], `평점 ${review.rating}`];
  if (review.author) {
    parts.push(
      review.author.universityName
        ? `${review.author.nickname} · ${review.author.universityName}`
        : review.author.nickname,
    );
  }
  return parts.join(" · ");
}
