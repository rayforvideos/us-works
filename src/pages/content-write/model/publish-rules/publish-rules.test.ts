import {
  DRAFT_CONTENT_FIXTURE,
  PUBLISHED_CONTENT_FIXTURE,
  SCHEDULED_CONTENT_FIXTURE,
} from "@/entities/content";

import { applyUseContentTitle, canSchedule, toPublishVisibility } from ".";

describe("applyUseContentTitle", () => {
  it("R-05 콘텐츠 제목 사용을 체크하면 알람 내용이 콘텐츠 제목이 되고, 해제하면 빈 값이 된다", () => {
    expect(applyUseContentTitle({ useContentTitle: true, contentTitle: "콘텐츠 제목" })).toBe(
      "콘텐츠 제목",
    );
    expect(applyUseContentTitle({ useContentTitle: false, contentTitle: "콘텐츠 제목" })).toBe("");
  });

  it("해제 상태에서 대신 쓸 값을 주면 그 값을 돌려준다", () => {
    expect(
      applyUseContentTitle({
        useContentTitle: false,
        contentTitle: "콘텐츠 제목",
        fallback: "직접 쓴 알람 내용",
      }),
    ).toBe("직접 쓴 알람 내용");
    expect(
      applyUseContentTitle({
        useContentTitle: true,
        contentTitle: "콘텐츠 제목",
        fallback: "직접 쓴 알람 내용",
      }),
    ).toBe("콘텐츠 제목");
  });
});

describe("canSchedule", () => {
  it("R-06 `publish_status`가 `scheduled`가 아니면서 `published_at`이 있는 콘텐츠(한 번 공개된 콘텐츠)는 예약 발행을 고를 수 없다", () => {
    expect(canSchedule(PUBLISHED_CONTENT_FIXTURE)).toBe(false);
    expect(canSchedule(SCHEDULED_CONTENT_FIXTURE)).toBe(true);
    expect(canSchedule(DRAFT_CONTENT_FIXTURE)).toBe(true);
    expect(canSchedule(null)).toBe(true);
  });
});

describe("toPublishVisibility", () => {
  it("예약된 콘텐츠는 예약 발행으로, `status`가 `public`이면 공개로, 그 외는 비공개로 읽는다", () => {
    expect(toPublishVisibility(SCHEDULED_CONTENT_FIXTURE)).toBe("scheduled");
    expect(toPublishVisibility(PUBLISHED_CONTENT_FIXTURE)).toBe("public");
    expect(toPublishVisibility(DRAFT_CONTENT_FIXTURE)).toBe("private");
  });
});
