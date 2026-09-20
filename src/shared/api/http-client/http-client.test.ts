import {
  type AxiosAdapter,
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

import { type ApiError, isApiError } from "../api-error";
import { type HttpClientAuth } from "../auth-interceptor";
import { createHttpClient } from "./http-client";

type FakeResponse = { status: number; data: unknown };
type FakeHandler = (
  config: InternalAxiosRequestConfig,
  callIndex: number,
) => FakeResponse | Promise<FakeResponse> | "network-error";

function createFakeAdapter(handler: FakeHandler) {
  const calls: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    calls.push(config);
    const result = await handler(config, calls.length - 1);
    if (result === "network-error") {
      throw new AxiosError("Network Error", "ERR_NETWORK", config);
    }
    const response = {
      status: result.status,
      statusText: "",
      headers: {},
      config,
      data: result.data,
    };
    if (result.status >= 400) {
      throw new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, undefined, response);
    }
    return response;
  };
  return { adapter, calls };
}

function createOkResponse(data: unknown): FakeResponse {
  return { status: 200, data: { success: true, data, error: "" } };
}

function createFailResponse(status: number, error = "실패"): FakeResponse {
  return { status, data: { success: false, data: null, error } };
}

function getCallAt(calls: InternalAxiosRequestConfig[], index: number): InternalAxiosRequestConfig {
  const call = calls[index];
  if (!call) {
    throw new Error(`${String(index)}번째 요청이 없습니다`);
  }
  return call;
}

function getAuthorization(config: InternalAxiosRequestConfig): string | undefined {
  const headers = AxiosHeaders.from(config.headers);
  const value = headers.get("Authorization");
  return typeof value === "string" ? value : undefined;
}

function toIsoAfter(nowMs: number, seconds: number): string {
  return new Date(nowMs + seconds * 1000).toISOString();
}

const NOW = Date.parse("2026-09-19T12:00:00Z");
const BASE_URL = "https://api.example.test";

function createAuth() {
  let current = { token: "token-a", expiresAt: toIsoAfter(NOW, 900) };
  const refreshMock = vi.fn<() => Promise<boolean>>(() => {
    current = { token: "new-token", expiresAt: toIsoAfter(NOW, 900) };
    return Promise.resolve(true);
  });
  const auth: HttpClientAuth = {
    getAccessToken: () => current,
    refreshAccessToken: refreshMock,
    onUnauthorized: vi.fn<() => void>(),
  };
  return { auth, refreshMock };
}

async function expectApiError(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (error) {
    if (isApiError(error)) {
      return error;
    }
    throw error;
  }
  throw new Error("ApiError가 발생해야 한다");
}

describe("createHttpClient: 기본 동작", () => {
  it("baseUrl을 axios baseURL로 설정한다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse({ id: 1 }));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, now: () => NOW });

    await client.get("/api/v1/users/me");

    expect(calls[0]?.baseURL).toBe(BASE_URL);
    expect(calls[0]?.url).toBe("/api/v1/users/me");
  });

  it("2xx이고 success가 true면 공통 응답 형식 안의 data만 돌려준다", async () => {
    const { adapter } = createFakeAdapter(() => createOkResponse({ id: 1, email: "a@b.c" }));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, now: () => NOW });

    const response = await client.get<{ id: number; email: string }>("/api/v1/users/me");

    expect(response.data).toEqual({ id: 1, email: "a@b.c" });
  });

  it("2xx이지만 success가 false면 unknown ApiError를 던지고 서버 문구를 담는다", async () => {
    const { adapter } = createFakeAdapter(() => ({
      status: 200,
      data: { success: false, data: null, error: "처리 실패" },
    }));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, now: () => NOW });

    const error = await expectApiError(client.get("/x"));

    expect(error.kind).toBe("unknown");
    expect(error.status).toBe(200);
    expect(error.serverMessage).toBe("처리 실패");
  });

  it("공통 응답 형식이 아닌 2xx 본문은 그대로 돌려준다", async () => {
    const { adapter } = createFakeAdapter(() => ({ status: 200, data: [1, 2, 3] }));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, now: () => NOW });

    const response = await client.get<number[]>("/x");

    expect(response.data).toEqual([1, 2, 3]);
  });

  it("4xx, 5xx는 상태 코드로 분류한 ApiError를 던진다", async () => {
    const { adapter } = createFakeAdapter(() => createFailResponse(409, "이미 알림이 있습니다"));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, now: () => NOW });

    const error = await expectApiError(client.post("/x", {}));

    expect(error.kind).toBe("conflict");
    expect(error.status).toBe(409);
    expect(error.serverMessage).toBe("이미 알림이 있습니다");
  });

  it("응답이 없는 실패는 network ApiError로 감싼다", async () => {
    const { adapter } = createFakeAdapter(() => "network-error");
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, now: () => NOW });

    const error = await expectApiError(client.get("/x"));

    expect(error.kind).toBe("network");
    expect(error.status).toBeNull();
  });

  it("auth 옵션이 없으면 헤더를 붙이지 않고 401을 unauthorized ApiError로 던진다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createFailResponse(401));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, now: () => NOW });

    const error = await expectApiError(client.get("/x"));

    expect(error.kind).toBe("unauthorized");
    expect(calls).toHaveLength(1);
    expect(getAuthorization(getCallAt(calls, 0))).toBeUndefined();
  });
});

describe("createHttpClient: 인터셉터 조립", () => {
  it("auth 옵션이 있으면 인증 인터셉터가 응답 인터셉터보다 먼저 401을 처리한다", async () => {
    const { auth, refreshMock } = createAuth();
    const { adapter, calls } = createFakeAdapter((_, i) =>
      i === 0 ? createFailResponse(401) : createOkResponse({ id: 7 }),
    );
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const response = await client.get<{ id: number }>("/x");

    expect(response.data).toEqual({ id: 7 });
    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
    expect(getAuthorization(getCallAt(calls, 1))).toBe("Bearer new-token");
  });
});
