import { getPageWindow } from "./page-window";

describe("getPageWindow", () => {
  it("페이지 수가 5 이하면 있는 페이지를 모두 돌려준다", () => {
    expect(getPageWindow(3, 3)).toEqual([1, 2, 3]);
    expect(getPageWindow(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("페이지 수가 0이어도 최소 한 페이지로 보고 [1]을 돌려준다", () => {
    expect(getPageWindow(1, 0)).toEqual([1]);
  });

  it("현재 페이지를 가운데 두고 5개를 돌려준다", () => {
    expect(getPageWindow(7, 10)).toEqual([5, 6, 7, 8, 9]);
  });

  it("앞쪽 페이지에서는 첫 페이지부터 5개를 돌려준다", () => {
    expect(getPageWindow(1, 10)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageWindow(2, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it("뒤쪽 페이지에서는 마지막 페이지까지 5개를 돌려준다", () => {
    expect(getPageWindow(10, 10)).toEqual([6, 7, 8, 9, 10]);
    expect(getPageWindow(9, 10)).toEqual([6, 7, 8, 9, 10]);
  });

  it("페이지 수를 넘는 현재 페이지는 마지막 구간으로 맞춘다", () => {
    expect(getPageWindow(20, 10)).toEqual([6, 7, 8, 9, 10]);
    expect(getPageWindow(0, 10)).toEqual([1, 2, 3, 4, 5]);
  });
});
