import shapeCss from "@/app/styles/theme/shape.css?raw";
import typographyCss from "@/app/styles/theme/typography.css?raw";
import { RADIUS_TOKENS, SHADOW_TOKENS, TEXT_STYLE_TOKENS } from "@/shared/lib/cn";

function readThemeTokens(css: string, namespace: string): string[] {
  const pattern = new RegExp(`--${namespace}-([a-z0-9]+(?:-[a-z0-9]+)*):`, "g");
  return [...css.matchAll(pattern)].map((match) => match[1] ?? "");
}

describe("cn 토큰 목록은 테마 CSS와 같다", () => {
  it("텍스트 스타일 토큰 목록이 typography.css의 --text-* 정의와 같다", () => {
    expect(readThemeTokens(typographyCss, "text").sort()).toEqual([...TEXT_STYLE_TOKENS].sort());
  });

  it("라운드 토큰 목록이 shape.css의 --radius-* 정의와 같다", () => {
    expect(readThemeTokens(shapeCss, "radius").sort()).toEqual([...RADIUS_TOKENS].sort());
  });

  it("그림자 토큰 목록이 shape.css의 --shadow-* 정의와 같다", () => {
    expect(readThemeTokens(shapeCss, "shadow").sort()).toEqual([...SHADOW_TOKENS].sort());
  });
});
