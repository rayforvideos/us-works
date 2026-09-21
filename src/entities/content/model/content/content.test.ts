import {
  canNotifyContent,
  DRAFT_CONTENT_FIXTURE,
  formatPublishedAt,
  getCategoryLabel,
  getPublishStatusBadge,
  hasNotification,
  parseContentListParams,
  PUBLISHED_CONTENT_FIXTURE,
  SCHEDULED_CONTENT_FIXTURE,
  withContentListFilters,
} from ".";

describe("콘텐츠 모델", () => {
  it("30 R-01 카테고리 값은 정해진 한글 라벨로 바꾸고, 목록에 없는 값이면 값 그대로 보인다", () => {
    expect(getCategoryLabel("secondaryBattery")).toBe("2차전지");
    expect(getCategoryLabel("personalFinance")).toBe("재테크");
    expect(getCategoryLabel("unknownCategory")).toBe("unknownCategory");
  });

  it('30 R-02 발행 상태 `published`는 "공개"와 green, `scheduled`는 "예약"과 yellow, `draft`는 "비공개"와 grey 배지다', () => {
    expect(getPublishStatusBadge("published")).toEqual({ label: "공개", tone: "green" });
    expect(getPublishStatusBadge("scheduled")).toEqual({ label: "예약", tone: "yellow" });
    expect(getPublishStatusBadge("draft")).toEqual({ label: "비공개", tone: "grey" });
  });

  it('30 R-03 공개일자는 `yy.MM.dd`와 `HH:mm` 두 줄로 표시하고, 값이 없으면 "-"다', () => {
    expect(formatPublishedAt("2026-09-20T10:30:00+09:00")).toEqual({
      date: "26.09.20",
      time: "10:30",
    });
    expect(formatPublishedAt("2026-01-05T00:05:00+09:00")).toEqual({
      date: "26.01.05",
      time: "00:05",
    });
    expect(formatPublishedAt(undefined)).toBeNull();
  });

  it("공개일자가 날짜로 읽히지 않으면 null이다", () => {
    expect(formatPublishedAt("not-a-date")).toBeNull();
    expect(formatPublishedAt("")).toBeNull();
  });

  it("30 R-05 URL의 `page`가 1 미만이거나 숫자가 아니면 1로, 9999를 넘으면 9999로, `category`·`publish_status`가 enum에 없으면 없는 것으로 읽는다", () => {
    expect(parseContentListParams(new URLSearchParams("page=0"))).toEqual({
      page: 1,
      limit: 10,
      category: undefined,
      publishStatus: undefined,
    });
    expect(parseContentListParams(new URLSearchParams("page=abc")).page).toBe(1);
    expect(parseContentListParams(new URLSearchParams("page=10000")).page).toBe(9999);
    expect(parseContentListParams(new URLSearchParams("category=없는값")).category).toBeUndefined();
    expect(
      parseContentListParams(new URLSearchParams("publish_status=없는값")).publishStatus,
    ).toBeUndefined();
    expect(parseContentListParams(new URLSearchParams("page=3&category=realty"))).toEqual({
      page: 3,
      limit: 10,
      category: "realty",
      publishStatus: undefined,
    });
    expect(
      parseContentListParams(new URLSearchParams("publish_status=published")).publishStatus,
    ).toBe("published");
  });
});

describe("알림 관련 규칙", () => {
  it("39 R-08 콘텐츠의 `publish_status`가 `draft`면 알림을 만들 수 없다", () => {
    expect(canNotifyContent(DRAFT_CONTENT_FIXTURE)).toBe(false);
    expect(canNotifyContent(PUBLISHED_CONTENT_FIXTURE)).toBe(true);
    expect(canNotifyContent(SCHEDULED_CONTENT_FIXTURE)).toBe(true);
  });

  it("알림 상태가 있고 `has_notification`이 참일 때만 알림이 있는 콘텐츠로 본다", () => {
    expect(hasNotification(SCHEDULED_CONTENT_FIXTURE)).toBe(true);
    expect(hasNotification(PUBLISHED_CONTENT_FIXTURE)).toBe(false);
    expect(hasNotification({ ...PUBLISHED_CONTENT_FIXTURE, notification_status: undefined })).toBe(
      false,
    );
  });
});

describe("withContentListFilters", () => {
  it("필터를 반영하면서 페이지는 버린다", () => {
    const current = new URLSearchParams("page=3&category=realty");

    const next = withContentListFilters(current, {
      category: "investment",
      publishStatus: "draft",
    });

    expect(next.get("category")).toBe("investment");
    expect(next.get("publish_status")).toBe("draft");
    expect(next.get("page")).toBeNull();
  });

  it("값이 없는 필터는 지운다", () => {
    const current = new URLSearchParams("category=realty&publish_status=draft");

    const next = withContentListFilters(current, {});

    expect(next.get("category")).toBeNull();
    expect(next.get("publish_status")).toBeNull();
  });
});
