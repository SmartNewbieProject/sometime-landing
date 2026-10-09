# sometime-landing — 에이전트 지침

이 저장소는 some-in-univ.com 의 공개 콘텐츠(`/blog`, `/card-news`, `/faq`, `/university` …)를 렌더링하는 Next.js 앱이다. **공개 저장소**이고 `main` 푸시는 곧 운영 배포다. 앱 쪽 `vercel.json` rewrite 가 이 경로들을 이 프로젝트로 보낸다.

## 절대 규칙

- **비밀 값을 저장소에 쓰지 않는다.** ADMIN 이메일·비밀번호·토큰은 `.env.local`(gitignore, chmod 600)에만 둔다. `.env.example` 은 이름만 있는 계약서다. 값을 채워 달라는 요청이 와도 파일을 대신 만들거나 `admin-cs.env`(CS 전용)를 재사용하지 않는다.
- 운영 DB 에 직접 쓰지 않는다. 글 쓰기는 `POST/PATCH /admin/v2/sometime-articles` 뿐이고, 모두 `scripts/blog/` 를 통한다.
- 사용자가 준 문장·수치를 검사 통과용으로 바꾸지 않는다. 규칙에 걸리면 어디가 문제인지 알린다.
- 없는 값은 만들지 않는다(No Silent Fallback). 스크립트가 던지는 오류는 그대로 보고한다.
- `main` 푸시 전에 `npx tsc --noEmit`, `npm run test:public-web`, `npm run test:blog` 를 돌리고 SHA 를 확인받는다(fast-forward 만, force-push·rebase 금지). 콘텐츠·스크립트만 바뀐 커밋도 같다.
- 한국어 문구(글 본문·메타·UI)는 `korean-copywriting` 스킬을 먼저 읽는다. 사용자가 고친 문구는 그 스킬 DB 에 기록한다.

## 블로그 발행 하네스 (반자동)

사람은 **주제 선택, 초안 확인, 발행 승인**만 한다. 나머지는 명령 하나씩이다. 자세한 절차는 `.claude/skills/blog-publisher/SKILL.md`.

```
npm run blog:doctor                        # 준비 점검(환경변수·Search Console·API·Admin 로그인)
npm run blog:radar                         # 다음에 쓸 글 / 고칠 글 후보 (Search Console 92일)
npm run blog:lint    -- content/drafts/x.html   # 변환+SEO·사실성 검사 (쓰기 없음)
npm run blog:draft   -- content/drafts/x.html   # 비공개 저장
npm run blog:publish -- content/drafts/x.html   # 발행 + 라이브 검증 (--id <id> | --update)
npm run blog:verify  -- <slug>                  # 라이브 검증만
npm run blog:report                        # 발행 글 성과 판정(관찰/유지/보강/접기)
npm run test:blog                          # 하네스 단위 테스트
```

루프: `radar` → 후보를 `content/keyword-map.json` 에 `planned` 로 → 초안(`content/template.html` 형식, `content/drafts/`) → `lint` → 사용자 확인 → `publish` → 4주 뒤 `report`.

- 키워드 지도 `content/keyword-map.json` 은 `publish`/`draft` 가 상태를 자동 갱신한다. 바뀐 파일을 커밋한다.
- 같은 검색 의도의 기존 글이 있으면(`gsc-overlap`·`cannibalization` 경고) 새 글 전에 사용자에게 묻는다. 새 글보다 기존 글 보강이 나을 수 있다.
- 판정 기준은 `scripts/blog/rules.json` 의 `lifecycle`(28일 관찰, 56일에 판정, 노출 100 미만이면 접기 검토). 근거 없이 바꾸지 않는다.
- 규칙(`rules.json`)과 사이트 렌더러(`MarkdownBody`, `splitContentAndFaq`)가 어긋나면 하네스가 아니라 사이트 쪽 사실을 먼저 확인한다.

## 사이트 구조 메모

- 글 본문은 마크다운만 렌더된다(원시 HTML 이스케이프). 지원 문법은 제목·문단·목록·인용·표·코드·굵게·링크·이미지.
- 읽기 스타일은 `src/app/_components/public-content/reading-styles.ts`, `PageHeader`, `ArticleHeader`, `globals.css` 의 `.public-markdown`. 규칙은 `DESIGN.md` 10절.
- `/download` 는 별도 구성이다. 읽기 스타일을 씌우지 않는다.
- 새 글은 landing 캐시(5분) 때문에 최대 5분 뒤에 열린다. 발행하면 서버가 IndexNow 를 자동 전송하고 Google 색인 요청은 사람이 Search Console 에서 한다.
- `*.vercel.app` Preview 는 SSO 보호 + `middleware.ts` 리다이렉트로 화면 확인이 안 된다. 로컬 `next dev` 로 확인한다.
