import { type AxiosInstance } from "axios";

import { type AuthResponse } from "@/entities/session";

import { type Credentials } from "../../model/credentials-schema";

export async function login(client: AxiosInstance, body: Credentials): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>("/api/v1/auth/login", body, { skipAuth: true });
  return response.data;
}

export async function register(client: AxiosInstance, body: Credentials): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>("/api/v1/auth/register", body, {
    skipAuth: true,
  });
  return response.data;
}
