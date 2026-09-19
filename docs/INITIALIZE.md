# 프로젝트 초기화 스펙

FE 과제(Us FE Developer Recruit Works)의 스캐폴딩 절차서다. 실행 순서와 설정 파일 내용만 다룬다. 결정 근거는 ADR, 코드 컨벤션과 레이어 규칙은 `AGENTS.md`에 있다. 2026-09-19에 이 절차대로 스캐폴딩을 완료했고, 아래 설정은 8장의 위반 시나리오로 동작을 검증한 최종본이다.

- [ADR-0001: Frontend Tech Stack Selection](../adrs/0001-tech-stack.md)
- [ADR-0002: Adopt Feature-Sliced Design Directory Structure](../adrs/0002-fsd-directory-structure.md)
- [ADR-0003: Enforce FSD Boundaries Statically](../adrs/0003-fsd-static-enforcement.md)
- [ADR-0004: Enforce Code Conventions and Quality Statically](../adrs/0004-static-code-quality.md)

## 1. 버전

2026-09-19 기준 npm 최신 안정 버전과 각 공식 문서의 요구사항을 확인한 값이다.

| 패키지                                    | 버전            | 제약                                                                                                           |
| ----------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| Node.js                                   | 24.x            | `.nvmrc`로 고정. lint-staged 17이 22.22 이상 요구. Node 25부터 corepack 미포함                                 |
| pnpm                                      | 12.x            | corepack으로 활성화, `packageManager` 필드로 고정. `-s` 플래그 없음                                            |
| TypeScript                                | 6.0.x           | 7.x는 프로그램 API가 없어 typescript-eslint(`<6.1.0`)와 호환 불가. 7.x로 올리지 않는다                         |
| React, React DOM                          | 19.x            | React Router 8이 19.2.7 이상 요구                                                                              |
| Vite                                      | 8.x             | `@vitejs/plugin-react` 6.x                                                                                     |
| React Compiler                            | 1.0.x           | `babel-plugin-react-compiler`, `@rolldown/plugin-babel` 경로. `compiler: true`(Rust)는 experimental이라 미사용 |
| Tailwind CSS                              | 4.x             | `@tailwindcss/vite`                                                                                            |
| React Router                              | 8.x             | 패키지 `react-router` 하나. DOM API는 `react-router/dom`                                                       |
| TanStack Query                            | 5.x             |                                                                                                                |
| Jotai                                     | 3.0.x           | ESM 전용. `atomFamily`는 `jotai-family`, `loadable` 제거                                                       |
| Vitest                                    | 5.x             | Node 22.12 이상. `clearMocks` 기본 true                                                                        |
| Testing Library React                     | 16.x            |                                                                                                                |
| ESLint                                    | 10.x            | flat config 전용                                                                                               |
| typescript-eslint                         | 8.x             |                                                                                                                |
| eslint-plugin-react-hooks                 | 7.x             | `configs.flat.recommended`                                                                                     |
| eslint-plugin-boundaries                  | 7.x             | 단일 `dependencies` 규칙, selector 정책. `@/` 별칭 해석에 eslint-import-resolver-typescript 필요               |
| eslint-plugin-no-comments                 | 1.2.x           | 코드 주석 금지. `eslint`, `global` 지시문만 허용                                                               |
| steiger, @feature-sliced/steiger-plugin   | 0.6.x, 0.7.x    | `segments-by-purpose` 규칙이 `providers` 같은 세그먼트 이름을 거부                                             |
| knip                                      | 6.x             |                                                                                                                |
| Prettier                                  | 3.x             | `prettier-plugin-tailwindcss`는 `tailwindStylesheet` 필수                                                      |
| simple-git-hooks, lint-staged, commitlint | 2.x, 17.x, 21.x |                                                                                                                |

## 2. 사전 준비

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

## 3. 프로젝트 생성

저장소에 `adrs/`, `docs/`, `AGENTS.md`가 이미 있으므로 템플릿을 임시 디렉토리에 생성해 복사한다. 루트에서 `pnpm create vite .`를 실행하면 기존 파일 삭제 프롬프트가 나오므로 쓰지 않는다.

