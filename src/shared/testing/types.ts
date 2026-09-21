import { type InitialEntry, type RouteObject } from "react-router";
import { type InternalAxiosRequestConfig } from "axios";
import { type createStore } from "jotai";

export type FakeResponse = { status: number; data: unknown } | "pending" | "network-error";

export type FakeResponder = (
  config: InternalAxiosRequestConfig,
  callIndex: number,
) => FakeResponse | Promise<FakeResponse>;

export type RenderWithProvidersOptions = {
  routes: RouteObject[];
  respond: FakeResponder;
  initialEntries?: InitialEntry[];
  store?: ReturnType<typeof createStore>;
};
