import { createStore } from "jotai";

import { AUTH_RESPONSE_FIXTURE, PERSISTED_SESSION_FIXTURE } from "@/shared/testing";

import { SESSION_STORAGE_KEY } from "../session-storage";
import {
  accessTokenAtom,
  clearSession,
  isAuthenticatedAtom,
  persistedSessionAtom,
  setAccessTokenFromRefreshResponse,
  setSessionFromAuthResponse,
} from "./session";

describe("세션 저장", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("로그인 응답의 refresh token과 사용자만 localStorage에 남긴다", () => {
    const store = createStore();

    setSessionFromAuthResponse(store, AUTH_RESPONSE_FIXTURE);

    expect(store.get(persistedSessionAtom)).toEqual(PERSISTED_SESSION_FIXTURE);
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toContain("refresh-token");
  });

  it("access token은 메모리에만 두고 저장소에 쓰지 않는다", () => {
    const store = createStore();

    setSessionFromAuthResponse(store, AUTH_RESPONSE_FIXTURE);

    expect(store.get(accessTokenAtom)).toEqual({
      token: AUTH_RESPONSE_FIXTURE.access_token,
      expiresAt: AUTH_RESPONSE_FIXTURE.access_expires_at,
    });
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).not.toContain("access-token");
  });

  it("갱신 응답을 받으면 access token만 바꾼다", () => {
    const store = createStore();
    setSessionFromAuthResponse(store, AUTH_RESPONSE_FIXTURE);

    setAccessTokenFromRefreshResponse(store, {
      access_token: "next-token",
      access_expires_at: "2026-09-20T12:30:00.000Z",
    });

    expect(store.get(accessTokenAtom)).toEqual({
      token: "next-token",
      expiresAt: "2026-09-20T12:30:00.000Z",
    });
    expect(store.get(persistedSessionAtom)).not.toBeNull();
  });

  it("세션을 비우면 저장소와 메모리가 모두 빈다", () => {
    const store = createStore();
    setSessionFromAuthResponse(store, AUTH_RESPONSE_FIXTURE);

    clearSession(store);

    expect(store.get(persistedSessionAtom)).toBeNull();
    expect(store.get(accessTokenAtom)).toBeNull();
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it("isAuthenticatedAtom은 저장된 세션이 있을 때만 참이다", () => {
    const store = createStore();

    expect(store.get(isAuthenticatedAtom)).toBe(false);

    setSessionFromAuthResponse(store, AUTH_RESPONSE_FIXTURE);
    expect(store.get(isAuthenticatedAtom)).toBe(true);

    clearSession(store);
    expect(store.get(isAuthenticatedAtom)).toBe(false);
  });

  it("저장소를 쓸 수 없어도 세션을 읽고 쓸 수 있다", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    const store = createStore();

    expect(store.get(persistedSessionAtom)).toBeNull();
    setSessionFromAuthResponse(store, AUTH_RESPONSE_FIXTURE);
    expect(store.get(isAuthenticatedAtom)).toBe(true);
  });
});
