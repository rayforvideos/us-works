import { DRAFT_CONTENT_FIXTURE, SCHEDULED_CONTENT_FIXTURE } from "@/entities/content";
import { PENDING_NOTIFICATION_FIXTURE, SENT_NOTIFICATION_FIXTURE } from "@/entities/notification";

import { type PublishOptionsValues } from "../publish-options-schema";
import { buildPublishPlan } from ".";

const BASE_VALUES: PublishOptionsValues = {
  visibility: "public",
  publishedAt: "",
  notify: false,
  targetType: "all",
  useContentTitle: false,
  notificationTitle: "",
};

function buildPlan(
  values: Partial<PublishOptionsValues>,
  current: Parameters<typeof buildPublishPlan>[0]["current"] = {
    content: null,
    notification: null,
  },
) {
  return buildPublishPlan({
    current,
    values: { ...BASE_VALUES, ...values },
    contentTitle: "콘텐츠 제목",
  });
}

describe("buildPublishPlan", () => {
  it("R-08 요청 계획: 목표 상태와 현재 상태의 차이로만 요청을 만든다. 공개 → `PATCH public`. 비공개 → 예약이 있으면 `DELETE schedule` 뒤 `PATCH private`, 없으면 `PATCH private`. 예약 → 예약이 없으면 `POST schedule`, 시각이 바뀌었으면 `PUT schedule`. 알림: 발송이고 없으면 `POST`(예약이면 `scheduled_at` 포함), 있으면 바뀐 부분만 `PUT`, 미발송이고 있으면 `DELETE`", () => {
    expect(buildPlan({ visibility: "public" })).toEqual([{ kind: "status", status: "public" }]);
    expect(
      buildPlan({ visibility: "public" }, { content: DRAFT_CONTENT_FIXTURE, notification: null }),
    ).toEqual([{ kind: "status", status: "public" }]);
    expect(buildPlan({ visibility: "private" })).toEqual([]);
    expect(
      buildPlan(
        { visibility: "private" },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: null },
      ),
    ).toEqual([{ kind: "schedule-delete" }, { kind: "status", status: "private" }]);
    expect(buildPlan({ visibility: "scheduled", publishedAt: "2027-04-05T14:35" })).toEqual([
      { kind: "schedule-create", publishedAt: "2027-04-05T14:35:00+09:00" },
    ]);
    expect(
      buildPlan(
        { visibility: "scheduled", publishedAt: "2027-04-05T14:35" },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: null },
      ),
    ).toEqual([{ kind: "schedule-update", publishedAt: "2027-04-05T14:35:00+09:00" }]);
    expect(
      buildPlan(
        { visibility: "scheduled", publishedAt: "2026-10-01T09:00" },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: null },
      ),
    ).toEqual([]);
    expect(buildPlan({ notify: true, notificationTitle: "알람 내용" })).toEqual([
      { kind: "status", status: "public" },
      {
        kind: "notification-create",
        input: { title: "알람 내용", target_type: "all", scheduled_at: undefined },
      },
    ]);
    expect(
      buildPlan({
        visibility: "scheduled",
        publishedAt: "2027-04-05T14:35",
        notify: true,
        notificationTitle: "알람 내용",
      }),
    ).toEqual([
      { kind: "schedule-create", publishedAt: "2027-04-05T14:35:00+09:00" },
      {
        kind: "notification-create",
        input: {
          title: "알람 내용",
          target_type: "all",
          scheduled_at: "2027-04-05T14:35:00+09:00",
        },
      },
    ]);
    expect(
      buildPlan(
        { notify: true, notificationTitle: "바뀐 알람 내용", targetType: "follower" },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: PENDING_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([
      { kind: "status", status: "public" },
      {
        kind: "notification-update",
        id: PENDING_NOTIFICATION_FIXTURE.id,
        detail: { title: "바뀐 알람 내용", target_type: "follower" },
        schedule: undefined,
      },
    ]);
    expect(
      buildPlan(
        { notify: true, notificationTitle: "두 번째 알림", targetType: "follower" },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: PENDING_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([{ kind: "status", status: "public" }]);
    expect(
      buildPlan(
        { notify: false },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: PENDING_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([
      { kind: "status", status: "public" },
      { kind: "notification-delete", id: PENDING_NOTIFICATION_FIXTURE.id },
    ]);
  });

  it("비공개로 발행하면 발송을 골랐어도 기존 알림을 지운다", () => {
    expect(
      buildPlan(
        { visibility: "private", notify: true, notificationTitle: "알람 내용" },
        { content: DRAFT_CONTENT_FIXTURE, notification: PENDING_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([{ kind: "notification-delete", id: PENDING_NOTIFICATION_FIXTURE.id }]);
  });

  it("이미 발송된 알림에는 삭제도 수정도 보내지 않는다", () => {
    expect(
      buildPlan(
        { visibility: "private" },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: SENT_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([{ kind: "schedule-delete" }, { kind: "status", status: "private" }]);
    expect(
      buildPlan(
        {
          visibility: "scheduled",
          publishedAt: "2027-04-05T14:35",
          notify: true,
          notificationTitle: "바뀐 알람 내용",
          targetType: "follower",
        },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: SENT_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([{ kind: "schedule-update", publishedAt: "2027-04-05T14:35:00+09:00" }]);
  });

  it("콘텐츠 제목 사용을 체크하면 알람 내용 대신 콘텐츠 제목을 보낸다", () => {
    expect(buildPlan({ notify: true, useContentTitle: true, notificationTitle: "" })).toEqual([
      { kind: "status", status: "public" },
      {
        kind: "notification-create",
        input: { title: "콘텐츠 제목", target_type: "all", scheduled_at: undefined },
      },
    ]);
  });
});
