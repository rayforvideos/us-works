import { createStore } from "jotai";

import { createHttpClient, createQueryClient } from "@/shared/api";
import { readEnv } from "@/shared/config";

import { type AppSystem, type InitializeSystemOptions } from "./types";

export function initializeSystem(options: InitializeSystemOptions = {}): AppSystem {
  const store = createStore();
  const httpClient = createHttpClient({ baseUrl: options.apiBaseUrl ?? readEnv().apiBaseUrl });
  const queryClient = createQueryClient(options.queryClient);

  return { store, queryClient, httpClient };
}
