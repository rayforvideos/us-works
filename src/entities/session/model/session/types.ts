import { type createStore } from "jotai";

export type SessionStore = ReturnType<typeof createStore>;

type SessionUser = {
  id: number;
  email: string;
  createdAt: string;
};

export type AccessToken = {
  token: string;
  expiresAt: string;
};

export type PersistedSession = {
  refreshToken: string;
  refreshExpiresAt: string;
  user: SessionUser;
};
