type SessionUserResponse = {
  id: number;
  email: string;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  access_expires_at: string;
  refresh_expires_at: string;
  user: SessionUserResponse;
};

export type RefreshResponse = {
  access_token: string;
  access_expires_at: string;
};
