import { atom } from "jotai";

import { type AuthResponse, type RefreshResponse } from "../../api/session-api";
import { SESSION_STORAGE_KEY } from "./constants";
import { type AccessToken, type PersistedSession, type SessionStore } from "./types";

function isPersistedSession(value: unknown): value is PersistedSession {
  return (
    typeof value === "object" &&
    value !== null &&
    "refreshToken" in value &&
    typeof value.refreshToken === "string" &&
    "refreshExpiresAt" in value &&
    typeof value.refreshExpiresAt === "string" &&
    "user" in value &&
    typeof value.user === "object" &&
    value.user !== null
  );
}

function isExpired(expiresAt: string): boolean {
  const expiresAtMs = Date.parse(expiresAt);
  return Number.isNaN(expiresAtMs) || expiresAtMs <= Date.now();
}

function parseStoredSession(raw: string): PersistedSession | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isPersistedSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readStoredSession(): PersistedSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (raw === null) {
    return null;
  }
  const stored = parseStoredSession(raw);
  if (stored === null || isExpired(stored.refreshExpiresAt)) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
  return stored;
}

function writeStoredSession(session: PersistedSession | null): void {
  if (session === null) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

const cachedSessionAtom = atom<PersistedSession | null | undefined>(undefined);

export const persistedSessionAtom = atom(
  (get) => {
    const cached = get(cachedSessionAtom);
    return cached === undefined ? readStoredSession() : cached;
  },
  (_get, set, session: PersistedSession | null) => {
    set(cachedSessionAtom, session);
    writeStoredSession(session);
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
