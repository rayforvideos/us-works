import { QueryClient } from "@tanstack/react-query";

import { createQueryClient, DEFAULT_QUERY_OPTIONS } from "./query-client";

describe("createQueryClient", () => {
  it("QueryClient 인스턴스를 만든다", () => {
    expect(createQueryClient()).toBeInstanceOf(QueryClient);
  });

  it("호출마다 새 인스턴스를 만든다", () => {
    expect(createQueryClient()).not.toBe(createQueryClient());
  });

  it("기본 옵션으로 retry 1회, staleTime 30초, 포커스 시 재조회 없음을 적용한다", () => {
    const { queries } = createQueryClient().getDefaultOptions();

    expect(queries).toMatchObject(DEFAULT_QUERY_OPTIONS);
    expect(queries?.retry).toBe(1);
    expect(queries?.staleTime).toBe(30_000);
    expect(queries?.refetchOnWindowFocus).toBe(false);
  });

  it("전달한 옵션이 기본 옵션 위에 덮어써지고 나머지는 유지된다", () => {
    const { queries } = createQueryClient({ queries: { retry: false } }).getDefaultOptions();

    expect(queries?.retry).toBe(false);
    expect(queries?.staleTime).toBe(30_000);
    expect(queries?.refetchOnWindowFocus).toBe(false);
  });

  it("queries 외 옵션(mutations)도 전달된다", () => {
    const { mutations } = createQueryClient({ mutations: { retry: 2 } }).getDefaultOptions();

    expect(mutations?.retry).toBe(2);
  });
});
