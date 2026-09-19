import {
  type AxiosAdapter,
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

import { type ApiError, isApiError } from "../api-error";
import { createHttpClient } from "./http-client";
import { type HttpClientAuth } from "./types";

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

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function toIsoAfter(nowMs: number, seconds: number): string {
  return new Date(nowMs + seconds * 1000).toISOString();
}

const NOW = Date.parse("2026-09-19T12:00:00Z");
const BASE_URL = "https://api.example.test";

function createAuth(initialToken: string, expiresInSeconds: number) {
  let current: { token: string; expiresAt: string } | null = {
    token: initialToken,
    expiresAt: toIsoAfter(NOW, expiresInSeconds),
  };
  const refreshMock = vi.fn<() => Promise<boolean>>(() => {
    current = { token: "new-token", expiresAt: toIsoAfter(NOW, 900) };
    return Promise.resolve(true);
  });
  const onUnauthorizedMock = vi.fn<() => void>();
  const auth: HttpClientAuth = {
    getAccessToken: () => current,
    refreshAccessToken: refreshMock,
    onUnauthorized: onUnauthorizedMock,
  };
  return {
    auth,
    refreshMock,
    onUnauthorizedMock,
    setToken: (next: typeof current) => {
      current = next;
    },
  };
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

describe("createHttpClient: 인증 헤더와 만료 확인", () => {
  it("토큰이 있으면 Authorization Bearer 헤더를 붙인다", async () => {
    const { auth, refreshMock } = createAuth("token-a", 900);
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(null));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    await client.get("/x");

    expect(getAuthorization(getCallAt(calls, 0))).toBe("Bearer token-a");
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("토큰이 60초 안에 만료되면 요청 전에 갱신하고 새 토큰으로 보낸다", async () => {
    const { auth, refreshMock } = createAuth("old-token", 30);
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(null));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    await client.get("/x");

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(1);
    expect(getAuthorization(getCallAt(calls, 0))).toBe("Bearer new-token");
  });

  it("이미 만료된 토큰도 요청 전에 갱신한다", async () => {
    const { auth, refreshMock } = createAuth("old-token", -10);
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(null));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    await client.get("/x");

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(getAuthorization(getCallAt(calls, 0))).toBe("Bearer new-token");
  });

  it("만료가 60초 넘게 남았으면 갱신하지 않는다", async () => {
    const { auth, refreshMock } = createAuth("token-a", 61);
    const { adapter } = createFakeAdapter(() => createOkResponse(null));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    await client.get("/x");

    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("만료 확인은 요청당 한 번만 하고, 갱신 뒤에도 만료로 보이면 그대로 보낸다", async () => {
    const { auth, refreshMock, setToken } = createAuth("old-token", -10);
    refreshMock.mockImplementation(() => {
      setToken({ token: "still-old", expiresAt: toIsoAfter(NOW, -5) });
      return Promise.resolve(true);
    });
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(null));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    await client.get("/x");

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(1);
    expect(getAuthorization(getCallAt(calls, 0))).toBe("Bearer still-old");
  });

  it("skipAuth 요청은 헤더를 붙이지 않고 만료 확인도 하지 않는다", async () => {
    const { auth, refreshMock } = createAuth("old-token", -10);
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(null));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    await client.post("/api/v1/auth/login", {}, { skipAuth: true });

    expect(refreshMock).not.toHaveBeenCalled();
    expect(getAuthorization(getCallAt(calls, 0))).toBeUndefined();
  });
});

describe("createHttpClient: 401 처리", () => {
  it("401을 받으면 갱신 후 새 토큰으로 한 번 재시도한다", async () => {
    const { auth, refreshMock, onUnauthorizedMock } = createAuth("token-a", 900);
    const { adapter, calls } = createFakeAdapter((_, i) =>
      i === 0 ? createFailResponse(401) : createOkResponse({ id: 7 }),
    );
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const response = await client.get<{ id: number }>("/x");

    expect(response.data).toEqual({ id: 7 });
    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
    expect(getAuthorization(getCallAt(calls, 0))).toBe("Bearer token-a");
    expect(getAuthorization(getCallAt(calls, 1))).toBe("Bearer new-token");
    expect(onUnauthorizedMock).not.toHaveBeenCalled();
  });

  it("갱신이 false를 돌려주면 onUnauthorized를 한 번 호출하고 unauthorized ApiError를 던진다", async () => {
    const { auth, refreshMock, onUnauthorizedMock } = createAuth("token-a", 900);
    refreshMock.mockResolvedValue(false);
    const { adapter, calls } = createFakeAdapter(() => createFailResponse(401));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const error = await expectApiError(client.get("/x"));

    expect(error.kind).toBe("unauthorized");
    expect(onUnauthorizedMock).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(1);
  });

  it("갱신이 예외를 던져도 onUnauthorized를 한 번 호출하고 unauthorized ApiError를 던진다", async () => {
    const { auth, refreshMock, onUnauthorizedMock } = createAuth("token-a", 900);
    refreshMock.mockRejectedValue(new Error("refresh down"));
    const { adapter } = createFakeAdapter(() => createFailResponse(401));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const error = await expectApiError(client.get("/x"));

    expect(error.kind).toBe("unauthorized");
    expect(onUnauthorizedMock).toHaveBeenCalledTimes(1);
  });

  it("갱신 후 재시도도 401이면 onUnauthorized를 한 번 호출하고 더 재시도하지 않는다", async () => {
    const { auth, refreshMock, onUnauthorizedMock } = createAuth("token-a", 900);
    const { adapter, calls } = createFakeAdapter(() => createFailResponse(401));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const error = await expectApiError(client.get("/x"));

    expect(error.kind).toBe("unauthorized");
    expect(calls).toHaveLength(2);
    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(onUnauthorizedMock).toHaveBeenCalledTimes(1);
  });

  it("skipAuth 요청의 401은 갱신 없이 unauthorized ApiError로 던진다", async () => {
    const { auth, refreshMock, onUnauthorizedMock } = createAuth("token-a", 900);
    const { adapter, calls } = createFakeAdapter(() => createFailResponse(401));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const error = await expectApiError(client.post("/api/v1/auth/login", {}, { skipAuth: true }));

    expect(error.kind).toBe("unauthorized");
    expect(refreshMock).not.toHaveBeenCalled();
    expect(onUnauthorizedMock).not.toHaveBeenCalled();
    expect(calls).toHaveLength(1);
  });
});

describe("createHttpClient: 동시 요청 처리", () => {
  it("동시에 여러 요청이 401을 받으면 갱신은 1회, 재시도는 각 1회이고 모두 성공한다", async () => {
    const { auth, refreshMock, setToken } = createAuth("token-a", 900);
    const refresh = createDeferred<boolean>();
    refreshMock.mockImplementation(() => refresh.promise);
    const { adapter, calls } = createFakeAdapter((config) =>
      getAuthorization(config) === "Bearer new-token"
        ? createOkResponse(config.url)
        : createFailResponse(401),
    );
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const pending = Promise.all([
      client.get<string>("/a"),
      client.get<string>("/b"),
      client.get<string>("/c"),
    ]);
    await vi.waitFor(() => {
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
    setToken({ token: "new-token", expiresAt: toIsoAfter(NOW, 900) });
    refresh.resolve(true);
    const responses = await pending;

    expect(responses.map((r) => r.data)).toEqual(["/a", "/b", "/c"]);
    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(6);
    expect(calls.slice(3).map(getAuthorization)).toEqual(Array(3).fill("Bearer new-token"));
  });

  it("동시 요청 중 갱신이 실패하면 모두 unauthorized로 실패하고 onUnauthorized는 1회다", async () => {
    const { auth, refreshMock, onUnauthorizedMock } = createAuth("token-a", 900);
    const refresh = createDeferred<boolean>();
    refreshMock.mockImplementation(() => refresh.promise);
    const { adapter, calls } = createFakeAdapter(() => createFailResponse(401));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const results = Promise.allSettled([client.get("/a"), client.get("/b"), client.get("/c")]);
    await vi.waitFor(() => {
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
    refresh.resolve(false);
    const settled = await results;

    expect(settled.every((r) => r.status === "rejected")).toBe(true);
    for (const r of settled) {
      expect(r.status === "rejected" && isApiError(r.reason) && r.reason.kind).toBe("unauthorized");
    }
    expect(onUnauthorizedMock).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(3);
  });

  it("갱신이 진행 중일 때 시작된 새 요청은 갱신 완료를 기다린 뒤 새 토큰으로 1회만 보낸다", async () => {
    const { auth, refreshMock, setToken } = createAuth("old-token", -10);
    const refresh = createDeferred<boolean>();
    refreshMock.mockImplementation(() => refresh.promise);
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(null));
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const first = client.get("/first");
    await vi.waitFor(() => {
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
    const second = client.get("/second");
    await Promise.resolve();
    expect(calls).toHaveLength(0);

    setToken({ token: "new-token", expiresAt: toIsoAfter(NOW, 900) });
    refresh.resolve(true);
    await Promise.all([first, second]);

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
    expect(calls.map(getAuthorization)).toEqual(["Bearer new-token", "Bearer new-token"]);
  });

  it("만료 확인에서 시작된 갱신과 401에서 시작된 갱신은 같은 Promise를 공유한다", async () => {
    const { auth, refreshMock, setToken } = createAuth("token-a", 900);
    const refresh = createDeferred<boolean>();
    refreshMock.mockImplementation(() => refresh.promise);
    const { adapter, calls } = createFakeAdapter((config) =>
      getAuthorization(config) === "Bearer new-token"
        ? createOkResponse(null)
        : createFailResponse(401),
    );
    const client = createHttpClient({ baseUrl: BASE_URL, adapter, auth, now: () => NOW });

    const fromResponse = client.get("/a");
    await vi.waitFor(() => {
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
    setToken({ token: "token-a", expiresAt: toIsoAfter(NOW, 10) });
    const fromExpiry = client.get("/b");
    await Promise.resolve();
    setToken({ token: "new-token", expiresAt: toIsoAfter(NOW, 900) });
    refresh.resolve(true);
    await Promise.all([fromResponse, fromExpiry]);

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(3);
  });
});