```bash
# 1. 템플릿 생성 후 복사 (기존 파일은 덮어쓰지 않음)
pnpm create vite@latest /tmp/us-works-template --template react-ts
cp -Rn /tmp/us-works-template/. .

# 2. 템플릿 잔여물 제거 (oxlint는 ESLint로 교체, 샘플 소스는 FSD 구조로 대체)
rm -f README.md .oxlintrc.json
rm -rf src/assets src/App.css src/App.tsx src/index.css src/main.tsx

# 3. package.json 수정: name을 us-works로, lint 스크립트와 oxlint devDependency 제거

# 4. 설치
pnpm install
pnpm add -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler
pnpm add tailwindcss @tailwindcss/vite
pnpm add react-router @tanstack/react-query jotai
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
pnpm add -D eslint-plugin-simple-import-sort @vitest/eslint-plugin eslint-plugin-testing-library eslint-plugin-no-comments
pnpm add -D prettier prettier-plugin-tailwindcss eslint-config-prettier
pnpm add -D eslint-plugin-boundaries eslint-import-resolver-typescript steiger @feature-sliced/steiger-plugin
pnpm add -D knip
pnpm add -D simple-git-hooks lint-staged @commitlint/cli @commitlint/config-conventional
```

pnpm 12는 의존성의 postinstall 스크립트를 기본 차단하고 `pnpm-workspace.yaml`에 `allowBuilds` 항목을 만들어 둔다. simple-git-hooks와 unrs-resolver는 허용한다.

pnpm 11부터 `minimumReleaseAge` 기본값이 1440분이다. 배포 24시간이 지나지 않은 버전은 설치 대상에서 제외되므로, `pnpm update`가 npm 최신 버전을 올리지 않는 것은 정상이다. `pnpm add pkg@정확한버전`으로 강제하면 pnpm이 `minimumReleaseAgeExclude`에 그 패키지를 자동 추가하고, 이후 `pnpm` 명령이 lockfile 공급망 검사에서 실패한다. 우회하지 않고 하루 뒤 `pnpm update`로 올린다.

```yaml
# pnpm-workspace.yaml
allowBuilds:
  simple-git-hooks: true
  unrs-resolver: true # eslint-import-resolver-typescript의 네이티브 리졸버
```

## 4. 생성할 파일

스캐폴딩 단계에서 만드는 파일이다. FSD 레이어 폴더는 이 단계에서 필요한 것만 만들고, 나머지는 화면 구현 시 추가한다. `app` 레이어에서 `providers/` 같은 폴더는 steiger의 `segments-by-purpose` 규칙에 걸리므로 프로바이더와 라우터는 `app` 루트에 파일로 둔다.

```
us-works/
├── .editorconfig
├── .env.example                    # VITE_API_BASE_URL
├── .nvmrc                          # 24
├── .prettierignore
├── .prettierrc
├── commitlint.config.js
├── eslint.config.js
├── knip.json
├── pnpm-workspace.yaml
├── steiger.config.ts
├── vite.config.ts
├── vitest.config.ts
├── index.html                      # lang="ko", title, script src="/src/app/main.tsx"
├── tsconfig.app.json               # 템플릿 파일에 옵션 추가
├── tsconfig.node.json              # include에 vitest.config.ts, steiger.config.ts 추가
└── src/
    ├── app/
    │   ├── main.tsx                # 진입점: 프로바이더 + RouterProvider
    │   ├── app-providers.tsx        # QueryClientProvider, Jotai Provider
    │   ├── router.tsx              # createBrowserRouter
    │   ├── app.tsx                 # "/" 라우트 컴포넌트 (임시)
    │   ├── app.test.tsx            # 파이프라인 검증용 스모크 테스트
    │   └── styles/globals.css
    └── shared/
        └── config/
            ├── test-setup.ts
            ├── vite-env.d.ts         # ImportMetaEnv 타입
            ├── env/                  # VITE_API_BASE_URL 읽기와 검증 (구현, 테스트, index)
            └── index.ts
```

