import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

import { ApiError, extractServerMessage, getErrorKind, toApiError } from "../api-error";
import { createTokenRefresher } from "../token-refresher";
import { type CreateHttpClientOptions, type HttpClientAuth } from "./types";

const DEFAULT_EXPIRY_MARGIN_MS = 60_000;

type AuthOptions = {
  auth: HttpClientAuth;
  now: () => number;
  expiryMarginMs: number;
};

type ApiResponseBody = { success: boolean; data: unknown; error?: unknown };

function isApiResponseBody(value: unknown): value is ApiResponseBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof value.success === "boolean"
  );
}

function isAuthenticatedRequest(config: InternalAxiosRequestConfig): boolean {
  return !config.skipAuth;
}

function createRefreshFailedError(): ApiError {
  return new ApiError({ kind: "unauthorized", status: null, serverMessage: null, cause: null });
}

function createUnauthorizedError(error: AxiosError): ApiError {
  const body: unknown = error.response?.data;
  return new ApiError({
    kind: "unauthorized",
    status: 401,
    serverMessage: extractServerMessage(body),
    cause: error,
  });
}

function isRetryableUnauthorized(
  error: unknown,
): error is AxiosError & { config: InternalAxiosRequestConfig } {
  return (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    error.config !== undefined &&
    isAuthenticatedRequest(error.config)
  );
}

function attachAuthInterceptors(
  instance: AxiosInstance,
  { auth, now, expiryMarginMs }: AuthOptions,
) {
  const refresher = createTokenRefresher(auth);

  function isExpiring(expiresAt: string): boolean {
    return Date.parse(expiresAt) - now() <= expiryMarginMs;
  }

  async function ensureFreshToken(config: InternalAxiosRequestConfig): Promise<void> {
    const pending = refresher.getPending();
    if (pending && !(await pending)) {
      throw createRefreshFailedError();
    }

    const token = auth.getAccessToken();
    if (!token || config.authExpiryChecked || !isExpiring(token.expiresAt)) {
      return;
    }

    config.authExpiryChecked = true;
    if (!(await refresher.refresh())) {
      throw createRefreshFailedError();
    }
  }

  function applyToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = auth.getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token.token}`);
    }
    return config;
  }

  instance.interceptors.request.use(
    async (config) => {
      await ensureFreshToken(config);
      return applyToken(config);
    },
    undefined,
    { runWhen: isAuthenticatedRequest },
  );

  instance.interceptors.response.use(undefined, async (error: unknown) => {
    if (!isRetryableUnauthorized(error)) {
      throw error;
    }

    if (error.config.authRetried) {
      refresher.notifyUnauthorized();
      throw error;
    }

    error.config.authRetried = true;
    if (!(await refresher.refresh())) {
      throw createUnauthorizedError(error);
    }
    return instance.request(error.config);
  });
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
    attachAuthInterceptors(instance, { auth, now, expiryMarginMs });
  }
  attachResponseInterceptors(instance);

  return instance;
}
