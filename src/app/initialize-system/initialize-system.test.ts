import { QueryClient } from "@tanstack/react-query";
import { atom } from "jotai";

import { initializeSystem } from "./initialize-system";

describe("initializeSystem", () => {
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
