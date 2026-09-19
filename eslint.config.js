import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const SLICED_LAYERS = ["pages", "widgets", "features", "entities"];

export default defineConfig([
  globalIgnores(["dist", "node_modules", "coverage", ".vitest"]),

  // 1~4. 기본 규칙, 타입 기반 규칙, React 규칙
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // 5~7. import 정렬, 타입 import, 네이밍
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"], // side-effect import
            ["^node:"], // Node 내장 모듈
            ["^react", "^@?\\w"], // 외부 패키지
            ["^@/"], // 별칭 절대 경로
            ["^\\."], // 상대 경로
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      // props에 교차 타입(&)을 자주 쓰므로 객체 타입 선언은 type으로 통일
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "typeLike", format: ["PascalCase"] },
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: { regex: "^I[A-Z]", match: false },
        },
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        { selector: "function", format: ["camelCase", "PascalCase"] },
      ],
    },
  },

  // 8. FSD 경계 (eslint-plugin-boundaries 7)
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      // @/ 별칭을 해석해야 boundaries가 로컬 모듈로 분류한다 (미해석 별칭은 external 취급)
      "import/resolver": {
        typescript: { project: "./tsconfig.app.json" },
      },
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
            // 외부 패키지와 같은 element 내부 import는 항상 허용
            { allow: { to: { module: { origin: "external" } } } },
            { allow: { dependency: { relationship: { to: "internal" } } } },

            // shared는 모든 레이어가 파일 단위로 import 가능
            { allow: { to: { element: { type: "shared" } } } },

            // 레이어 방향: 아래 레이어의 슬라이스는 index.ts로만 import
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

            // entities 간 교차 참조는 @x/<소비자 슬라이스>.ts 로만
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

  // 9. 테스트 파일
  {
    files: ["**/*.test.{ts,tsx}"],
    extends: [vitest.configs.recommended, testingLibrary.configs["flat/react"]],
  },

  // 10. 설정 파일은 타입 기반 규칙 제외
  {
    files: ["*.config.{js,ts}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
  },

  // 11. Prettier와 충돌하는 포맷 규칙 제거
  prettier,
]);
