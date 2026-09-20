import { ApiError, type ApiErrorKind } from "@/shared/api";

import { getAuthErrorMessage } from ".";

function createError(kind: ApiErrorKind): ApiError {
  return new ApiError({
    kind,
    status: null,
    serverMessage: "invalid email or password",
    cause: null,
  });
}

describe("로그인", () => {
  it('R-05 로그인 응답의 `kind`가 `unauthorized`면 "이메일 또는 비밀번호가 올바르지 않습니다."를 보인다', () => {
    expect(getAuthErrorMessage(createError("unauthorized"), "login")).toBe(
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    );
  });

  it('R-06 로그인 응답의 `kind`가 `network`면 "네트워크 연결을 확인해주세요."를, 그 외 실패면 "잠시 후 다시 시도해주세요."를 보인다', () => {
    expect(getAuthErrorMessage(createError("network"), "login")).toBe(
      "네트워크 연결을 확인해주세요.",
    );
    expect(getAuthErrorMessage(createError("server"), "login")).toBe("잠시 후 다시 시도해주세요.");
  });
});

describe("회원가입", () => {
  it('R-05 회원가입 응답의 `kind`가 `conflict`면 "이미 가입된 이메일입니다."를 보인다', () => {
    expect(getAuthErrorMessage(createError("conflict"), "register")).toBe(
      "이미 가입된 이메일입니다.",
    );
  });

  it('R-06 회원가입 응답의 `kind`가 `network`면 "네트워크 연결을 확인해주세요."를, 그 외 실패면 "잠시 후 다시 시도해주세요."를 보인다', () => {
    expect(getAuthErrorMessage(createError("network"), "register")).toBe(
      "네트워크 연결을 확인해주세요.",
    );
    expect(getAuthErrorMessage(createError("server"), "register")).toBe(
      "잠시 후 다시 시도해주세요.",
    );
  });
});
