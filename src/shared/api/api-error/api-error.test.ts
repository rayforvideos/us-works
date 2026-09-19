import { AxiosError, AxiosHeaders, CanceledError, type InternalAxiosRequestConfig } from "axios";

import { ApiError, getErrorKind, isApiError, toApiError } from "./api-error";

const config = { headers: new AxiosHeaders() } as InternalAxiosRequestConfig;

function createAxiosErrorWithResponse(status: number, data: unknown) {
  return new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, undefined, {
    status,
    statusText: "",
    headers: {},
    config,
    data,
  });
}

describe("getErrorKind", () => {
  it.each([
    [400, "validation"],
    [401, "unauthorized"],
    [403, "forbidden"],
    [404, "not_found"],
    [409, "conflict"],
    [500, "server"],
    [503, "server"],
    [418, "unknown"],
    [200, "unknown"],
  ] as const)("상태 코드 %i는 %s로 분류한다", (status, kind) => {
    expect(getErrorKind(status)).toBe(kind);
  });
});

describe("toApiError", () => {
  it("응답이 있는 axios 오류는 상태 코드로 kind를 정하고 서버 문구를 담는다", () => {
    const error = toApiError(
      createAxiosErrorWithResponse(409, {
        success: false,
        data: null,
        error: "이미 알림이 있습니다",
      }),
    );

    expect(error.kind).toBe("conflict");
    expect(error.status).toBe(409);
    expect(error.serverMessage).toBe("이미 알림이 있습니다");
  });

  it("응답이 없는 axios 오류는 network로 분류하고 status와 서버 문구는 null이다", () => {
    const error = toApiError(new AxiosError("Network Error", "ERR_NETWORK", config));

    expect(error.kind).toBe("network");
    expect(error.status).toBeNull();
    expect(error.serverMessage).toBeNull();
  });

  it("취소된 요청은 canceled로 분류한다", () => {
    const error = toApiError(new CanceledError("canceled", config));

    expect(error.kind).toBe("canceled");
    expect(error.status).toBeNull();
  });

  it("공통 응답 형식이 아닌 본문이면 서버 문구는 null이다", () => {
    const error = toApiError(createAxiosErrorWithResponse(500, "<html>Bad Gateway</html>"));

    expect(error.kind).toBe("server");
    expect(error.status).toBe(500);
    expect(error.serverMessage).toBeNull();
  });

  it("2xx이지만 success가 false인 응답은 unknown으로 분류하고 서버 문구를 담는다", () => {
    const error = toApiError(
      createAxiosErrorWithResponse(200, { success: false, data: null, error: "처리 실패" }),
    );

    expect(error.kind).toBe("unknown");
    expect(error.status).toBe(200);
    expect(error.serverMessage).toBe("처리 실패");
  });

  it("axios 오류가 아닌 값은 unknown으로 감싸고 원본을 cause에 보존한다", () => {
    const original = new TypeError("boom");
    const error = toApiError(original);

    expect(error.kind).toBe("unknown");
    expect(error.status).toBeNull();
    expect(error.cause).toBe(original);
  });

  it("이미 ApiError면 같은 인스턴스를 그대로 돌려준다", () => {
    const original = new ApiError({
      kind: "server",
      status: 500,
      serverMessage: null,
      cause: null,
    });

    expect(toApiError(original)).toBe(original);
  });

  it("ApiError는 Error를 상속하고 name과 개발자용 message를 가진다", () => {
    const error = toApiError(createAxiosErrorWithResponse(404, { success: false, error: "없음" }));

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
    expect(error.message).toContain("not_found");
    expect(error.message).toContain("404");
  });
});

describe("isApiError", () => {
  it("ApiError 인스턴스만 true다", () => {
    expect(
      isApiError(new ApiError({ kind: "unknown", status: null, serverMessage: null, cause: null })),
    ).toBe(true);
    expect(isApiError(new Error("x"))).toBe(false);
    expect(isApiError(null)).toBe(false);
  });
});
