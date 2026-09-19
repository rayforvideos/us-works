import { type DefaultOptions, type QueryClient } from "@tanstack/react-query";
import { createStore } from "jotai";

import { createQueryClient } from "@/shared/api";

type AppStore = ReturnType<typeof createStore>;

export type AppSystem = {
  store: AppStore;
  queryClient: QueryClient;
};

export type InitializeSystemOptions = {
  queryClient?: DefaultOptions;
};

export function initializeSystem(options: InitializeSystemOptions = {}): AppSystem {
  const store = createStore();
  const queryClient = createQueryClient(options.queryClient);

  return { store, queryClient };
}