화면 구현 전에는 `shared/ui` 컴포넌트를 만들지 않는다. `@testing-library/user-event`도 첫 인터랙션 테스트를 쓸 때 추가한다.

## 5. 설정 파일

### 5.1 `.nvmrc`

```
24
```

### 5.2 `package.json` 추가 필드

```json
{
  "name": "us-works",
  "packageManager": "pnpm@12.4.2",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint . --max-warnings 0 && pnpm lint:fsd",
    "lint:fsd": "steiger ./src",
    "lint:unused": "knip",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc -b",
    "check": "pnpm typecheck && pnpm lint && pnpm lint:unused && pnpm format:check && pnpm test:run",
    "prepare": "simple-git-hooks"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged",
    "commit-msg": "pnpm commitlint --edit $1",
    "pre-push": "pnpm check"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix --max-warnings 0", "prettier --write"],
    "*.{css,json,md}": ["prettier --write"]
  }
}
```

`packageManager` 값은 `pnpm -v` 출력으로 맞춘다.

### 5.3 `tsconfig.app.json`

템플릿 파일에 아래 옵션을 추가한다. 템플릿이 이미 켜둔 `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`는 유지한다. `baseUrl`은 TypeScript 6에서 deprecated, 7에서 제거되었으므로 쓰지 않는다. Vitest 전역(`describe`, `it`, `vi`) 타입을 위해 `types`에 `vitest/globals`를 추가한다.

```jsonc
{
  "compilerOptions": {
    "types": ["vite/client", "vitest/globals"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "paths": { "@/*": ["./src/*"] },
  },
}
```

`tsconfig.node.json`의 `include`에는 `vitest.config.ts`, `steiger.config.ts`를 추가한다.

### 5.4 `vite.config.ts`

컴파일러 preset이 Babel 파이프라인의 맨 앞에서 실행되어야 한다.

```ts
import path from "node:path";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
});
```

### 5.5 `vitest.config.ts`

`./vite.config.ts`처럼 확장자를 붙여야 한다. 확장자가 없으면 `tsc`가 모듈을 찾지 못하고 Vite도 경고를 낸다.

```ts
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/shared/config/test-setup.ts"],
      env: { VITE_API_BASE_URL: "http://api.test" },
    },
  }),
);
```

`test.env`는 테스트에서 `.env` 파일 없이도 환경 변수 검증이 통과하도록 고정값을 준다.

`src/shared/config/test-setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

### 5.6 `src/app/styles/globals.css`

Figma 토큰 값은 디자인 확인 후 교체한다.

```css
@import "tailwindcss";

