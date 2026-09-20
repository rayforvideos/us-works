import { formatDateTimeLabel } from "./format-date-time-label";

describe("formatDateTimeLabel", () => {
  it("`yyyy-MM-ddTHH:mm` 값을 `yyyy년 MM월 dd일 HH시 mm분`으로 바꾼다", () => {
    expect(formatDateTimeLabel("2027-04-05T14:30")).toBe("2027년 04월 05일 14시 30분");
    expect(formatDateTimeLabel("2026-01-05T00:00")).toBe("2026년 01월 05일 00시 00분");
  });

  it("값이 비었거나 형식이 아니면 빈 문자열을 돌려준다", () => {
    expect(formatDateTimeLabel("")).toBe("");
    expect(formatDateTimeLabel("2027-04-05")).toBe("");
  });
});
