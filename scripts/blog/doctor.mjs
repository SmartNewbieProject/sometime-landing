#!/usr/bin/env node
// 하네스 준비 점검: 환경변수, gcloud/Search Console, 공개 API, Admin 로그인. 값은 출력하지 않는다.
//   npm run blog:doctor
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './env.mjs';
import { listGscSites } from './gsc.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const results = [];
const check = async (name, fn) => {
  try {
    results.push({ name, ok: true, detail: (await fn()) ?? '' });
  } catch (e) {
    results.push({ name, ok: false, detail: e instanceof Error ? e.message.split('\n')[0].slice(0, 200) : String(e) });
  }
};

await check('Node 20 이상', () => {
  if (Number(process.versions.node.split('.')[0]) < 20) throw new Error(`현재 ${process.version}`);
  return process.version;
});
let env;
await check('환경변수(BLOG_ADMIN_EMAIL·BLOG_ADMIN_PASSWORD)', () => {
  env = loadEnv({ root: ROOT });
  return `출처 ${env.source}, API ${env.api}`;
});
await check('Search Console 조회(gcloud 서비스 계정 임퍼소네이션)', () => listGscSites());
await check('공개 API', async () => {
  const base = process.env.BLOG_API_BASE || 'https://api.some-in-univ.com/api';
  const res = await fetch(`${base}/sometime-articles?limit=1&page=1`, { headers: { 'X-Country': 'kr' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
});
if (env) {
  await check('Admin 로그인(토큰 수령만, 쓰기 없음)', async () => {
    const res = await fetch(`${env.api}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Country': 'kr' }, body: JSON.stringify({ email: env.email, password: env.password }), signal: AbortSignal.timeout(30000) });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!(json?.accessToken ?? json?.data?.accessToken)) throw new Error('응답에 accessToken 이 없다(응답 형식이 가정과 다르다)');
  });
}
for (const r of results) console.log(`${r.ok ? '✔' : '✖'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
