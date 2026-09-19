# us-works

FE 과제(Us FE Developer Recruit Works) 저장소. React 19 + Vite 8 SPA이며 Feature-Sliced Design(FSD) 2.1 구조를 따른다. 결정 근거는 `adrs/`, 스캐폴딩 절차는 `docs/INITIALIZE.md`에 있다.

## 작업 방식

- 커밋과 푸시는 매번 확인을 받은 뒤에만 실행한다. 메시지와 파일 목록을 먼저 보여준다.
- 답변 끝에 다음 단계나 후속 제안을 붙이지 않는다. 결과만 보고한다.
- 한 파일을 여러 곳 고칠 때는 Edit을 쪼개지 않고 한 번에 다시 쓴다.
- 의존성은 pnpm의 `minimumReleaseAge`(24시간) 정책을 따른다. 배포 직후 버전을 정확한 버전 지정으로 강제 설치하지 않고, `pnpm-workspace.yaml`에 `minimumReleaseAgeExclude`를 남기지 않는다.

## ADR 규칙

- `adrs/TEMPLATE.md`를 따른다. 섹션은 Status, Context, Decision, Consequences 네 개만 쓴다.
- 제목과 섹션 헤더는 영어, 본문은 한국어.
- Decision은 능동태 문장 목록이며 굵은 글씨를 쓰지 않는다. 고정 항목 열거만 `이름: 설명` 하위 목록으로 쓴다.
- 새 ADR은 직전 ADR과 구조가 완전히 같아야 한다.

## 커밋 메시지

- Conventional Commits. 타입(`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`)은 영어, 설명은 한국어.
- 예: `feat: 로그인 폼 유효성 검사 추가`, `docs: FSD 정적 검사 ADR 추가`

## 디렉토리 구조 (FSD 2.1)

```
src/
├── app/        # 앱 초기화: 프로바이더, 라우터, 전역 스타일
├── pages/      # 라우트 단위 화면
├── widgets/    # 독립적인 큰 UI 블록
├── features/   # 사용자 행위 단위 기능
├── entities/   # 비즈니스 엔티티
└── shared/     # 도메인 지식이 없는 재사용 코드 (ui, api, lib, config)
```

### 레이어 규칙

- 레이어 순서는 `app > pages > widgets > features > entities > shared`이며, 각 레이어는 자신보다 아래 레이어만 import한다.
- `pages`, `widgets`, `features`, `entities`는 슬라이스(도메인 폴더)로 나누고, 같은 레이어의 슬라이스끼리는 import하지 않는다.
- 같은 레이어 슬라이스 간 참조가 불가피하면 `entities` 레이어에서만 `@x` 표기법으로 허용한다. 공개하는 쪽이 `entities/<entity>/@x/<consumer>.ts`를 두고, 소비자는 `@/entities/<entity>/@x/<consumer>`로만 import한다.
- 슬라이스 내부는 `ui`, `model`, `api`, `lib`, `config` 세그먼트로 나누되 필요한 것만 만든다.
- 모든 슬라이스는 `index.ts`를 공개 API로 두고, 외부에서는 이 파일만 import한다. `export *`는 쓰지 않는다.
- `shared/ui`와 `shared/lib`는 레이어 단일 index 대신 컴포넌트, 모듈별 `index.ts`를 둔다.
- Jotai 아톰은 해당 슬라이스의 `model`에 둔다. 여러 기능이 공유하는 도메인 상태는 `entities/<엔티티>/model`에 두고, `shared`에는 도메인 상태를 두지 않는다.
- TanStack Query 훅과 요청 함수는 `api` 세그먼트에 둔다.
- 레이어 간 import는 `@/` 절대 경로 별칭을, 슬라이스 내부 import는 상대 경로를 사용한다.
- 필요한 슬라이스만 만들며, 비어 있는 레이어 폴더는 만들지 않는다.
- 위 규칙은 eslint-plugin-boundaries와 steiger가 강제한다. 위반은 린트 실패다.

## 코드 컨벤션

- 파일과 디렉토리 이름은 kebab-case, 훅은 camelCase. 모듈은 구현, 테스트, `index.ts`를 한 디렉토리로 묶는다. 상세는 `docs/file-structure.md`.
- 함수와 모듈을 나누는 기준, 조건 분기와 시그니처 규칙, 커밋 전 자기 점검은 `docs/code-quality.md`.
- 컴포넌트는 named export를 기본으로 하고, 라우트 진입 컴포넌트만 default export를 허용한다.
- `if`, `else`, `for`, `while` 본문은 한 줄이라도 중괄호로 감싼다. ESLint `curly: all`이 강제한다.
- 타입 전용 import는 `import type`으로 쓴다.
- `enum`, `namespace`, 생성자 매개변수 프로퍼티는 쓰지 않는다. tsconfig의 `erasableSyntaxOnly`가 컴파일 오류로 막는다. 열거 값은 `as const` 객체와 유니언 타입으로 표현한다.
- 객체 타입 선언은 `interface` 대신 `type`을 쓴다. props에 교차 타입(`&`)을 자주 쓰므로 한 가지로 통일한다. ESLint `consistent-type-definitions`가 강제한다.
- `app` 레이어에서 `providers/`, `hooks/` 같은 폴더 이름은 steiger가 거부한다. 프로바이더와 라우터는 `app` 루트 파일(`app-providers.tsx`, `router.tsx`)로 둔다.
- React Router의 DOM 전용 API(`RouterProvider` 등)는 `react-router/dom`에서, 그 외는 `react-router`에서 import한다.
- React Compiler가 켜져 있다. `useMemo`, `useCallback`, `memo`를 수동으로 넣지 않고, 컴파일러 규칙(eslint-plugin-react-hooks)을 따른다.
- 스타일은 Tailwind 유틸리티를 우선 사용하고, 반복되는 조합은 `shared/ui` 컴포넌트로 추출한다. 디자인 토큰은 `src/app/styles/globals.css`의 `@theme`에 정의한다.
- 코드 파일(`ts`, `tsx`, `js`, 설정 파일 포함)에는 주석을 쓰지 않는다. 결정과 근거는 ADR과 `docs/`에만 있다. 예외는 `eslint-disable-next-line`처럼 도구가 요구하는 지시문만이며, 그 이유는 커밋 메시지나 문서에 남긴다. ESLint `no-comments/disallowComments`가 강제한다.
- 모든 ESLint 규칙은 `error` 또는 `off`다. 파일 단위 `eslint-disable`은 금지한다.
- 테스트는 Vitest + Testing Library. 모듈이 약속한 것 하나가 테스트 하나이며, 순수 로직은 구현 전에, UI는 사양 문장을 구현하면서 쓴다. 상세는 `docs/testing.md`.

## 검증 명령

| 명령               | 용도                                                    |
| ------------------ | ------------------------------------------------------- |
| `pnpm check`       | typecheck, lint, knip, 포맷 검사, 테스트를 한 번에 실행 |
| `pnpm lint`        | ESLint(`--max-warnings 0`)와 steiger                    |
| `pnpm lint:unused` | knip                                                    |
| `pnpm test:run`    | Vitest 단발 실행                                        |

커밋 전(lint-staged), 커밋 메시지(commitlint), 푸시 전(`pnpm check`)에 훅이 자동으로 실행된다.
