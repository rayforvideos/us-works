import {
  fromScheduledAt,
  isFutureScheduledAt,
  isHalfHourStep,
  toMinDateTime,
  toScheduledAt,
} from ".";

describe("toScheduledAt", () => {
  it("R-05 요청의 `scheduled_at`은 선택한 날짜·시간을 `+09:00` 오프셋의 ISO 8601로 만든다", () => {
    expect(toScheduledAt("2027-04-05T14:30")).toBe("2027-04-05T14:30:00+09:00");
    expect(toScheduledAt("2026-01-05T00:30")).toBe("2026-01-05T00:30:00+09:00");
  });
});

describe("fromScheduledAt", () => {
  it("예약 시각을 서울 기준 `yyyy-MM-ddTHH:mm`으로 바꾼다", () => {
    expect(fromScheduledAt("2026-10-01T09:00:00+09:00")).toBe("2026-10-01T09:00");
    expect(fromScheduledAt("2026-09-30T15:00:00Z")).toBe("2026-10-01T00:00");
  });

  it("예약 시각이 날짜가 아니면 빈 값을 돌려준다", () => {
    expect(fromScheduledAt("not-a-date")).toBe("");
  });
});

describe("toMinDateTime", () => {
  it("지금을 서울 기준 `yyyy-MM-ddTHH:mm`으로 돌려준다", () => {
    expect(toMinDateTime(new Date("2026-09-20T23:30:00Z"))).toBe("2026-09-21T08:30");
  });
});

describe("isFutureScheduledAt", () => {
  it("선택한 시각이 지금보다 뒤일 때만 참이다", () => {
    const now = new Date("2026-09-20T10:00:00+09:00");

    expect(isFutureScheduledAt("2026-09-20T10:30", now)).toBe(true);
    expect(isFutureScheduledAt("2026-09-20T09:30", now)).toBe(false);
    expect(isFutureScheduledAt("", now)).toBe(false);
  });
});

describe("isHalfHourStep", () => {
  it("분이 00 또는 30일 때만 참이다", () => {
    expect(isHalfHourStep("2027-04-05T14:00")).toBe(true);
    expect(isHalfHourStep("2027-04-05T14:30")).toBe(true);
    expect(isHalfHourStep("2027-04-05T14:15")).toBe(false);
    expect(isHalfHourStep("")).toBe(false);
  });
});
