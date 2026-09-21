import {
  type AxiosAdapter,
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { type FakeResponder, type FakeResponse } from "./types";

export function createFakeAdapter(respond: FakeResponder) {
  const calls: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    calls.push(config);
    const result = await respond(config, calls.length - 1);
    if (result === "pending") {
      return new Promise<AxiosResponse>(() => undefined);
    }
    if (result === "network-error") {
      throw new AxiosError("네트워크 오류", "ERR_NETWORK", config);
    }
    const response = {
      status: result.status,
      statusText: "",
      headers: {},
      config,
      data: result.data,
    };
    if (result.status >= 400) {
      throw new AxiosError("요청 실패", "ERR_BAD_RESPONSE", config, undefined, response);
    }
    return response;
  };
  return { adapter, calls };
}

export function createOkResponse(data: unknown, status = 200): FakeResponse {
  return { status, data: { success: true, data, error: "" } };
}

export function createFailResponse(status: number, error = "실패"): FakeResponse {
  return { status, data: { success: false, data: null, error } };
}

export function readLastCall(calls: InternalAxiosRequestConfig[]): InternalAxiosRequestConfig {
  const call = calls.at(-1);
  if (!call) {
    throw new Error("기록된 요청이 없습니다");
  }
  return call;
}

export function readCallParams(calls: InternalAxiosRequestConfig[]): Record<string, unknown> {
  const params: unknown = readLastCall(calls).params;
  if (typeof params !== "object" || params === null) {
    return {};
  }
  return params as Record<string, unknown>;
}

export function readCallAt(
  calls: InternalAxiosRequestConfig[],
  index: number,
): InternalAxiosRequestConfig {
  const call = calls[index];
  if (!call) {
    throw new Error(`${index}번째 요청이 없습니다`);
  }
  return call;
}

export function readAuthorization(config: InternalAxiosRequestConfig): string | null {
  const value = AxiosHeaders.from(config.headers).get("Authorization");
  return typeof value === "string" ? value : null;
}
