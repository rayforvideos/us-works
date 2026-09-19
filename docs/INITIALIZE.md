# 프로젝트 초기화 스펙

FE 과제(Us FE Developer Recruit Works)의 스캐폴딩 절차서다. 실행 순서와 설정 파일 내용만 다룬다. 결정 근거는 ADR, 코드 컨벤션과 레이어 규칙은 `AGENTS.md`에 있다.

- [ADR-0001: Frontend Tech Stack Selection](../adrs/0001-tech-stack.md)
- [ADR-0002: Adopt Feature-Sliced Design Directory Structure](../adrs/0002-fsd-directory-structure.md)
- [ADR-0003: Enforce FSD Boundaries Statically](../adrs/0003-fsd-static-enforcement.md)
- [ADR-0004: Enforce Code Conventions and Quality Statically](../adrs/0004-static-code-quality.md)

## 1. 버전

2026-09-19 기준 npm 최신 안정 버전과 각 공식 문서의 요구사항을 확인한 값이다.

| 패키지 | 버전 | 제약 |
| --- | --- | --- |
| Node.js | 24.x | `.nvmrc`로 고정. lint-staged 17이 22.22 이상 요구. Node 25부터 corepack 미포함 |
| pnpm | 12.x | corepack으로 활성화, `packageManager` 필드로 고정 |
| TypeScript | 6.0.x | 7.x는 프로그램 API가 없어 typescript-eslint(`<6.1.0`)와 호환 불가. 7.x로 올리지 않는다 |
| React, React DOM | 19.x | React Router 8이 19.2.7 이상 요구 |
| Vite | 8.x | `@vitejs/plugin-react` 6.x |
| React Compiler | 1.0.x | `babel-plugin-react-compiler`, `@rolldown/plugin-babel` 경로. `compiler: true`(Rust)는 experimental이라 미사용 |
| Tailwind CSS | 4.x | `@tailwindcss/vite` |
| React Router | 8.x | 패키지 `react-router` 하나. DOM API는 `react-router/dom` |
| TanStack Query | 5.x | |
| Jotai | 3.0.x | ESM 전용. `atomFamily`는 `jotai-family`, `loadable` 제거 |
| Vitest | 5.x | Node 22.12 이상. `clearMocks` 기본 true |
| Testing Library React | 16.x | |
| ESLint | 10.x | flat config 전용 |
| typescript-eslint | 8.x | |
| eslint-plugin-react-hooks | 7.x | `configs.flat.recommended` |
| eslint-plugin-boundaries | 7.x | 단일 `dependencies` 규칙, selector 정책 |
| steiger, @feature-sliced/steiger-plugin | 0.6.x, 0.7.x | |
| knip | 6.x | |
| Prettier | 3.x | `prettier-plugin-tailwindcss`는 `tailwindStylesheet` 필수 |
| simple-git-hooks, lint-staged, commitlint | 2.x, 17.x, 21.x | |

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
pnpm add -D @rolldown/plugin-babel @babel/core @types/babel__core babel-plugin-react-compiler
pnpm add tailwindcss @tailwindcss/vite
pnpm add react-router @tanstack/react-query jotai
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
pnpm add -D eslint-plugin-simple-import-sort @vitest/eslint-plugin eslint-plugin-testing-library
pnpm add -D prettier prettier-plugin-tailwindcss eslint-config-prettier
pnpm add -D eslint-plugin-boundaries steiger @feature-sliced/steiger-plugin
pnpm add -D knip
pnpm add -D simple-git-hooks lint-staged @commitlint/cli @commitlint/config-conventional
```

## 4. 생성할 파일

스캐폴딩 단계에서 만드는 파일이다. FSD 레이어 폴더는 이 단계에서 필요한 것만 만들고, 나머지는 화면 구현 시 추가한다.

```
us-works/
├── .editorconfig
├── .nvmrc                          # 24
├── .prettierrc
├── commitlint.config.js
├── eslint.config.js
├── knip.json
├── steiger.config.ts
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.app.json               # 템플릿 파일에 옵션 추가
└── src/
    ├── app/
    │   ├── main.tsx
    │   ├── App.tsx
    │   └── styles/globals.css
    └── shared/
        ├── config/test-setup.ts
        └── ui/button/                # 초기화 검증용 샘플 컴포넌트와 테스트
            ├── Button.tsx
            ├── Button.test.tsx
            └── index.ts
