import { ROUTES } from ".";

describe("ROUTES", () => {
  it("콘텐츠 번호로 상세 경로를 만든다", () => {
    expect(ROUTES.contentDetail(12)).toBe("/contents/12");
  });

  it("콘텐츠 번호를 쿼리에 담은 알람 작성 경로를 만든다", () => {
    expect(ROUTES.alarmNewForContent(3)).toBe("/alarms/new?contentId=3");
  });

  it("알람 번호로 상세 경로를 만든다", () => {
    expect(ROUTES.alarmDetail(7)).toBe("/alarms/7");
  });
});
