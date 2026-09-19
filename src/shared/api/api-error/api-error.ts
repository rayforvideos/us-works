import { isAxiosError, isCancel } from "axios";

import { type ApiErrorKind } from "./types";

type ApiErrorInit = {
  kind: ApiErrorKind;
  status: number | null;
  serverMessage: string | null;
  cause: unknown;
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly serverMessage: string | null;

  constructor({ kind, status, serverMessage, cause }: ApiErrorInit) {
    super(`ApiError(${kind}${status === null ? "" : ` ${String(status)}`})`, { cause });
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.serverMessage = serverMessage;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

export function getErrorKind(status: number): ApiErrorKind {
  switch (status) {
    case 400:
      return "validation";
    case 401:
      return "unauthorized";
    case 403:
      return "forbidden";
    case 404:
      return "not_found";
    case 409:
      return "conflict";
    default:
      return status >= 500 && status < 600 ? "server" : "unknown";
  }
}

export function extractServerMessage(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("error" in body)) {
    return null;
  }
  const { error } = body;
  return typeof error === "string" ? error : null;
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (isCancel(error)) {
    return new ApiError({ kind: "canceled", status: null, serverMessage: null, cause: error });
  }

  if (isAxiosError(error)) {
    if (!error.response) {
      return new ApiError({ kind: "network", status: null, serverMessage: null, cause: error });
    }
    const response: { status: number; data: unknown } = error.response;
    return new ApiError({
      kind: getErrorKind(response.status),
      status: response.status,
      serverMessage: extractServerMessage(response.data),
      cause: error,
    });
  }

  return new ApiError({ kind: "unknown", status: null, serverMessage: null, cause: error });
}