```

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

템플릿 파일에 아래 옵션을 추가한다. 템플릿이 이미 켜둔 `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`는 유지한다. `baseUrl`은 TypeScript 6에서 deprecated, 7에서 제거되었으므로 쓰지 않는다.

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

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

```ts
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/shared/config/test-setup.ts"],
    },
  }),
);
```

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

### 5.7 `.prettierrc`

`tailwindStylesheet`가 없으면 Tailwind 4의 `@theme` 토큰이 정렬에 반영되지 않는다.

```json
{
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/styles/globals.css",
  "tailwindFunctions": ["clsx", "cn"]
}
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
5. eslint-plugin-simple-import-sort `imports`, `exports`
6. `@typescript-eslint/consistent-type-imports`
7. `@typescript-eslint/naming-convention` (typeLike PascalCase, 인터페이스 `I` 접두사 금지, variable camelCase/PascalCase/UPPER_CASE, function camelCase/PascalCase)
8. eslint-plugin-boundaries (아래)
9. `**/*.test.{ts,tsx}` 한정: @vitest/eslint-plugin `configs.recommended` + eslint-plugin-testing-library `configs['flat/react']`
10. `*.config.{js,ts}` 한정: `tseslint.configs.disableTypeChecked`
11. `eslint-config-prettier`

boundaries 7 부분의 뼈대다. selector 세부 문법(`fileInternalPath`, `relationship`, 템플릿)은 8장의 위반 코드 검증으로 확정한다.

```js
import boundaries from "eslint-plugin-boundaries";

const SLICED = ["pages", "widgets", "features", "entities"];

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
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
      "boundaries/dependencies": ["error", {
        default: "disallow",
        policies: [
          { allow: { to: { module: { origin: "external" } } } },
          { allow: { dependency: { relationship: { to: "internal" } } } },
          { allow: { to: { element: { type: "shared" } } } },
          { from: { element: { type: "app" } },
            allow: { to: { element: { type: SLICED, fileInternalPath: "index.ts" } } } },
          { from: { element: { type: "pages" } },
            allow: { to: { element: { type: ["widgets", "features", "entities"], fileInternalPath: "index.ts" } } } },
          { from: { element: { type: "widgets" } },
            allow: { to: { element: { type: ["features", "entities"], fileInternalPath: "index.ts" } } } },
          { from: { element: { type: "features" } },
            allow: { to: { element: { type: "entities", fileInternalPath: "index.ts" } } } },
          { from: { element: { type: "entities" } },
            allow: { to: { element: {
              type: "entities",
              captured: { slice: "!{{ from.element.captured.slice }}" },
              fileInternalPath: "@x/{{ from.element.captured.slice }}.ts",
            } } } },
        ],
      }],
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

```json
{
  "$schema": "https://unpkg.com/knip@6/schema.json",
  "entry": ["src/app/main.tsx"],
  "project": ["src/**/*.{ts,tsx}"],
  "ignoreDependencies": []
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

## 6. 훅 등록

```bash
pnpm simple-git-hooks
```

## 7. 초기화 완료 기준

- [ ] `pnpm install`이 오류 없이 완료되고 `.git/hooks`에 pre-commit, commit-msg, pre-push가 등록된다
- [ ] `pnpm dev`로 개발 서버가 뜨고 `App.tsx`가 렌더링된다
- [ ] `pnpm build`가 성공한다
- [ ] `pnpm check`가 경고 없이 통과한다
- [ ] 샘플 `Button.test.tsx`가 통과한다
- [ ] Tailwind 클래스가 스타일로 적용되고 Prettier가 `@theme` 커스텀 클래스를 정렬한다
- [ ] React DevTools에서 샘플 컴포넌트에 Memo 배지가 표시된다

## 8. 정적 검사 동작 검증

아래 위반을 각각 임시로 넣고 해당 검사가 실패하는지 확인한 뒤 되돌린다. 모두 실패해야 초기화 완료다.

| 위반 | 넣는 위치 | 실패해야 하는 검사 |
| --- | --- | --- |
| 하위 레이어가 상위 레이어 import | `src/shared/ui/button/Button.tsx`에서 `@/app/App` import | `pnpm lint` (boundaries) |
| 같은 레이어 슬라이스 교차 import | 임시 `src/entities/a`, `src/entities/b` 생성 후 b의 `index.ts`를 a에서 import | `pnpm lint` (boundaries, steiger) |
| 공개 API 우회 | `src/app/App.tsx`에서 `@/shared/ui/button/Button` 대신 임시 슬라이스 내부 파일 직접 import | `pnpm lint` (boundaries, steiger) |
| `@x` 경로 허용 확인 | a에 `@x/b.ts`를 두고 b에서 import | `pnpm lint` 통과해야 함 |
| `any` 사용 | 아무 파일에 `const x: any = 1` | `pnpm lint` (typescript-eslint) |
| 미사용 export | `Button/index.ts`에 아무도 쓰지 않는 export 추가 | `pnpm lint:unused` (knip) |
| 잘못된 커밋 메시지 | `git commit -m "테스트"` 시도 | commit-msg 훅 |
