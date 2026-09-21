type SessionUser = {
  id: number;
  email: string;
  createdAt: string;
};

export type PersistedSession = {
  refreshToken: string;
  refreshExpiresAt: string;
  user: SessionUser;
};
