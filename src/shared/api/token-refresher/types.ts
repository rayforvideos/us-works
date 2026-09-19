export type TokenRefreshHandlers = {
  refreshAccessToken: () => Promise<boolean>;
  onUnauthorized: () => void;
};

export type TokenRefresher = {
  refresh: () => Promise<boolean>;
  getPending: () => Promise<boolean> | null;
  notifyUnauthorized: () => void;
};
