import { PENDING_NOTIFICATION_FIXTURE } from "@/entities/notification";

import { type NotificationFormValues } from "../notification-input-schema";
import {
  diffNotificationUpdate,
  isSameNotificationValues,
  toNotificationFormValues,
  toNotificationInput,
} from ".";

const VALUES: NotificationFormValues = {
  targetType: "all",
  title: "알림 제목",
  scheduledAt: "2026-12-20T10:00",
};

describe("toNotificationInput", () => {
  it("R-05 요청의 `scheduled_at`은 선택한 날짜·시간을 `+09:00` 오프셋의 ISO 8601로 만든다", () => {
    expect(toNotificationInput(VALUES, 147)).toEqual({
      content_id: 147,
      title: "알림 제목",
      target_type: "all",
      scheduled_at: "2026-12-20T10:00:00+09:00",
    });
  });
});

describe("toNotificationFormValues", () => {
  it("알림의 예약 시각을 서울 기준 날짜·시간 값으로 바꿔 폼 값을 만든다", () => {
    expect(toNotificationFormValues(PENDING_NOTIFICATION_FIXTURE)).toEqual({
      targetType: "follower",
      title: "두 번째 알림",
      scheduledAt: "2026-10-01T09:00",
    });
  });
});

describe("isSameNotificationValues", () => {
  it("세 값이 모두 같을 때만 같은 값으로 본다", () => {
    expect(isSameNotificationValues(VALUES, { ...VALUES })).toBe(true);
    expect(isSameNotificationValues(VALUES, { ...VALUES, title: "바뀐 제목" })).toBe(false);
  });
});

describe("diffNotificationUpdate", () => {
  it("R-07 수정 요청은 제목·대상자가 바뀌었을 때만 `PUT /notifications/{id}`를, 시간이 바뀌었을 때만 `PUT /notifications/{id}/schedule`을 보낸다", () => {
    expect(diffNotificationUpdate(VALUES, { ...VALUES, title: "바뀐 제목" })).toEqual({
      detail: { title: "바뀐 제목", target_type: "all" },
      schedule: undefined,
    });
    expect(diffNotificationUpdate(VALUES, { ...VALUES, scheduledAt: "2026-12-20T14:30" })).toEqual({
      detail: undefined,
      schedule: { scheduled_at: "2026-12-20T14:30:00+09:00" },
    });
    expect(diffNotificationUpdate(VALUES, { ...VALUES })).toEqual({
      detail: undefined,
      schedule: undefined,
    });
  });
});
