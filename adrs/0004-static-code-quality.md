# ADR-0004: Enforce Code Conventions and Quality Statically

## Status

Accepted

## Context

ADR-0003에서 FSD 경계를 정적으로 강제하기로 했다. 그러나 경계 외의 코드 품질, 즉 타입 안전성, 린트 규칙 수준, 포맷, import 순서, 네이밍, 테스트 코드 작성 방식, 커밋 메시지 형식은 아직 "ESLint와 Prettier를 쓴다" 수준으로만 정해져 있다. 어떤 규칙을 어느 강도로 켜고, 위반을 어느 시점에 막을지가 없으면 도구가 설치되어 있어도 품질이 보장되지 않는다.

스타일 논쟁은 도구가 자동으로 끝내야 하고, 사람이 판단할 것은 설계와 로직에만 남아야 한다.

위반을 잡는 시점도 정해야 한다. 에디터에서 잡히는 것이 가장 빠르지만 에디터 설정은 개인 환경에 의존한다. 커밋 시점에서 잡으면 저장소에 위반이 들어가지 않고, CI는 마지막 안전망이다. ADR-0003은 git hook과 CI를 별도 결정으로 미뤘으며, 이 ADR에서 git hook을 결정하고 CI는 GitHub Actions 도입 시 다룬다.

ESLint 10 기준으로 typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @vitest/eslint-plugin, eslint-plugin-testing-library, eslint-plugin-simple-import-sort는 peer 범위가 호환된다. eslint-plugin-jsx-a11y는 peer 범위가 ESLint 9까지라 호환되지 않는다.

## Decision

- TypeScript 컴파일러 옵션은 `strict`에 더해 `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`를 켠다. `baseUrl`은 TypeScript 6에서 deprecated, 7에서 제거되었으므로 쓰지 않고 `paths`만 사용한다. 타입 오류는 `tsc -b`가 빌드 앞에서 막는다.
- ESLint 규칙 세트는 typescript-eslint의 `strictTypeChecked`와 `stylisticTypeChecked`를 `projectService` 기반 타입 정보와 함께 적용한다. `recommended`보다 엄격한 세트를 택해 `any` 누출, 불필요한 조건, 안전하지 않은 멤버 접근을 잡는다.
- React 규칙으로 eslint-plugin-react-hooks 7의 `configs.flat.recommended`와 eslint-plugin-react-refresh의 `configs.vite`를 적용한다. 7.0부터 `recommended`에 안정화된 React Compiler 규칙이 포함되어 ADR-0001의 컴파일러 적용과 짝을 이룬다. `recommended-latest`는 여기에 실험 단계 규칙을 더한 세트라 쓰지 않는다. 훅 규칙 위반, 컴파일러가 건너뛸 코드, Fast Refresh를 깨는 export를 잡는다.
- import는 eslint-plugin-simple-import-sort로 정렬하고, 타입 전용 import는 `@typescript-eslint/consistent-type-imports`로 `import type`을 강제한다. 정렬 순서는 외부 패키지, `@/` 별칭, 상대 경로 순이다.
- 네이밍은 `@typescript-eslint/naming-convention`으로 다음만 강제한다.
  - `typeLike`: PascalCase. 인터페이스에 `I` 접두사를 붙이지 않는다.
  - `variable`: camelCase 또는 PascalCase(컴포넌트) 또는 UPPER_CASE(상수).
  - `function`: camelCase 또는 PascalCase(컴포넌트).
- 테스트 파일에는 @vitest/eslint-plugin의 `recommended`와 eslint-plugin-testing-library의 `react` 설정을 `*.test.ts`, `*.test.tsx`에 한정해 적용한다.
- 모든 ESLint 규칙은 `error` 또는 `off`로만 설정하고 `warn`을 쓰지 않는다. 실행 시 `--max-warnings 0`을 붙여 경고가 남아 있는 상태를 실패로 취급한다.
- Prettier는 기본값을 쓰되 `printWidth`만 100으로 올리고, prettier-plugin-tailwindcss로 클래스 순서를 정렬한다. Tailwind 4에서는 `tailwindStylesheet` 옵션으로 `@theme`가 있는 CSS 진입 파일을 지정해야 커스텀 토큰이 정렬에 반영되므로 필수로 설정한다. `.editorconfig`에 UTF-8, LF, 2칸 들여쓰기, 파일 끝 개행을 선언해 에디터 기본 동작을 맞춘다.
- 사용하지 않는 파일, export, 의존성은 knip으로 검사한다. 진입점은 `src/app/main.tsx`와 설정 파일로 지정하고, FSD 슬라이스의 `index.ts`에서 아무도 쓰지 않는 export가 있으면 실패로 취급한다.
- git hook은 simple-git-hooks로 등록하고 lint-staged로 스테이징된 파일만 처리한다.
  - `pre-commit`: 스테이징된 `ts`, `tsx`에 `eslint --fix --max-warnings 0`, 스테이징된 `ts`, `tsx`, `css`, `json`, `md`에 `prettier --write`
  - `commit-msg`: commitlint로 Conventional Commits 형식 검사
  - `pre-push`: `pnpm check` 전체 실행
