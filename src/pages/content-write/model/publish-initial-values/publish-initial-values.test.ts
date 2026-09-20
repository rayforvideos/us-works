import {
  DRAFT_CONTENT_FIXTURE,
  PUBLISHED_CONTENT_FIXTURE,
  SCHEDULED_CONTENT_FIXTURE,
} from "@/entities/content";
import { PENDING_NOTIFICATION_FIXTURE } from "@/entities/notification";

import { toPublishOptionsValues } from ".";

describe("toPublishOptionsValues", () => {
  it("R-07 초기값은 콘텐츠 상태에서 정한다: `publish_status`가 `scheduled`면 예약 발행과 그 시각, `status`가 `public`이면 공개, 그 외는 비공개. 알림이 있으면 발송과 그 대상자·제목, 없으면 미발송", () => {
    expect(
      toPublishOptionsValues({ content: PUBLISHED_CONTENT_FIXTURE, notification: null }),
    ).toEqual({
      visibility: "public",
      publishedAt: "",
      notify: false,
      targetType: "all",
      useContentTitle: false,
      notificationTitle: "",
    });
    expect(
      toPublishOptionsValues({
        content: SCHEDULED_CONTENT_FIXTURE,
        notification: PENDING_NOTIFICATION_FIXTURE,
      }),
    ).toEqual({
      visibility: "scheduled",
      publishedAt: "2026-10-01T09:00",
      notify: true,
      targetType: "follower",
      useContentTitle: false,
      notificationTitle: "두 번째 알림",
    });
    expect(
      toPublishOptionsValues({ content: DRAFT_CONTENT_FIXTURE, notification: null }).visibility,
    ).toBe("private");
  });

  it("작성 화면은 공개·발송·전체·콘텐츠 제목 사용 해제를 기본값으로 쓴다", () => {
    expect(toPublishOptionsValues({ content: null, notification: null })).toEqual({
      visibility: "public",
      publishedAt: "",
      notify: true,
      targetType: "all",
      useContentTitle: false,
      notificationTitle: "",
    });
  });
});
