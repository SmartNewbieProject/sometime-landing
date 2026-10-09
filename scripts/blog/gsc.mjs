// Search Console 조회(서비스 계정 임퍼소네이션, 키 파일 없음). gcloud 가 로그인돼 있어야 한다.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseGscCsv } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const GSC_SCRIPT = process.env.BLOG_GSC_SCRIPT || path.join(here, 'gsc_query.py');

export function fetchGsc({ days = 92, dims = 'query,page', pageContains } = {}) {
  const args = ['-I', GSC_SCRIPT, '--days', String(days), '--dims', dims, '--limit', '25000'];
  if (pageContains) args.push('--page-contains', pageContains);
  return parseGscCsv(execFileSync('python3', args, { encoding: 'utf8', timeout: 120000, stdio: ['ignore', 'pipe', 'pipe'] }));
}

export function listGscSites() {
  return execFileSync('python3', ['-I', GSC_SCRIPT, '--list-sites'], { encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const SA = 'gsc-reader@sometime-dc1e4.iam.gserviceaccount.com';
const SITE_PROPERTY = 'sc-domain:some-in-univ.com';

export function gscToken() {
  return execFileSync('gcloud', ['auth', 'print-access-token', `--impersonate-service-account=${SA}`, '--scopes=https://www.googleapis.com/auth/webmasters.readonly'], { encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

export function summarizeInspection(json) {
  const r = json?.inspectionResult?.indexStatusResult;
  if (!r?.verdict) throw new Error('URL 검사 응답에 indexStatusResult.verdict 가 없다.');
  return { verdict: r.verdict, coverageState: r.coverageState ?? '', lastCrawlTime: r.lastCrawlTime ?? null, googleCanonical: r.googleCanonical ?? null, userCanonical: r.userCanonical ?? null, indexingState: r.indexingState ?? null, pageFetchState: r.pageFetchState ?? null };
}

/** Search Console URL 검사 API(읽기 전용). 색인 여부·마지막 크롤·구글이 고른 canonical 을 돌려준다. */
export async function inspectUrl(url, { token = gscToken(), fetchImpl = fetch } = {}) {
  const res = await fetchImpl('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_PROPERTY, languageCode: 'ko-KR' }),
    signal: AbortSignal.timeout(60000),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`URL 검사 실패(${url}): HTTP ${res.status} ${json?.error?.message ?? ''}`.trim());
  return summarizeInspection(json);
}
