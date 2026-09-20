import { toSeoulParts } from ".";

describe("toSeoulParts", () => {
  it("UTC 시각을 서울 시각의 연·월·일·시·분으로 나눈다", () => {
    expect(toSeoulParts(new Date("2026-09-20T07:41:00.000Z"))).toEqual({
      year: "2026",
      month: "09",
      day: "20",
      hour: "16",
      minute: "41",
    });
  });

  it("오프셋이 붙은 시각도 서울 기준으로 나눈다", () => {
    expect(toSeoulParts(new Date("2026-01-05T10:00:00-05:00"))).toEqual({
      year: "2026",
      month: "01",
      day: "06",
      hour: "00",
      minute: "00",
    });
  });

  it("자정은 24시가 아니라 00시로 나눈다", () => {
    expect(toSeoulParts(new Date("2026-01-05T15:00:00.000Z"))?.hour).toBe("00");
  });

  it("유효하지 않은 날짜는 null이다", () => {
    expect(toSeoulParts(new Date("not-a-date"))).toBeNull();
  });
});
