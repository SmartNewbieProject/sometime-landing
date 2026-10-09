#!/usr/bin/env node
// 최초 1회: .env.local 을 chmod 600 으로 만든다. 비밀번호는 화면에 찍지 않는다. 값은 이 터미널에서 사용자가 직접 입력한다.
//   ! npm run blog:setup        (Claude Code 에서는 느낌표를 붙여 이 세션 터미널에서 실행)
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const target = path.join(ROOT, '.env.local');
if (!process.stdin.isTTY) {
  console.error('✖ 대화형 터미널에서만 실행한다(값을 파이프로 넘기지 않는다).');
  process.exit(1);
}
if (fs.existsSync(target)) {
  console.error(`✖ ${target} 가 이미 있다. 바꾸려면 직접 편집한다(chmod 600 유지).`);
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
const ask = (q, hidden = false) =>
  new Promise((resolve) => {
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(q)) rl.output.write(s);
        else if (s === '\r\n' || s === '\n') rl.output.write(s);
      };
    }
    rl.question(q, (a) => {
      rl._writeToOutput = (s) => rl.output.write(s);
      resolve(a.trim());
    });
  });

const email = await ask('운영 ADMIN 계정 이메일: ');
const password = await ask('비밀번호(입력은 보이지 않는다): ', true);
rl.close();
if (!email || !password) {
  console.error('✖ 이메일과 비밀번호가 모두 필요하다. 아무것도 저장하지 않았다.');
  process.exit(1);
}
fs.writeFileSync(target, `BLOG_ADMIN_EMAIL=${email}\nBLOG_ADMIN_PASSWORD=${password}\n`, { mode: 0o600 });
fs.chmodSync(target, 0o600);
console.log(`✔ ${target} 를 만들었다(권한 600, gitignore 대상). 이어서: npm run blog:doctor`);
