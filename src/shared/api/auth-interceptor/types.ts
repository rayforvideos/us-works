import { type TokenRefreshHandlers } from "../token-refresher";

type AccessToken = {
  token: string;
  expiresAt: string;
};

export type HttpClientAuth = TokenRefreshHandlers & {
  getAccessToken: () => AccessToken | null;
};
