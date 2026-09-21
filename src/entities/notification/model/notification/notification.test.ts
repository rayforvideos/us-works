import {
  canEditNotification,
  diffNotification,
  FAILED_NOTIFICATION_FIXTURE,
  formatScheduledAt,
  getSendStatusBadge,
  getStatCount,
  getTargetTypeLabel,
  hasNotificationChanges,
  parseNotificationListParams,
  PENDING_NOTIFICATION_FIXTURE,
  SENT_NOTIFICATION_FIXTURE,
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

describe("canEditNotification", () => {
  it("발송 대기 중인 알림만 고칠 수 있다", () => {
    expect(canEditNotification(PENDING_NOTIFICATION_FIXTURE)).toBe(true);
    expect(canEditNotification(SENT_NOTIFICATION_FIXTURE)).toBe(false);
    expect(canEditNotification(FAILED_NOTIFICATION_FIXTURE)).toBe(false);
  });
});

describe("diffNotification", () => {
  it("R-07 제목이나 대상자가 바뀌었을 때만 내용 요청을, 시각이 바뀌었을 때만 예약 요청을 만든다", () => {
    const current = PENDING_NOTIFICATION_FIXTURE;
    const same = {
      title: current.title,
      targetType: current.target_type,
      scheduledAt: current.scheduled_at,
    };

    expect(diffNotification(current, { ...same, title: "바뀐 제목" })).toEqual({
      detail: { title: "바뀐 제목", target_type: current.target_type },
      schedule: undefined,
    });
    expect(
      diffNotification(current, { ...same, scheduledAt: "2026-12-20T14:30:00+09:00" }),
    ).toEqual({
      detail: undefined,
      schedule: { scheduled_at: "2026-12-20T14:30:00+09:00" },
    });
    expect(diffNotification(current, same)).toEqual({ detail: undefined, schedule: undefined });
  });

  it("예약 시각을 넘기지 않으면 예약 요청을 만들지 않는다", () => {
    const current = PENDING_NOTIFICATION_FIXTURE;

    expect(
      diffNotification(current, { title: current.title, targetType: current.target_type }),
    ).toEqual({ detail: undefined, schedule: undefined });
  });

  it("초 단위만 다른 예약 시각은 바뀌지 않은 것으로 본다", () => {
    const current = { ...PENDING_NOTIFICATION_FIXTURE, scheduled_at: "2026-10-01T09:00:30+09:00" };

    expect(
      diffNotification(current, {
        title: current.title,
        targetType: current.target_type,
        scheduledAt: "2026-10-01T09:00:00+09:00",
      }).schedule,
    ).toBeUndefined();
  });
});

describe("hasNotificationChanges", () => {
  it("내용이나 예약 요청이 하나라도 있으면 바뀐 것으로 본다", () => {
    expect(hasNotificationChanges({})).toBe(false);
    expect(hasNotificationChanges({ detail: { title: "t", target_type: "all" } })).toBe(true);
    expect(
      hasNotificationChanges({ schedule: { scheduled_at: "2026-10-01T09:00:00+09:00" } }),
    ).toBe(true);
  });
});
