import { ApiError, type ApiErrorKind } from "@/shared/api";

import { getErrorMessage } from ".";

function createError(kind: ApiErrorKind): ApiError {
  return new ApiError({ kind, status: null, serverMessage: "server side message", cause: null });
}

describe("getErrorMessage", () => {
  it("network면 연결 확인 문구를 돌려준다", () => {
    expect(getErrorMessage(createError("network"))).toBe("네트워크 연결을 확인해주세요.");
  });

  it("unauthorized면 로그인 안내 문구를 돌려준다", () => {
    expect(getErrorMessage(createError("unauthorized"))).toBe("로그인이 필요합니다.");
  });

  it("forbidden이면 권한 안내 문구를 돌려준다", () => {
    expect(getErrorMessage(createError("forbidden"))).toBe("권한이 없습니다.");
  });

  it("not_found면 대상을 찾지 못했다는 문구를 돌려준다", () => {
    expect(getErrorMessage(createError("not_found"))).toBe("요청한 내용을 찾을 수 없습니다.");
  });

  it("conflict면 이미 처리된 요청이라는 문구를 돌려준다", () => {
    expect(getErrorMessage(createError("conflict"))).toBe("이미 처리된 요청입니다.");
  });

  it("validation이면 입력값 확인 문구를 돌려준다", () => {
    expect(getErrorMessage(createError("validation"))).toBe("입력값을 확인해주세요.");
  });

  it("server면 재시도 안내 문구를 돌려준다", () => {
    expect(getErrorMessage(createError("server"))).toBe("잠시 후 다시 시도해주세요.");
  });

  it("canceled와 unknown이면 공통 문구를 돌려준다", () => {
    expect(getErrorMessage(createError("canceled"))).toBe(
      "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    );
    expect(getErrorMessage(createError("unknown"))).toBe(
      "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    );
  });

  it("ApiError가 아니면 공통 문구를 돌려준다", () => {
    expect(getErrorMessage(new Error("boom"))).toBe(
      "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    );
  });

  it("서버 문구는 화면 문구로 쓰지 않는다", () => {
    expect(getErrorMessage(createError("validation"))).not.toContain("server side message");
  });
});
