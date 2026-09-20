import { QueryClient } from "@tanstack/react-query";
import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { atom } from "jotai";

import { SESSION_STORAGE_KEY } from "@/entities/session";
import { createFakeAdapter, createOkResponse, PERSISTED_SESSION_FIXTURE } from "@/shared/config";

import { initializeSystem } from "./initialize-system";

function createSessionAdapter() {
  return createFakeAdapter((config) =>
    config.url === "/api/v1/auth/refresh"
      ? createOkResponse({
          access_token: "new-token",
          access_expires_at: new Date(Date.now() + 900_000).toISOString(),
        })
      : createOkResponse({ items: [] }),
  );
}

function getAuthorization(config: InternalAxiosRequestConfig | undefined): string | null {
  if (!config) {
    throw new Error("요청이 없습니다");
  }
  const value = AxiosHeaders.from(config.headers).get("Authorization");
  return typeof value === "string" ? value : null;
}

describe("initializeSystem", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Jotai 스토어, QueryClient, HTTP 클라이언트를 반환한다", () => {
    const system = initializeSystem();

    expect(system.queryClient).toBeInstanceOf(QueryClient);
    expect(typeof system.httpClient.request).toBe("function");
    expect(typeof system.store.get).toBe("function");
    expect(typeof system.store.set).toBe("function");
    expect(typeof system.store.sub).toBe("function");
  });

  it("호출마다 격리된 인스턴스를 만든다", () => {
    const first = initializeSystem();
    const second = initializeSystem();
    const countAtom = atom(0);

    first.store.set(countAtom, 1);

    expect(first.store).not.toBe(second.store);
    expect(first.queryClient).not.toBe(second.queryClient);
    expect(second.store.get(countAtom)).toBe(0);
  });

  it("QueryClient는 공용 팩토리의 기본 옵션을 가진다", () => {
    const { queries } = initializeSystem().queryClient.getDefaultOptions();

    expect(typeof queries?.retry).toBe("function");
    expect(queries?.staleTime).toBe(30_000);
  });

  it("HTTP 클라이언트의 기본 URL은 환경 변수에서 읽고, 옵션으로 덮어쓸 수 있다", () => {
    expect(initializeSystem().httpClient.defaults.baseURL).toBe("http://api.test");
    expect(initializeSystem({ apiBaseUrl: "http://other.test" }).httpClient.defaults.baseURL).toBe(
      "http://other.test",
    );
  });

  it("전달한 QueryClient 옵션이 반영된다", () => {
    const { queries } = initializeSystem({
      queryClient: { queries: { retry: false } },
    }).queryClient.getDefaultOptions();

    expect(queries?.retry).toBe(false);
  });
});

describe("저장된 세션 복구", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("저장된 세션이 있으면 첫 인증 요청 전에 토큰을 갱신하고 새 토큰으로 보낸다", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(PERSISTED_SESSION_FIXTURE));
    const { adapter, calls } = createSessionAdapter();
    const system = initializeSystem({ adapter });

    await system.httpClient.get("/api/v1/contents");

    expect(calls.map((call) => call.url)).toEqual(["/api/v1/auth/refresh", "/api/v1/contents"]);
    expect(getAuthorization(calls[1])).toBe("Bearer new-token");
  });

  it("저장된 세션이 없으면 갱신 없이 토큰 없는 요청을 보낸다", async () => {
    const { adapter, calls } = createSessionAdapter();
    const system = initializeSystem({ adapter });

    await system.httpClient.get("/api/v1/contents");

    expect(calls.map((call) => call.url)).toEqual(["/api/v1/contents"]);
    expect(getAuthorization(calls[0])).toBeNull();
  });
});
