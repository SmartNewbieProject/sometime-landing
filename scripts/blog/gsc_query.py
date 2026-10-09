#!/usr/bin/env python3
"""Search Console 검색 성과를 CSV로 뽑는다. 표준 라이브러리만 사용한다.

인증: 키 파일 없이 서비스 계정 임퍼소네이션(gcloud)으로 읽기 전용 토큰을 받는다.
  - 서비스 계정: gsc-reader@sometime-dc1e4.iam.gserviceaccount.com (GSC 속성에 '제한됨' 사용자로 추가돼 있어야 함)
  - 호출 계정에 roles/iam.serviceAccountTokenCreator 필요 (기본: gcloud 활성 계정)

예:
  python3 scripts/analytics/gsc_query.py --days 28 --dims query,page > /tmp/gsc.csv
  python3 scripts/analytics/gsc_query.py --dims query --page-contains /blog/ --limit 200
"""
import argparse
import csv
import datetime as dt
import json
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

SA = "gsc-reader@sometime-dc1e4.iam.gserviceaccount.com"
SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
SITE = "sc-domain:some-in-univ.com"
API = "https://searchconsole.googleapis.com/webmasters/v3/sites"


def token(account):
    cmd = ["gcloud", "auth", "print-access-token", f"--impersonate-service-account={SA}", f"--scopes={SCOPE}"]
    if account:
        cmd.append(f"--account={account}")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 or not r.stdout.strip():
        sys.exit(f"토큰 발급 실패: {r.stderr.strip()[:300]}")
    return r.stdout.strip()


def call(url, tok, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code} {url}: {e.read().decode()[:400]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", default=SITE)
    ap.add_argument("--days", type=int, default=28)
    ap.add_argument("--dims", default="query,page", help="query,page,date,country,device 중 쉼표 구분")
    ap.add_argument("--limit", type=int, default=1000, help="행 한도(최대 25000, 25000 초과 시 --start-row로 페이징)")
    ap.add_argument("--start-row", type=int, default=0)
    ap.add_argument("--page-contains", help="페이지 URL에 포함될 문자열")
    ap.add_argument("--account", help="gcloud 계정(기본: 활성 계정)")
    ap.add_argument("--list-sites", action="store_true", help="서비스 계정이 볼 수 있는 속성 목록만 출력")
    a = ap.parse_args()

    tok = token(a.account)
    if a.list_sites:
        entries = call(API, tok).get("siteEntry", [])
        if not entries:
            sys.exit("보이는 속성이 없다. 서비스 계정을 GSC '설정 > 사용자 및 권한'에 추가했는지 확인.")
        for s in entries:
            print(s["siteUrl"], s["permissionLevel"])
        return

    # GSC 데이터는 약 2~3일 지연된다. 종료일을 오늘-3일로 둔다.
    end = dt.date.today() - dt.timedelta(days=3)
    start = end - dt.timedelta(days=a.days - 1)
    dims = a.dims.split(",")
    body = {"startDate": str(start), "endDate": str(end), "dimensions": dims,
            "rowLimit": min(a.limit, 25000), "startRow": a.start_row}
    if a.page_contains:
        body["dimensionFilterGroups"] = [{"filters": [{"dimension": "page", "operator": "contains",
                                                        "expression": a.page_contains}]}]
    rows = call(f"{API}/{urllib.parse.quote(a.site, safe='')}/searchAnalytics/query", tok, body).get("rows", [])
    w = csv.writer(sys.stdout)
    w.writerow(dims + ["clicks", "impressions", "ctr", "position"])
    for r in rows:
        w.writerow(r["keys"] + [int(r["clicks"]), int(r["impressions"]), round(r["ctr"], 4), round(r["position"], 2)])
    print(f"# {a.site} {start}~{end} rows={len(rows)}", file=sys.stderr)


if __name__ == "__main__":
    main()
