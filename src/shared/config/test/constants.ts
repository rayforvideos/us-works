const MINUTE_MS = 60 * 1000;

const DAY_MS = 24 * 60 * MINUTE_MS;

export const AUTH_RESPONSE_FIXTURE = {
  access_token: "access-token",
  refresh_token: "refresh-token",
  access_expires_at: new Date(Date.now() + 15 * MINUTE_MS).toISOString(),
  refresh_expires_at: new Date(Date.now() + 7 * DAY_MS).toISOString(),
  user: { id: 7, email: "user@example.com", created_at: "2026-09-01T00:00:00.000Z" },
};

export const PERSISTED_SESSION_FIXTURE = {
  refreshToken: AUTH_RESPONSE_FIXTURE.refresh_token,
  refreshExpiresAt: AUTH_RESPONSE_FIXTURE.refresh_expires_at,
  user: {
    id: AUTH_RESPONSE_FIXTURE.user.id,
    email: AUTH_RESPONSE_FIXTURE.user.email,
    createdAt: AUTH_RESPONSE_FIXTURE.user.created_at,
  },
};
