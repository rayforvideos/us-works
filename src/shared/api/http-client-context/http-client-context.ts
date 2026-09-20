import { createContext, useContext } from "react";
import { type AxiosInstance } from "axios";

const HttpClientContext = createContext<AxiosInstance | null>(null);

export const HttpClientContextProvider = HttpClientContext.Provider;

export function useHttpClient(): AxiosInstance {
  const client = useContext(HttpClientContext);
  if (client === null) {
    throw new Error("HttpClientProvider 안에서만 쓸 수 있습니다.");
  }
  return client;
}
