import {
  DRAFT_CONTENT_FIXTURE,
  PUBLISHED_CONTENT_FIXTURE,
  SCHEDULED_CONTENT_FIXTURE,
} from "@/entities/content";

import { canNotifyContent } from ".";

describe("canNotifyContent", () => {
  it("R-09 콘텐츠의 `publish_status`가 `draft`면 알림을 만들 수 없다", () => {
    expect(canNotifyContent(DRAFT_CONTENT_FIXTURE)).toBe(false);
    expect(canNotifyContent(PUBLISHED_CONTENT_FIXTURE)).toBe(true);
    expect(canNotifyContent(SCHEDULED_CONTENT_FIXTURE)).toBe(true);
  });
});
