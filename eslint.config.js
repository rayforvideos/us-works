import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import noComments from "eslint-plugin-no-comments";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

import { sectionMarkers } from "./eslint/rules/section-markers/index.js";

const SLICED_LAYERS = ["pages", "widgets", "features", "entities"];

export default defineConfig([
  globalIgnores(["dist", "node_modules", "coverage", ".vitest"]),

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
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [["^\\u0000"], ["^node:"], ["^react", "^@?\\w"], ["^@/"], ["^\\."]],
        },
      ],
      "simple-import-sort/exports": "error",
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        { considerDefaultExhaustiveForUnions: true },
      ],
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
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

  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
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

  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { react },
    rules: { "react/no-danger": "error" },
  },

  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}", "**/*.d.ts", "**/types.ts", "**/constants.ts"],
    plugins: { local: { rules: { "section-markers": sectionMarkers } } },
    rules: { "local/section-markers": "error" },
  },

  {
    files: ["**/*.test.{ts,tsx}"],
    extends: [vitest.configs.recommended, testingLibrary.configs["flat/react"]],
    rules: {
      "vitest/expect-expect": ["error", { assertFunctionNames: ["expect", "expectTypeOf"] }],
    },
  },

  {
    files: ["*.config.{js,ts}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx,js}"],
    plugins: { "no-comments": noComments },
    rules: {
      "no-comments/disallowComments": [
        "error",
        { allow: ["eslint", "global", "\\*\\n \\* @(types|constants)\\n $"] },
      ],
    },
  },

  prettier,
  {
    files: ["**/*.{ts,tsx,js}"],
    rules: { curly: ["error", "all"] },
  },
]);
