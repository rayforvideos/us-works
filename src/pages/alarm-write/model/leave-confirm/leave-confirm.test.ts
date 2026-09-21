import { isLeaveAllowed, LEAVE_ALLOWED_STATE } from ".";

describe("isLeaveAllowed", () => {
  it("이동에 실린 표시가 있을 때만 확인 없이 나가도 되는 이동으로 본다", () => {
    expect(isLeaveAllowed(LEAVE_ALLOWED_STATE)).toBe(true);
    expect(isLeaveAllowed(null)).toBe(false);
    expect(isLeaveAllowed(undefined)).toBe(false);
    expect(isLeaveAllowed({ leaveAllowed: false })).toBe(false);
    expect(isLeaveAllowed({ from: "/alarms" })).toBe(false);
  });
});
