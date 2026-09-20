import axios, { type AxiosInstance, type AxiosResponse } from "axios";

import { ApiError, extractServerMessage, getErrorKind, toApiError } from "../api-error";
import { attachAuthInterceptors } from "../auth-interceptor";
import { type CreateHttpClientOptions } from "./types";

/**
 * @types
 */
type ApiResponseBody = { success: boolean; data: unknown; error?: unknown };

/**
 * @constants
 */
const DEFAULT_EXPIRY_MARGIN_MS = 60_000;

function isApiResponseBody(value: unknown): value is ApiResponseBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof value.success === "boolean"
  );
}

function attachResponseInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response: AxiosResponse<unknown>) => {
      const body: unknown = response.data;
      if (!isApiResponseBody(body)) {
        return response;
      }
      if (body.success) {
        response.data = body.data;
        return response;
      }
      throw new ApiError({
        kind: getErrorKind(response.status),
        status: response.status,
        serverMessage: extractServerMessage(body),
        cause: response,
      });
    },
    (error: unknown) => {
      throw toApiError(error);
    },
  );
}

export function createHttpClient(options: CreateHttpClientOptions): AxiosInstance {
  const {
    baseUrl,
    auth,
    adapter,
    now = Date.now,
    expiryMarginMs = DEFAULT_EXPIRY_MARGIN_MS,
  } = options;
  const instance = axios.create({ baseURL: baseUrl, adapter });

  if (auth) {
    attachAuthInterceptors(instance, auth, { now, expiryMarginMs });
  }
  attachResponseInterceptors(instance);

  return instance;
}
