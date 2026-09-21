import {
  DRAFT_CONTENT_FIXTURE,
  PUBLISHED_CONTENT_FIXTURE,
  SCHEDULED_CONTENT_FIXTURE,
} from "@/entities/content";
import {
  FAILED_NOTIFICATION_FIXTURE,
  PENDING_NOTIFICATION_FIXTURE,
  SENT_NOTIFICATION_FIXTURE,
} from "@/entities/notification";

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
  it("R-08 요청 계획은 목표 상태와 현재 상태의 차이로만 만들어서, 공개면 `PATCH public`, 비공개면 예약이 있을 때 `DELETE schedule` 뒤 `PATCH private`·없을 때 `PATCH private`, 예약 발행이면 예약이 없을 때 `POST schedule`·시각이 바뀌었을 때 `PUT schedule`이고, 목표가 현재와 같으면 아무 요청도 만들지 않는다", () => {
    expect(buildPlan({ visibility: "public" })).toEqual([{ kind: "status", status: "public" }]);
    expect(
      buildPlan({ visibility: "public" }, { content: DRAFT_CONTENT_FIXTURE, notification: null }),
    ).toEqual([{ kind: "status", status: "public" }]);
    expect(
      buildPlan(
        { visibility: "public" },
        { content: PUBLISHED_CONTENT_FIXTURE, notification: null },
      ),
    ).toEqual([]);
    expect(buildPlan({ visibility: "private" })).toEqual([]);
    expect(
      buildPlan(
        { visibility: "private" },
        { content: PUBLISHED_CONTENT_FIXTURE, notification: null },
      ),
    ).toEqual([{ kind: "status", status: "private" }]);
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
  });

  it("R-09 알림은 발송이고 없으면 `POST`(예약이면 `scheduled_at` 포함), 발송이고 있으면 바뀐 부분만 `PUT`, 미발송이고 있으면 `DELETE`를 보낸다", () => {
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
        { notify: false },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: PENDING_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([
      { kind: "status", status: "public" },
      { kind: "notification-delete", id: PENDING_NOTIFICATION_FIXTURE.id },
    ]);
  });

  it("R-10 알림이 발송 대기 중이 아니면 어떤 요청도 보내지 않고, 공개로 바꿀 때는 기존 알림의 예약 시각을 그대로 둔다(알림 예약을 지우는 API가 없다)", () => {
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
    expect(
      buildPlan(
        { notify: true, notificationTitle: "두 번째 알림", targetType: "follower" },
        { content: SCHEDULED_CONTENT_FIXTURE, notification: PENDING_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([{ kind: "status", status: "public" }]);
  });

  it("발송에 실패한 알림도 고치지 않는다", () => {
    expect(
      buildPlan(
        { notify: false },
        { content: PUBLISHED_CONTENT_FIXTURE, notification: FAILED_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([]);
  });

  it("비공개로 발행하면 발송을 골랐어도 기존 알림을 지운다", () => {
    expect(
      buildPlan(
        { visibility: "private", notify: true, notificationTitle: "알람 내용" },
        { content: DRAFT_CONTENT_FIXTURE, notification: PENDING_NOTIFICATION_FIXTURE },
      ),
    ).toEqual([{ kind: "notification-delete", id: PENDING_NOTIFICATION_FIXTURE.id }]);
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
