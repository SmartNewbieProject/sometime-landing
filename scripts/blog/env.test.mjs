import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadEnv } from './env.mjs';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'blogenv-'));
const write = (dir, rel, text, mode = 0o600) => {
  const f = path.join(dir, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, text, { mode });
  fs.chmodSync(f, mode);
};

test('process.env wins over .env.local, which wins over the legacy home file', () => {
  const root = tmp();
  const home = tmp();
  write(root, '.env.local', 'BLOG_ADMIN_EMAIL=local@x.test\nBLOG_ADMIN_PASSWORD=local-pw\n');
  write(home, '.config/sometimes/blog-publisher.env', 'BLOG_ADMIN_EMAIL=home@x.test\nBLOG_ADMIN_PASSWORD=home-pw\nBLOG_API_BASE=http://127.0.0.1:1/api\n');
  const fromFile = loadEnv({ root, home, env: {} });
  assert.equal(fromFile.email, 'local@x.test');
  assert.equal(fromFile.api, 'http://127.0.0.1:1/api', 'a key missing from .env.local falls through to the next source');
  assert.equal(loadEnv({ root, home, env: { BLOG_ADMIN_EMAIL: 'proc@x.test', BLOG_API_BASE: 'http://mock/api' } }).email, 'proc@x.test');
  assert.equal(loadEnv({ root, home, env: { BLOG_API_BASE: 'http://mock/api' } }).api, 'http://mock/api');
});

test('missing credentials throw with the names and places checked, never a default', () => {
  const root = tmp();
  assert.throws(() => loadEnv({ root, home: tmp(), env: {} }), (e) => /BLOG_ADMIN_EMAIL, BLOG_ADMIN_PASSWORD/.test(e.message) && /\.env\.local/.test(e.message));
  write(root, '.env.local', 'BLOG_ADMIN_EMAIL=a@x.test\n');
  assert.throws(() => loadEnv({ root, home: tmp(), env: {} }), /BLOG_ADMIN_PASSWORD/);
});

test('a group- or world-readable env file is refused', () => {
  const root = tmp();
  write(root, '.env.local', 'BLOG_ADMIN_EMAIL=a@x.test\nBLOG_ADMIN_PASSWORD=p\n', 0o644);
  assert.throws(() => loadEnv({ root, home: tmp(), env: {} }), /chmod 600/);
});

test('without BLOG_API_BASE the production API is the documented business default', () => {
  const root = tmp();
  write(root, '.env.local', 'BLOG_ADMIN_EMAIL=a@x.test\nBLOG_ADMIN_PASSWORD=p\n');
  assert.equal(loadEnv({ root, home: tmp(), env: {} }).api, 'https://api.some-in-univ.com/api');
});
