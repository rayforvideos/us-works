import { type AxiosInstance } from "axios";

import { type RefreshResponse } from "./types";

export async function refreshSession(
  client: AxiosInstance,
  refreshToken: string,
): Promise<RefreshResponse> {
  const response = await client.post<RefreshResponse>(
    "/api/v1/auth/refresh",
    { refresh_token: refreshToken },
    { skipAuth: true },
  );
  return response.data;
}
