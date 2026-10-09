// 발행 하네스 환경변수 로더. 값은 저장소에 없고 사용자가 채운다(저장소는 공개).
// 우선순위: process.env > <repo>/.env.local > ~/.config/sometimes/blog-publisher.env(구 위치)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const REQUIRED = ['BLOG_ADMIN_EMAIL', 'BLOG_ADMIN_PASSWORD'];
export const DEFAULT_API = 'https://api.some-in-univ.com/api';

function parse(text) {
  const out = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

/** 요청을 보내기 전에 호출한다. 값이 없거나 파일 권한이 넓으면 어떤 기본값도 만들지 않고 던진다. */
export function loadEnv({ root, env = process.env, home = os.homedir() } = {}) {
  const files = [path.join(root, '.env.local'), path.join(home, '.config', 'sometimes', 'blog-publisher.env')];
  const sources = [{ name: 'process.env', values: env }];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    if (fs.statSync(file).mode & 0o077) throw new Error(`${file} 권한이 너무 넓다. chmod 600 으로 줄여 달라.`);
    sources.push({ name: file, values: parse(fs.readFileSync(file, 'utf8')) });
  }
  const pick = (key) => {
    for (const s of sources) if (s.values[key]) return { value: s.values[key], from: s.name };
    return null;
  };
  const missing = REQUIRED.filter((k) => !pick(k));
  if (missing.length) {
    throw new Error(`환경변수 ${missing.join(', ')} 가 없다. ${files[0]} 를 만들어 채운다(chmod 600, .env.example 참고). 확인한 곳: ${sources.map((s) => s.name).join(', ')}`);
  }
  const api = pick('BLOG_API_BASE');
  return {
    email: pick('BLOG_ADMIN_EMAIL').value,
    password: pick('BLOG_ADMIN_PASSWORD').value,
    api: api?.value ?? DEFAULT_API, // 실제 업무 기본값: 운영 API. 시험은 BLOG_API_BASE 로 덮는다.
    source: pick('BLOG_ADMIN_EMAIL').from,
  };
}
