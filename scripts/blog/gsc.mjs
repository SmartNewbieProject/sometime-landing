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
