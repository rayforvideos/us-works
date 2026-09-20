import {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

import { ApiError, extractServerMessage } from "../api-error";
import { createTokenRefresher } from "../token-refresher";
import { type HttpClientAuth } from "./types";

/**
 * @types
 */
type AuthInterceptorOptions = {
  now: () => number;
  expiryMarginMs: number;
};

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

export function attachAuthInterceptors(
  instance: AxiosInstance,
  auth: HttpClientAuth,
  { now, expiryMarginMs }: AuthInterceptorOptions,
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
    if (token && token.token.length > 0) {
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
