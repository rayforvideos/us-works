import { type DefaultOptions, QueryClient } from "@tanstack/react-query";

export const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  staleTime: 30_000,
  refetchOnWindowFocus: false,
} as const satisfies DefaultOptions["queries"];

export function createQueryClient(overrides: DefaultOptions = {}): QueryClient {
  return new QueryClient({
    defaultOptions: {
      ...overrides,
      queries: { ...DEFAULT_QUERY_OPTIONS, ...overrides.queries },
    },
  });
}
