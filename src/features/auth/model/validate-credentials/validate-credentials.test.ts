import { validateCredentials } from ".";

describe("validateCredentials", () => {
  it('R-01 이메일이 비어 있으면 "이메일을 입력해주세요." 오류다', () => {
    expect(validateCredentials({ email: "", password: "secret1" }).email).toBe(
      "이메일을 입력해주세요.",
    );
  });

  it('R-02 이메일이 형식에 맞지 않으면 "이메일 형식이 올바르지 않습니다." 오류다', () => {
    expect(validateCredentials({ email: "user@example", password: "secret1" }).email).toBe(
      "이메일 형식이 올바르지 않습니다.",
    );
  });

  it('R-03 비밀번호가 비어 있으면 "비밀번호를 입력해주세요." 오류다', () => {
    expect(validateCredentials({ email: "user@example.com", password: "" }).password).toBe(
      "비밀번호를 입력해주세요.",
    );
  });

  it('R-04 비밀번호가 6자 미만이면 "비밀번호는 6자 이상이어야 합니다." 오류다', () => {
    expect(validateCredentials({ email: "user@example.com", password: "12345" }).password).toBe(
      "비밀번호는 6자 이상이어야 합니다.",
    );
  });

  it("모든 제약을 만족하면 오류가 없다", () => {
    expect(validateCredentials({ email: "user@example.com", password: "123456" })).toEqual({});
  });
});
