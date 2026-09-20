import { type DefaultOptions, QueryClient } from "@tanstack/react-query";

import { isApiError } from "../api-error";
import { QUERY_MAX_RETRY_COUNT, QUERY_STALE_TIME_MS, RETRYABLE_ERROR_KINDS } from "./constants";

/**
 * @constants
 */
const DEFAULT_QUERY_OPTIONS = {
  retry: shouldRetry,
  staleTime: QUERY_STALE_TIME_MS,
  refetchOnWindowFocus: false,
} as const satisfies DefaultOptions["queries"];

export function shouldRetry(failureCount: number, error: unknown): boolean {
  return (
    isApiError(error) &&
    RETRYABLE_ERROR_KINDS.includes(error.kind) &&
    failureCount < QUERY_MAX_RETRY_COUNT
  );
}

export function createQueryClient(overrides: DefaultOptions = {}): QueryClient {
  return new QueryClient({
    defaultOptions: {
      ...overrides,
      queries: { ...DEFAULT_QUERY_OPTIONS, ...overrides.queries },
    },
  });
}
