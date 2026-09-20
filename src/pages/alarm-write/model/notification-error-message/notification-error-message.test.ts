import { ApiError, type ApiErrorKind } from "@/shared/api";

import { getNotificationErrorMessage } from ".";

function createError(kind: ApiErrorKind): ApiError {
  return new ApiError({ kind, status: null, serverMessage: "error", cause: null });
}

describe("getNotificationErrorMessage", () => {
  it('`conflict`면 "이미 알림이 있는 콘텐츠입니다."를, 그 외 실패면 공통 문구를 보인다', () => {
    expect(getNotificationErrorMessage(createError("conflict"))).toBe(
      "이미 알림이 있는 콘텐츠입니다.",
    );
    expect(getNotificationErrorMessage(createError("validation"))).toBe("입력값을 확인해주세요.");
    expect(getNotificationErrorMessage(createError("network"))).toBe(
      "네트워크 연결을 확인해주세요.",
    );
  });
});
