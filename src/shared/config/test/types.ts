import { type InternalAxiosRequestConfig } from "axios";

export type FakeResponse = { status: number; data: unknown } | "pending";

export type FakeResponder = (config: InternalAxiosRequestConfig) => FakeResponse;
