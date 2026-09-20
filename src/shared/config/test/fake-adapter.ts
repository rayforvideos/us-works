import {
  type AxiosAdapter,
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { type FakeResponder, type FakeResponse } from "./types";

export function createFakeAdapter(respond: FakeResponder) {
  const calls: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = (config) => {
    calls.push(config);
    const result = respond(config);
    if (result === "pending") {
      return new Promise<AxiosResponse>(() => undefined);
    }
    const response = {
      status: result.status,
      statusText: "",
      headers: {},
      config,
      data: result.data,
    };
    if (result.status >= 400) {
      return Promise.reject(
        new AxiosError("요청 실패", "ERR_BAD_RESPONSE", config, undefined, response),
      );
    }
    return Promise.resolve(response);
  };
  return { adapter, calls };
}

export function createOkResponse(data: unknown, status = 200): FakeResponse {
  return { status, data: { success: true, data, error: "" } };
}

export function createFailResponse(status: number, error: string): FakeResponse {
  return { status, data: { success: false, data: null, error } };
}
