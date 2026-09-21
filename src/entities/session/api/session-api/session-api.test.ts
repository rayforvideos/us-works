import { createHttpClient } from "@/shared/api";
import { createFakeAdapter, createOkResponse, readLastCall } from "@/shared/testing";

import { refreshSession } from ".";

const REFRESHED = {
  access_token: "new-token",
  access_expires_at: "2026-09-20T12:15:00.000Z",
};

describe("refreshSession", () => {
  it("갱신 경로로 refresh token을 담아 인증 없이 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(REFRESHED));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await refreshSession(client, "refresh-token");

    const call = readLastCall(calls);
    expect(call.url).toBe("/api/v1/auth/refresh");
    expect(call.skipAuth).toBe(true);
    expect(call.data).toBe(JSON.stringify({ refresh_token: "refresh-token" }));
  });

  it("갱신된 access token을 돌려준다", async () => {
    const { adapter } = createFakeAdapter(() => createOkResponse(REFRESHED));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    const refreshed = await refreshSession(client, "refresh-token");

    expect(refreshed.access_token).toBe("new-token");
  });
});
