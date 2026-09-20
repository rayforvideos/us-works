import {
  formatScheduledAt,
  getSendStatusBadge,
  getStatCount,
  getTargetTypeLabel,
  parseNotificationListParams,
} from ".";

describe("알림 모델", () => {
  it('33 R-01 발송 상태 `sent`는 "발송"과 green, `pending`은 "예약"과 yellow, `failed`는 "실패"와 red 배지다', () => {
    expect(getSendStatusBadge("sent")).toEqual({ label: "발송", tone: "green" });
    expect(getSendStatusBadge("pending")).toEqual({ label: "예약", tone: "yellow" });
    expect(getSendStatusBadge("failed")).toEqual({ label: "실패", tone: "red" });
  });

  it('33 R-02 발송 날짜는 `yyyy.MM.dd`와 `HH:mm` 두 줄로 표시하고, 값이 없으면 "-"다', () => {
    expect(formatScheduledAt("2026-09-20T10:30:00+09:00")).toEqual({
      date: "2026.09.20",
      time: "10:30",
    });
    expect(formatScheduledAt("2026-01-05T00:05:00+09:00")).toEqual({
      date: "2026.01.05",
      time: "00:05",
    });
    expect(formatScheduledAt(undefined)).toBeNull();
    expect(formatScheduledAt("")).toBeNull();
    expect(formatScheduledAt("not-a-date")).toBeNull();
  });

  it('33 R-03 발송 성공·실패 수는 `stats`가 없으면 "-"다', () => {
    expect(getStatCount({ success_count: 120, failure_count: 3 }, "success_count")).toBe(120);
    expect(getStatCount({ success_count: 0, failure_count: 12 }, "success_count")).toBe(0);
    expect(getStatCount({ success_count: 0, failure_count: 12 }, "failure_count")).toBe(12);
    expect(getStatCount(undefined, "success_count")).toBeNull();
    expect(getStatCount(undefined, "failure_count")).toBeNull();
  });

  it('대상자 `all`은 "전체", `follower`는 "팔로워", `member`는 "멤버십"이다', () => {
    expect(getTargetTypeLabel("all")).toBe("전체");
    expect(getTargetTypeLabel("follower")).toBe("팔로워");
    expect(getTargetTypeLabel("member")).toBe("멤버십");
  });

  it("33 R-04 URL의 `page`가 1 미만이거나 숫자가 아니면 1로, 9999를 넘으면 9999로 읽는다", () => {
    expect(parseNotificationListParams(new URLSearchParams("page=0"))).toEqual({
      page: 1,
      limit: 10,
    });
    expect(parseNotificationListParams(new URLSearchParams("page=abc")).page).toBe(1);
    expect(parseNotificationListParams(new URLSearchParams("page=10000")).page).toBe(9999);
    expect(parseNotificationListParams(new URLSearchParams("page=3")).page).toBe(3);
  });
});
