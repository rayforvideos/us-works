import { type createStore } from "jotai";

export type SessionStore = ReturnType<typeof createStore>;

export type AccessToken = {
  token: string;
  expiresAt: string;
};