@theme {
  --color-primary: #000000;
  --font-sans: "Pretendard", system-ui, sans-serif;
}
```

### 5.7 `.prettierrc`, `.prettierignore`

`tailwindStylesheet`가 없으면 Tailwind 4의 `@theme` 토큰이 정렬에 반영되지 않는다.

```json
{
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/styles/globals.css",
  "tailwindFunctions": ["clsx", "cn"]
}
```

```
# .prettierignore
pnpm-lock.yaml
node_modules
dist
coverage
.vitest
```

### 5.8 `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
```

### 5.9 `eslint.config.js`

구성 순서는 다음과 같다. 모든 규칙은 `error` 또는 `off`이며 `warn`은 쓰지 않는다.

1. `@eslint/js` recommended
2. typescript-eslint `strictTypeChecked` + `stylisticTypeChecked` (`parserOptions.projectService: true`, `tsconfigRootDir: import.meta.dirname`)
3. eslint-plugin-react-hooks `configs.flat.recommended`
4. eslint-plugin-react-refresh `configs.vite`
5. eslint-plugin-simple-import-sort `imports`(side-effect, `node:`, 외부, `@/`, 상대 순), `exports`
6. `@typescript-eslint/consistent-type-imports`(inline), `@typescript-eslint/consistent-type-definitions`(`type` 선호)
7. `@typescript-eslint/naming-convention` (typeLike PascalCase, 인터페이스 `I` 접두사 금지, variable camelCase/PascalCase/UPPER_CASE, function camelCase/PascalCase)
8. eslint-plugin-boundaries (아래)
9. `**/*.test.{ts,tsx}` 한정: @vitest/eslint-plugin `configs.recommended` + eslint-plugin-testing-library `configs['flat/react']`
10. `*.config.{js,ts}` 한정: `tseslint.configs.disableTypeChecked`. `**/*.js`에는 `@eslint/js` recommended만. `**/*.d.ts`에는 `consistent-type-definitions`, `no-explicit-any`, `no-unused-vars` 해제(모듈 확장 선언용)
11. `**/*.{ts,tsx,js}` 전체: eslint-plugin-no-comments `disallowComments` (`allow: ["eslint", "global"]`, 도구 지시문 외 주석 금지)
12. `eslint-config-prettier`
13. `curly: ["error", "all"]`. `eslint-config-prettier`가 끄는 규칙이라 그 뒤에 다시 켠다

boundaries 7 부분이다. `import/resolver` 설정이 없으면 `@/` 별칭 import가 해석되지 않아 외부 패키지(`origin: external`)로 분류되고 모든 정책을 통과한다. 반드시 eslint-import-resolver-typescript를 붙인다. 정책은 순서대로 평가되고 마지막 매칭이 결과를 정한다. `relationship: internal`은 같은 element 안의 import를 뜻한다.

```js
import boundaries from "eslint-plugin-boundaries";

