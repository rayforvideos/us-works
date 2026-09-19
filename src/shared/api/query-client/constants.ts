import { type ApiErrorKind } from "../api-error";

export const QUERY_STALE_TIME_MS = 30_000;
export const QUERY_MAX_RETRY_COUNT = 1;
export const RETRYABLE_ERROR_KINDS: readonly ApiErrorKind[] = ["network", "server"];
