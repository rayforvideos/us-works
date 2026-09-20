import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";

import { sectionMarkers } from "./section-markers.js";

const tester = new RuleTester({
  languageOptions: { parser: tseslint.parser, ecmaVersion: "latest", sourceType: "module" },
});

tester.run("section-markers", sectionMarkers, {
  valid: [
    {
      name: "타입과 상수가 없는 파일은 표시가 없어도 통과한다",
      code: `import { a } from "./a";\nexport function run() {\n  return a;\n}\n`,
    },
    {
      name: "import 아래 @types 구역과 @constants 구역 뒤에 코드가 오면 통과한다",
      code: [
        `import { a } from "./a";`,
        `/**`,
        ` * @types`,
        ` */`,
        `type Options = { a: number };`,
        `type Result = string;`,
        `/**`,
        ` * @constants`,
        ` */`,
        `const DEFAULT_LIMIT = 10;`,
        `const MAX_RETRY = 1;`,
        `export function run(options: Options): Result {`,
        `  return String(options.a + DEFAULT_LIMIT + MAX_RETRY + a);`,
        `}`,
      ].join("\n"),
    },
    {
      name: "export된 타입과 상수도 같은 구역으로 인정한다",
      code: [
        `/**`,
        ` * @types`,
        ` */`,
        `export type Options = { a: number };`,
        `/**`,
        ` * @constants`,
        ` */`,
        `export const DEFAULT_LIMIT = 10;`,
        `export function run(options: Options) {`,
        `  return options.a + DEFAULT_LIMIT;`,
        `}`,
      ].join("\n"),
    },
    {
      name: "camelCase const는 상수가 아니라 코드로 본다",
      code: [
        `export const routes = [1, 2];`,
        `export function run() {`,
        `  return routes;`,
        `}`,
      ].join("\n"),
    },
  ],
  invalid: [
    {
      name: "코드 뒤에 온 타입은 @types 구역 밖으로 보고한다",
      code: [
        `export function run() {`,
        `  return 1;`,
        `}`,
        `/**`,
        ` * @types`,
        ` */`,
        `type Options = { a: number };`,
      ].join("\n"),
      errors: [{ messageId: "typeOutOfSection" }],
    },
    {
      name: "코드 뒤에 온 UPPER_CASE 상수는 @constants 구역 밖으로 보고한다",
      code: [
        `export function run() {`,
        `  return DEFAULT_LIMIT;`,
        `}`,
        `/**`,
        ` * @constants`,
        ` */`,
        `const DEFAULT_LIMIT = 10;`,
      ].join("\n"),
      errors: [{ messageId: "constantOutOfSection" }],
    },
    {
      name: "상수 뒤에 온 타입은 @types 구역 밖으로 보고한다",
      code: [
        `/**`,
        ` * @constants`,
        ` */`,
        `const DEFAULT_LIMIT = 10;`,
        `/**`,
        ` * @types`,
        ` */`,
        `type Options = { a: number };`,
        `export function run(options: Options) {`,
        `  return options.a + DEFAULT_LIMIT;`,
        `}`,
      ].join("\n"),
      errors: [{ messageId: "typeOutOfSection" }],
    },
    {
      name: "첫 타입 위에 @types 표시가 없으면 보고한다",
      code: [
        `type Options = { a: number };`,
        `export function run(options: Options) {`,
        `  return options.a;`,
        `}`,
      ].join("\n"),
      errors: [{ messageId: "missingMarker", data: { name: "types" } }],
    },
    {
      name: "첫 상수 위에 @constants 표시가 없으면 보고한다",
      code: [
        `const DEFAULT_LIMIT = 10;`,
        `export function run() {`,
        `  return DEFAULT_LIMIT;`,
        `}`,
      ].join("\n"),
      errors: [{ messageId: "missingMarker", data: { name: "constants" } }],
    },
    {
      name: "구역의 첫 선언이 아닌 곳에 있는 표시는 보고한다",
      code: [
        `/**`,
        ` * @types`,
        ` */`,
        `type Options = { a: number };`,
        `/**`,
        ` * @types`,
        ` */`,
        `type Result = string;`,
        `export function run(options: Options): Result {`,
        `  return String(options.a);`,
        `}`,
      ].join("\n"),
      errors: [{ messageId: "strayMarker" }],
    },
    {
      name: "타입이 없는 파일의 @types 표시는 보고한다",
      code: [`/**`, ` * @types`, ` */`, `export function run() {`, `  return 1;`, `}`].join("\n"),
      errors: [{ messageId: "strayMarker" }],
    },
  ],
});
