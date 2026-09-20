import { fromSeoulIso, isFutureDateTime, toMinDateTime, toSeoulIso, toSeoulParts } from ".";

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

describe("toSeoulIso", () => {
  it("선택한 날짜·시간을 `+09:00` 오프셋의 ISO 8601로 만든다", () => {
    expect(toSeoulIso("2027-04-05T14:35")).toBe("2027-04-05T14:35:00+09:00");
    expect(toSeoulIso("2026-01-05T00:30")).toBe("2026-01-05T00:30:00+09:00");
  });
});

describe("fromSeoulIso", () => {
  it("ISO 8601 시각을 서울 기준 `yyyy-MM-ddTHH:mm`으로 바꾼다", () => {
    expect(fromSeoulIso("2026-10-01T09:00:00+09:00")).toBe("2026-10-01T09:00");
    expect(fromSeoulIso("2026-09-30T15:00:00Z")).toBe("2026-10-01T00:00");
  });

  it("날짜가 아니면 빈 값을 돌려준다", () => {
    expect(fromSeoulIso("not-a-date")).toBe("");
  });
});

describe("toMinDateTime", () => {
  it("지금을 서울 기준 `yyyy-MM-ddTHH:mm`으로 돌려준다", () => {
    expect(toMinDateTime(new Date("2026-09-20T23:30:00Z"))).toBe("2026-09-21T08:30");
  });
});

describe("isFutureDateTime", () => {
  it("선택한 시각이 지금보다 뒤일 때만 참이다", () => {
    const now = new Date("2026-09-20T10:00:00+09:00");

    expect(isFutureDateTime("2026-09-20T10:30", now)).toBe(true);
    expect(isFutureDateTime("2026-09-20T09:30", now)).toBe(false);
    expect(isFutureDateTime("", now)).toBe(false);
  });
});
