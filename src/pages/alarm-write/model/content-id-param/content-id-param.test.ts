import { parseContentId } from ".";

describe("parseContentId", () => {
  it("R-07 `?contentId=`가 없거나 양의 정수가 아니면 작성 화면에 들어갈 수 없다", () => {
    expect(parseContentId(new URLSearchParams("contentId=147"))).toBe(147);
    expect(parseContentId(new URLSearchParams(""))).toBeNull();
    expect(parseContentId(new URLSearchParams("contentId="))).toBeNull();
    expect(parseContentId(new URLSearchParams("contentId=abc"))).toBeNull();
    expect(parseContentId(new URLSearchParams("contentId=0"))).toBeNull();
    expect(parseContentId(new URLSearchParams("contentId=-3"))).toBeNull();
    expect(parseContentId(new URLSearchParams("contentId=1.5"))).toBeNull();
  });
});
