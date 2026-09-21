import { type AxiosInstance } from "axios";
import { createStore } from "jotai";

import {
  accessTokenAtom,
  clearSession,
  persistedSessionAtom,
  refreshSession,
  setAccessTokenFromRefreshResponse,
} from "@/entities/session";
import { createHttpClient, createQueryClient } from "@/shared/api";
import { readEnv } from "@/shared/config";

import { type AppStore, type AppSystem, type InitializeSystemOptions } from "./types";

/**
 * @constants
 */
const EXPIRED_ACCESS_TOKEN = { token: "", expiresAt: new Date(0).toISOString() };

function createAuthHandlers(store: AppStore, refreshClient: AxiosInstance) {
  return {
    getAccessToken: () => {
      const accessToken = store.get(accessTokenAtom);
      if (accessToken) {
        return accessToken;
      }
      return store.get(persistedSessionAtom) === null ? null : EXPIRED_ACCESS_TOKEN;
    },
    refreshAccessToken: async () => {
      const session = store.get(persistedSessionAtom);
      if (session === null) {
        return false;
      }
      try {
        setAccessTokenFromRefreshResponse(
          store,
          await refreshSession(refreshClient, session.refreshToken),
        );
        return true;
      } catch {
        return false;
      }
    },
    onUnauthorized: () => {
      clearSession(store);
    },
  };
}

export function initializeSystem(options: InitializeSystemOptions = {}): AppSystem {
  const { adapter } = options;
  const baseUrl = options.apiBaseUrl ?? readEnv().apiBaseUrl;
  const store = createStore();
  const queryClient = createQueryClient(options.queryClient);
  const refreshClient = createHttpClient({ baseUrl, adapter });
  const httpClient = createHttpClient({
    baseUrl,
    adapter,
    auth: createAuthHandlers(store, refreshClient),
  });

  store.sub(persistedSessionAtom, () => {
    queryClient.clear();
  });

  return { store, queryClient, httpClient };
}
