import {
  formatPublishedAt,
  getCategoryLabel,
  getPublishStatusBadge,
  parseContentListParams,
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

  it("30 R-05 URL의 `page`가 1 미만이거나 숫자가 아니면 1로, `category`·`publish_status`가 enum에 없으면 없는 것으로 읽는다", () => {
    expect(parseContentListParams(new URLSearchParams("page=0"))).toEqual({
      page: 1,
      limit: 10,
      category: undefined,
      publishStatus: undefined,
    });
    expect(parseContentListParams(new URLSearchParams("page=abc")).page).toBe(1);
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