const SLICED_LAYERS = ["pages", "widgets", "features", "entities"];

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.app.json" } },
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { type: "app", pattern: "src/app" },
        { type: "pages", pattern: "src/pages/*", capture: ["slice"] },
        { type: "widgets", pattern: "src/widgets/*", capture: ["slice"] },
        { type: "features", pattern: "src/features/*", capture: ["slice"] },
        { type: "entities", pattern: "src/entities/*", capture: ["slice"] },
        { type: "shared", pattern: "src/shared/*", capture: ["segment"] },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          message:
            "FSD 위반: {{ from.element.type }} → {{ to.element.type }}. 아래 레이어의 index.ts(엔티티 간은 @x/*.ts)만 import할 수 있습니다.",
          policies: [
            { allow: { to: { module: { origin: "external" } } } },
            { allow: { dependency: { relationship: { to: "internal" } } } },
            { allow: { to: { element: { type: "shared" } } } },
            {
              from: { element: { type: "app" } },
              allow: { to: { element: { type: SLICED_LAYERS, fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "pages" } },
              allow: {
                to: {
                  element: {
                    type: ["widgets", "features", "entities"],
                    fileInternalPath: "index.ts",
                  },
                },
              },
            },
            {
              from: { element: { type: "widgets" } },
              allow: {
                to: { element: { type: ["features", "entities"], fileInternalPath: "index.ts" } },
              },
            },
            {
              from: { element: { type: "features" } },
              allow: { to: { element: { type: "entities", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "entities" } },
              allow: {
                to: {
                  element: {
                    type: "entities",
                    captured: { slice: "!{{ from.element.captured.slice }}" },
                    fileInternalPath: "@x/{{ from.element.captured.slice }}.ts",
                  },
                },
              },
            },
          ],
        },
      ],
      "boundaries/no-unknown-files": "error",
    },
  },
];
```

### 5.10 `steiger.config.ts`

`shared/ui`, `shared/lib`는 컴포넌트별 index를 두므로 `fsd/public-api`를 끈다.

```ts
import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  { files: ["./src/shared/**"], rules: { "fsd/public-api": "off" } },
]);
```

### 5.11 `knip.json`

knip의 Vite 플러그인이 `index.html`에서 진입점을 자동으로 찾으므로 `main.tsx`는 적지 않는다. `steiger.config.ts`는 knip이 모르는 도구라 entry로 지정해 플러그인 의존성을 인식시킨다. `tailwindcss`는 CSS `@import`로만 쓰여 knip이 추적하지 못하므로 무시 목록에 둔다.

```json
{
  "$schema": "https://unpkg.com/knip@6/schema.json",
  "entry": ["steiger.config.ts"],
  "project": ["src/**/*.{ts,tsx}"],
  "ignoreDependencies": ["tailwindcss"]
}
```

### 5.12 `commitlint.config.js`

한국어 설명을 허용하기 위해 `subject-case`를 끈다. `package.json`이 `"type": "module"`이므로 ESM으로 쓴다.

```js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: { "subject-case": [0] },
};
```

### 5.13 `.env.example`

```
VITE_API_BASE_URL=https://fe-assignment-api.us-insight.com
```

`.env`는 `.gitignore`에 있다. 로컬에서는 `.env.example`을 복사해 `.env`를 만든다.

## 6. 훅 등록

```bash
pnpm simple-git-hooks
```

## 7. 초기화 완료 기준

2026-09-19 검증 결과다.

- [x] `pnpm install`이 오류 없이 완료되고 `.git/hooks`에 pre-commit, commit-msg, pre-push가 등록된다
- [x] `pnpm dev`로 개발 서버가 뜨고 `index.html`이 `src/app/main.tsx`를 로드한다
- [x] `pnpm build`가 성공한다
- [x] `pnpm check`가 경고 없이 통과한다
- [x] 스모크 테스트 `app.test.tsx`가 통과한다
- [x] Prettier가 `@theme`를 읽어 Tailwind 클래스를 정렬한다 (`format:check` 통과)
- [x] React Compiler가 적용된다 (빌드 산출물에 컴파일러 캐시 호출 `_c(` 존재)

## 8. 정적 검사 동작 검증

아래 위반을 각각 임시로 넣고 해당 검사가 기대대로 동작하는지 확인한 뒤 되돌린다. 임시 `entities/a`, `entities/b` 슬라이스는 다른 곳에서 참조되지 않아 steiger의 `insignificant-slice`가 함께 보고되는데, 이는 시나리오와 무관한 소음이다. `shared`는 정책상 파일 단위 import를 허용하므로 공개 API 우회 검증은 `entities`로 한다.

| 위반                             | 넣는 위치                                                             | 기대 결과                                         | 2026-09-19 |
| -------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- | ---------- |
| 하위 레이어가 상위 레이어 import | `src/shared/config/`의 파일에서 `@/app/App` import                    | boundaries 실패                                   | 확인       |
| 같은 레이어 슬라이스 교차 import | `entities/b`가 `@/entities/a`(index) import                           | boundaries, steiger `forbidden-imports` 실패      | 확인       |
| 공개 API 우회                    | `entities/b`가 `@/entities/a/model/a` import                          | boundaries, steiger `no-public-api-sidestep` 실패 | 확인       |
| `@x` 경로 허용                   | `entities/a/@x/b.ts`를 두고 `entities/b`가 `@/entities/a/@x/b` import | boundaries 통과                                   | 확인       |
| 남의 `@x` 사용                   | `entities/b`가 `@/entities/a/@x/c` import                             | boundaries 실패                                   | 확인       |
| 같은 슬라이스 내부 import        | `entities/a/index.ts`가 `./model/a` import                            | boundaries 통과                                   | 확인       |
| 레이어 역방향                    | `features/f`가 `@/pages/p` import                                     | boundaries 실패                                   | 확인       |
| `any` 사용                       | 아무 파일에 `const x: any = 1`                                        | typescript-eslint `no-explicit-any` 실패          | 확인       |
| 미사용 export                    | `src/app/router.tsx`에 아무도 쓰지 않는 export 추가                   | knip 실패                                         | 확인       |
| 잘못된 커밋 메시지               | `git commit --allow-empty -m "테스트"`                                | commit-msg 훅 실패, 커밋 생성 안 됨               | 확인       |
