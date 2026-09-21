import { getPageCount, parsePage, withPage } from ".";

describe("페이지 파라미터", () => {
  it("30 R-04 페이지 수는 `total`을 `limit`으로 나눠 올림한 값이며 최소 1이다", () => {
    expect(getPageCount(25, 10)).toBe(3);
    expect(getPageCount(20, 10)).toBe(2);
    expect(getPageCount(0, 10)).toBe(1);
  });

  it("limit이 0 이하면 페이지 수는 1이다", () => {
    expect(getPageCount(25, 0)).toBe(1);
    expect(getPageCount(25, -1)).toBe(1);
  });

  it("페이지 값이 1 미만이거나 숫자가 아니면 1로 읽는다", () => {
    expect(parsePage("0", 9999)).toBe(1);
    expect(parsePage("-3", 9999)).toBe(1);
    expect(parsePage("abc", 9999)).toBe(1);
    expect(parsePage("1.5", 9999)).toBe(1);
    expect(parsePage(null, 9999)).toBe(1);
  });

  it("페이지 값이 최대값을 넘으면 최대값으로 읽는다", () => {
    expect(parsePage("3", 9999)).toBe(3);
    expect(parsePage("10000", 9999)).toBe(9999);
  });
});

describe("withPage", () => {
  it("다른 파라미터는 두고 페이지만 바꾼 새 값을 돌려준다", () => {
    const current = new URLSearchParams("category=realty&page=2");

    const next = withPage(current, "page", 5);

    expect(next.get("page")).toBe("5");
    expect(next.get("category")).toBe("realty");
    expect(current.get("page")).toBe("2");
  });
});
