import { atom } from "jotai";

import { type AuthResponse, type RefreshResponse } from "../../api/session-api";
import {
  type PersistedSession,
  readPersistedSession,
  writePersistedSession,
} from "../session-storage";
import { type AccessToken, type SessionStore } from "./types";

const cachedSessionAtom = atom<PersistedSession | null | undefined>(undefined);

export const persistedSessionAtom = atom(
  (get) => {
    const cached = get(cachedSessionAtom);
    return cached === undefined ? readPersistedSession() : cached;
  },
  (_get, set, session: PersistedSession | null) => {
    set(cachedSessionAtom, session);
    writePersistedSession(session);
  },
);

export const accessTokenAtom = atom<AccessToken | null>(null);

export const isAuthenticatedAtom = atom((get) => get(persistedSessionAtom) !== null);

export function setSessionFromAuthResponse(store: SessionStore, data: AuthResponse): void {
  store.set(persistedSessionAtom, {
    refreshToken: data.refresh_token,
    refreshExpiresAt: data.refresh_expires_at,
    user: { id: data.user.id, email: data.user.email, createdAt: data.user.created_at },
  });
  store.set(accessTokenAtom, { token: data.access_token, expiresAt: data.access_expires_at });
}

export function setAccessTokenFromRefreshResponse(
  store: SessionStore,
  data: RefreshResponse,
): void {
  store.set(accessTokenAtom, { token: data.access_token, expiresAt: data.access_expires_at });
}

export function clearSession(store: SessionStore): void {
  store.set(persistedSessionAtom, null);
  store.set(accessTokenAtom, null);
}
