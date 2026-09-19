import { QueryClient } from "@tanstack/react-query";

import { ApiError, type ApiErrorKind } from "../api-error";
import { QUERY_STALE_TIME_MS, RETRYABLE_ERROR_KINDS } from "./constants";
import { createQueryClient, shouldRetry } from "./query-client";

function createApiError(kind: ApiErrorKind) {
  return new ApiError({ kind, status: null, serverMessage: null, cause: null });
}

describe("createQueryClient", () => {
  it("QueryClient 인스턴스를 만든다", () => {
    expect(createQueryClient()).toBeInstanceOf(QueryClient);
  });

  it("호출마다 새 인스턴스를 만든다", () => {
    expect(createQueryClient()).not.toBe(createQueryClient());
  });

  it("기본 옵션으로 kind 기반 retry, staleTime 30초, 포커스 시 재조회 없음을 적용한다", () => {
    const { queries } = createQueryClient().getDefaultOptions();

    expect(queries?.retry).toBe(shouldRetry);
    expect(queries?.staleTime).toBe(QUERY_STALE_TIME_MS);
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

describe("shouldRetry", () => {
  it.each(RETRYABLE_ERROR_KINDS)("%s 오류는 첫 실패 뒤 한 번만 재시도한다", (kind) => {
    expect(shouldRetry(0, createApiError(kind))).toBe(true);
    expect(shouldRetry(1, createApiError(kind))).toBe(false);
  });

  it.each([
    "validation",
    "conflict",
    "not_found",
    "forbidden",
    "unauthorized",
    "canceled",
    "unknown",
  ] as const)("%s 오류는 재시도하지 않는다", (kind) => {
    expect(shouldRetry(0, createApiError(kind))).toBe(false);
  });

  it("ApiError가 아닌 오류는 재시도하지 않는다", () => {
    expect(shouldRetry(0, new Error("boom"))).toBe(false);
  });
});
