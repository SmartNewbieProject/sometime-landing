---
name: blog-publisher
description: 썸타임 블로그(some-in-univ.com/blog) 키워드 분석 → 초안 검사 → 발행 → 라이브 검증 → 성과 판정을 반자동으로 돌리는 스킬. "블로그 글 발행", "이 HTML 올려줘", "키워드 분석", "다음에 쓸 글", "블로그 성과", "SEO 점검 후 발행" 요청에 쓴다. sometime-landing 저장소 안에서 npm run blog:* 로 실행한다. 공지·카드뉴스는 대상이 아니다(content-publisher).
---

# Blog Publisher (sometime-landing)

저장소 루트에서 실행한다. 지침과 절대 규칙은 `CLAUDE.md`, 코드는 `scripts/blog/`, 규칙은 `scripts/blog/rules.json`.

## 0. 준비 (처음 한 번 + 막힐 때)

`npm run blog:doctor`. ✖ 가 있으면 그것부터 푼다.
- 환경변수: 사용자가 이 세션 터미널에서 `! npm run blog:setup` 을 실행해 `.env.local`(chmod 600)을 만든다(비밀번호는 화면에 안 찍힌다). 내가 만들거나 값을 묻지 않는다. 변수 목록은 `.env.example`.
- Search Console: `gcloud` 로그인된 계정이 서비스 계정을 임퍼소네이션할 수 있어야 한다(`scripts/blog/gsc_query.py` 머리말).

## 1. 키워드 → 후보

`npm run blog:radar`. 두 목록이 나온다.
- **고칠 글**: 이미 페이지가 있는데 순위 4~15·CTR 4% 미만. 새 글 대신 제목·설명·본문 보강.
- **새로 쓸 글**: 노출은 있는데 홈이 대신 받는 군집. 브랜드·일본 시장·정책 위반 키워드·전용 페이지가 있는 검색어는 자동 제외.

후보를 사용자와 정한 뒤 `content/keyword-map.json` 에 `planned` 로 적는다(`intent` 에 기존 글과 의도가 어떻게 다른지 한 줄). 검색량 근거가 약하면(구간 50 이하·노출 10 미만) 쓰지 않는다. 사실과 다른 주장이 될 주제(AI 매칭 등)는 쓰지 않는다.

## 2. 초안

`content/template.html` 형식의 HTML 을 `content/drafts/<slug>.html` 에 둔다. 필수 메타 `slug`, `category`(story/interview/tips/team/update/safety), `keyword`(1개), `description`(70~160자). 사용자가 쓴 글이면 문장은 그대로 두고 형식만 맞춘다. 내가 쓸 때는 `korean-copywriting` 을 먼저 읽고, 통계·인용·후기를 지어내지 않는다.

## 3. 검사 → 저장 → 발행

```bash
npm run blog:lint    -- content/drafts/x.html    # 오류=저장 안 함, 경고=보고
npm run blog:draft   -- content/drafts/x.html    # 비공개 저장(이 하네스를 처음 쓰는 날의 첫 글은 이것부터)
npm run blog:publish -- content/drafts/x.html    # 발행 + 라이브 검증
npm run blog:publish -- content/drafts/x.html --update      # 이미 공개된 같은 slug 수정(발행일 유지)
npm run blog:publish -- content/drafts/x.html --id <id>     # draft 로 만든 글 발행
```

- 사용자가 "발행/올려줘"라고 했고 `lint` 오류가 0 이면 `publish` 까지 진행한다. 경고 중 `gsc-overlap`·`cannibalization` 은 발행 전에 사용자에게 한 번 묻는다.
- 끝나면 라이브 검증 표를 그대로 보고한다. ✖ 가 있으면 성공이라고 말하지 않는다.
- 바뀐 `content/keyword-map.json`(자동 갱신)과 초안을 커밋한다. 비밀 값이 섞이지 않았는지 `git diff --cached` 로 본다.
- 수동으로 남는 일: Search Console → URL 검사 → 색인 생성 요청(Google 은 API 없음).

## 4. 성과 판정 (발행 직후부터 색인, 4주 뒤부터 성과)

`npm run blog:report` 는 Search Console 노출·클릭과 **URL 검사 API(읽기 전용)의 색인 상태**를 함께 본다. 단독 조회는 `npm run blog:inspect -- <slug|URL>`. 판정은 `rules.json` lifecycle: 발행 7일이 지났는데 색인이 안 됐으면 `미색인`(coverageState 를 그대로 보고) / 28일 전 관찰 / 노출 0 인데 색인됨이면 `노출 대기`, 색인 확인 불가면 `색인 확인` / 56일에 노출 100 미만이면 접기 검토 / 순위 10 이내인데 CTR 3% 미만이면 제목·설명 보강 / 그 외 유지. 접거나 보강하는 결정은 사용자가 한다. `미색인` 이면 Search Console 에서 색인 생성 요청을 사람이 한다(요청 API 는 없다). 조회 실패는 성공으로 치지 않고 보고서에 그대로 적힌다.

## 5. 키워드 플래너 구간값 (검색량 근거)

`blog:radar` 표의 "플래너 구간" 열은 `content/planner/*.csv` 에서 **정확히 같은 키워드**만 찾는다(비슷한 키워드 값으로 대신하지 않는다). 광고 지출이 없으면 플래너는 50/500/5,000 같은 구간값만 준다. Google Ads API 는 개발자 토큰이 없어 연결하지 못했으므로 화면 조회를 쓴다.

1. `blog:radar` 끝의 "플래너 미조회 키워드" 목록을 복사한다.
2. Aside 에이전트에 다음처럼 시킨다: "Google Ads 키워드 플래너(검색량 및 예상 전환수 확인)에서 아래 키워드의 월간 검색량·경쟁도·상단 입찰가를 조회하고 CSV 로 내려받아라. 허용: 키워드 입력, 조회, 내보내기. 금지: 캠페인·키워드 추가, 결제·광고 설정 변경."
3. 헤더를 `keyword,currency,avg_monthly_searches_bucket_value,competition,top_of_page_bid_low_krw,top_of_page_bid_high_krw` 로 맞춰 `content/planner/<YYYY-MM-DD>.csv` 로 저장하고 커밋한다. 같은 키워드는 파일명이 늦은 쪽이 이긴다.
4. `blog:radar` 를 다시 돌린다.

## 하지 않는 것

푸시·알림, 카드뉴스·공지, 운영 DB 직접 수정, 비밀 값 커밋, 다른 스킬 자격증명 재사용, 검사 통과를 위한 사용자 문장 변경.
