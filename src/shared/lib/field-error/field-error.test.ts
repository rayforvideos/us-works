import { readFieldError } from ".";

describe("readFieldError", () => {
  it("첫 번째 오류의 문구를 돌려준다", () => {
    expect(readFieldError([{ message: "제목을 입력해주세요." }, { message: "두 번째" }])).toBe(
      "제목을 입력해주세요.",
    );
  });

  it("오류가 없거나 문구가 없으면 undefined를 돌려준다", () => {
    expect(readFieldError([])).toBeUndefined();
    expect(readFieldError([undefined])).toBeUndefined();
    expect(readFieldError([{ code: "custom" }])).toBeUndefined();
  });
});
