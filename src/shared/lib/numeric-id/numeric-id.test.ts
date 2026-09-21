import { parseNumericId } from "./numeric-id";

describe("parseNumericId", () => {
  it("양의 정수 문자열만 숫자로 바꾼다", () => {
    expect(parseNumericId("136")).toBe(136);
    expect(parseNumericId("1")).toBe(1);
  });

  it("값이 없거나 양의 정수가 아니면 null이다", () => {
    expect(parseNumericId(undefined)).toBeNull();
    expect(parseNumericId(null)).toBeNull();
    expect(parseNumericId("")).toBeNull();
    expect(parseNumericId("0")).toBeNull();
    expect(parseNumericId("-3")).toBeNull();
    expect(parseNumericId("1.5")).toBeNull();
    expect(parseNumericId("abc")).toBeNull();
    expect(parseNumericId(" 7 ")).toBeNull();
  });
});
