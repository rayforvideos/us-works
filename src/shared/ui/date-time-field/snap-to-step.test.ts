import { snapToStep } from "./snap-to-step";

describe("snapToStep", () => {
  it("분을 가까운 step 단위로 맞춘다", () => {
    expect(snapToStep("2027-04-05T14:15", 1800)).toBe("2027-04-05T14:30");
    expect(snapToStep("2027-04-05T14:10", 1800)).toBe("2027-04-05T14:00");
    expect(snapToStep("2027-04-05T14:30", 1800)).toBe("2027-04-05T14:30");
  });

  it("하루 끝을 넘기지 않고 빈 값이나 형식이 다른 값은 그대로 둔다", () => {
    expect(snapToStep("2027-04-05T23:50", 1800)).toBe("2027-04-05T23:30");
    expect(snapToStep("", 1800)).toBe("");
    expect(snapToStep("not-a-date", 1800)).toBe("not-a-date");
  });
});
