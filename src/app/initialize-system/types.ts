import { type DefaultOptions, type QueryClient } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import { type createStore } from "jotai";

type AppStore = ReturnType<typeof createStore>;

export type AppSystem = {
  store: AppStore;
  queryClient: QueryClient;
  httpClient: AxiosInstance;
};

export type InitializeSystemOptions = {
  apiBaseUrl?: string;
  queryClient?: DefaultOptions;
};
