---
name: blog-publisher
description: 썸타임 블로그(some-in-univ.com/blog) 키워드 분석 → 초안 검사 → 발행 → 라이브 검증 → 성과 판정을 반자동으로 돌리는 스킬. "블로그 글 발행", "이 HTML 올려줘", "키워드 분석", "다음에 쓸 글", "블로그 성과", "SEO 점검 후 발행" 요청에 쓴다. sometime-landing 저장소 안에서 npm run blog:* 로 실행한다. 공지·카드뉴스는 대상이 아니다(content-publisher).
---

# Blog Publisher (sometime-landing)

저장소 루트에서 실행한다. 지침과 절대 규칙은 `CLAUDE.md`, 코드는 `scripts/blog/`, 규칙은 `scripts/blog/rules.json`.

## 0. 준비 (처음 한 번 + 막힐 때)

`npm run blog:doctor`. ✖ 가 있으면 그것부터 푼다.
- 환경변수: 사용자가 `.env.local`(chmod 600)에 `BLOG_ADMIN_EMAIL`, `BLOG_ADMIN_PASSWORD` 를 채운다(`.env.example` 참고). 내가 만들거나 값을 묻지 않는다.
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

## 4. 성과 판정 (발행 4주 뒤부터)

`npm run blog:report`. 판정은 `rules.json` lifecycle: 28일 전 관찰 / 노출 0 이면 색인 확인 / 56일에 노출 100 미만이면 접기 검토 / 순위 10 이내인데 CTR 3% 미만이면 제목·설명 보강 / 그 외 유지. 접거나 보강하는 결정은 사용자가 한다. 색인 여부는 이 보고서로 알 수 없다.

## 하지 않는 것

푸시·알림, 카드뉴스·공지, 운영 DB 직접 수정, 비밀 값 커밋, 다른 스킬 자격증명 재사용, 검사 통과를 위한 사용자 문장 변경.