- 커밋 메시지는 commitlint의 `config-conventional`을 따르되 `subject-case` 규칙은 끈다. 타입(`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`)은 영어, 설명은 한국어로 쓴다.
- `check` 스크립트는 `typecheck`, `lint`(ESLint, steiger), `lint:unused`(knip), `format:check`(Prettier), `test:run`을 순서대로 실행하며, 하나라도 실패하면 중단한다.
- eslint-plugin-jsx-a11y는 ESLint 10 peer 범위 밖이라 채택하지 않는다. 접근성은 shared/ui 컴포넌트에 시맨틱 요소와 ARIA 속성을 직접 적용하고 Testing Library의 역할 기반 쿼리로 검증한다. 플러그인이 ESLint 10을 지원하면 재검토한다.
- Biome(2.5 기준)은 채택하지 않는다. 린트와 포맷을 한 도구로 처리하고 `overrides`와 `noRestrictedImports`로 FSD 경계도 표현할 수 있지만, 자체 타입 추론 엔진이 typescript-eslint의 `strictTypeChecked` 규칙 폭을 대체하지 못하고(`no-unsafe-*`, `no-unnecessary-condition` 등 대응물 없음, `noFloatingPromises`는 약 75% 커버), Tailwind 클래스 정렬 규칙이 nursery 단계로 Tailwind 4의 `@theme`와 스크린 variant를 인식하지 못하며, vitest와 testing-library 규칙이 없다. 타입 안전성과 Tailwind 4가 핵심인 이 과제에서는 손실이 이점보다 크다.
- `exactOptionalPropertyTypes`는 켜지 않는다. React와 서드파티 라이브러리의 props 타입이 `undefined` 할당을 전제하는 경우가 많아 오탐이 잦다.

## Consequences

**좋은 점**

- 타입, 린트, 포맷, import 순서, 네이밍이 모두 도구로 결정되어 코드 리뷰에서 스타일 논쟁이 사라진다.
- `strictTypeChecked`가 `any` 누출과 안전하지 않은 접근을 잡아, 런타임 오류가 될 코드를 컴파일 단계에서 드러낸다.
- 커밋 시점에 위반이 차단되므로 저장소 이력에 린트 실패 상태가 들어가지 않는다.
- knip이 FSD 공개 API에 남는 죽은 export를 잡아 슬라이스 인터페이스를 작게 유지한다.
- 경고 0 정책으로 "나중에 고칠 경고"가 쌓이지 않는다.
- 평가자가 설정 파일만 봐도 어떤 품질 기준이 적용되는지 알 수 있다.

**나쁜 점과 감수하는 위험**

- 개발 의존성이 여덟 개 가까이 늘고 ESLint 설정 파일이 길어진다.
- `strictTypeChecked`는 서드파티 타입이 느슨한 곳에서 오탐을 낸다. 파일 단위 `eslint-disable`은 금지하고, 줄 단위로 이유를 주석에 적어 예외 처리한다.
- 타입 정보 기반 린트는 파일 수에 비례해 느려진다. 과제 규모에서는 문제되지 않지만 pre-commit은 스테이징 파일만 검사해 완화한다.
- pre-push에서 `pnpm check` 전체가 돌아 푸시가 수십 초 느려진다. 과제 규모에서 허용한다.
- knip의 오탐(동적 import, 설정 파일 전용 의존성)은 `knip.json`에서 개별 예외로 관리해야 한다.
- 접근성 린트가 없어 ARIA 속성 실수를 도구가 잡지 못한다. 컴포넌트 테스트로 일부만 보완된다.
- git hook은 로컬에만 적용되므로 `--no-verify`로 우회할 수 있다. 최종 안전망은 이후 GitHub Actions ADR에서 정한다.
