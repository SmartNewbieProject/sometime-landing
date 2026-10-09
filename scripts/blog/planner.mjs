// 키워드 플래너 CSV(content/planner/*.csv) 읽기. 플래너는 광고 지출이 없으면 50/500/5,000 같은 구간값만 준다.
// 헤더: keyword,currency,avg_monthly_searches_bucket_value,competition,top_of_page_bid_low_krw,top_of_page_bid_high_krw
import fs from 'node:fs';
import path from 'node:path';

const norm = (s) => s.replace(/\s+/g, '').toLowerCase();

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim());
}

export function parsePlannerCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const head = splitCsvLine(lines[0]);
  const idx = Object.fromEntries(['keyword', 'avg_monthly_searches_bucket_value', 'competition'].map((k) => [k, head.indexOf(k)]));
  for (const [k, i] of Object.entries(idx)) if (i < 0) throw new Error(`플래너 CSV 헤더에 ${k} 열이 없다: ${head.join(',')}`);
  return lines.slice(1).filter(Boolean).map((l) => {
    const c = splitCsvLine(l);
    const bucket = c[idx.avg_monthly_searches_bucket_value];
    return { keyword: c[idx.keyword], bucket: bucket === '' ? null : Number(bucket), competition: c[idx.competition] || null };
  });
}

/** 폴더의 모든 CSV 를 합친다. 같은 키워드는 파일명이 늦은 쪽이 이긴다(날짜 접두어 전제). */
export function loadPlanner(dir) {
  const map = new Map();
  if (!fs.existsSync(dir)) return map;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.csv')).sort()) {
    for (const r of parsePlannerCsv(fs.readFileSync(path.join(dir, f), 'utf8'))) map.set(norm(r.keyword), r);
  }
  return map;
}

/** 정확히 같은 키워드(공백 무시)만 돌려준다. 비슷한 키워드의 값으로 대신하지 않는다. */
export const plannerLookup = (map, phrase) => map.get(norm(phrase)) ?? null;
