import { getTopKrUniversities, getUniversityPage } from "./public-content";
import { UNIVERSITY_SITEMAP_LIMIT, UNIVERSITY_SITEMAP_MIN_VERIFIED_COUNT } from "./sitemap-helpers";

export type ListedUniversity = {
  code: string;
  name: string;
  region: string | null;
  verifiedCount: number;
};

// The top endpoint is ordered by region, not by size, so take the whole pool (API max 50)
// and rank by verified users. A pool of 20 cut off SELSNU (73 verified, 18 GSC clicks).
const CANDIDATE_POOL_SIZE = 50;

/** sitemap 과 /university 목록이 같은 학교 집합을 보도록 선정 기준을 한곳에 둔다. */
export async function getListedUniversities(): Promise<ListedUniversity[]> {
  const candidates = await getTopKrUniversities(CANDIDATE_POOL_SIZE);
  const pages = await Promise.all(candidates.map((university) => getUniversityPage(university.code)));

  const listed: ListedUniversity[] = [];
  for (const page of pages) {
    const verifiedCount = page?.stats.verifiedCount ?? 0;
    if (!page || verifiedCount < UNIVERSITY_SITEMAP_MIN_VERIFIED_COUNT) continue;
    listed.push({
      code: page.university.code,
      name: page.university.name,
      region: page.university.region ?? null,
      verifiedCount,
    });
  }
  return listed
    .sort((a, b) => b.verifiedCount - a.verifiedCount)
    .slice(0, UNIVERSITY_SITEMAP_LIMIT);
}
