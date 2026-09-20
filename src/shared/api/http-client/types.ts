import { type AxiosAdapter } from "axios";

import { type HttpClientAuth } from "../auth-interceptor";

export type CreateHttpClientOptions = {
  baseUrl: string;
  auth?: HttpClientAuth;
  adapter?: AxiosAdapter;
  now?: () => number;
  expiryMarginMs?: number;
};

export type RequestOptions = {
  signal?: AbortSignal;
};
