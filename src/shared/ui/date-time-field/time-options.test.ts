import { buildTimeOptions } from "./time-options";

describe("buildTimeOptions", () => {
  it("R-06 시간 목록은 00:00부터 23:30까지 30분 간격이고, 수정 화면의 기존 값이 30분 단위가 아니면 그 값을 목록 맨 앞에 더한다", () => {
    const options = buildTimeOptions("");

    expect(options).toHaveLength(48);
    expect(options[0]).toBe("00:00");
    expect(options[1]).toBe("00:30");
    expect(options.at(-1)).toBe("23:30");
    expect(buildTimeOptions("14:15")).toHaveLength(49);
    expect(buildTimeOptions("14:15")[0]).toBe("14:15");
    expect(buildTimeOptions("14:30")).toHaveLength(48);
  });
});
