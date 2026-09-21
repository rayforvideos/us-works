import { SESSION_STORAGE_KEY } from "./constants";
import { type PersistedSession } from "./types";

function isSessionUser(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "email" in value &&
    typeof value.email === "string" &&
    "createdAt" in value &&
    typeof value.createdAt === "string"
  );
}

function isPersistedSession(value: unknown): value is PersistedSession {
  return (
    typeof value === "object" &&
    value !== null &&
    "refreshToken" in value &&
    typeof value.refreshToken === "string" &&
    "refreshExpiresAt" in value &&
    typeof value.refreshExpiresAt === "string" &&
    "user" in value &&
    isSessionUser(value.user)
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

function readRawSession(): string | null {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function removeStoredSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    return;
  }
}

export function readPersistedSession(): PersistedSession | null {
  const raw = readRawSession();
  if (raw === null) {
    return null;
  }
  const stored = parseStoredSession(raw);
  if (stored === null || isExpired(stored.refreshExpiresAt)) {
    removeStoredSession();
    return null;
  }
  return stored;
}

export function writePersistedSession(session: PersistedSession | null): void {
  if (session === null) {
    removeStoredSession();
    return;
  }
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    return;
  }
}
