import { type ReactNode } from "react";
import { type AxiosInstance } from "axios";

import { HttpClientContextProvider } from "./http-client-context";

/**
 * @types
 */
type HttpClientProviderProps = {
  client: AxiosInstance;
  children: ReactNode;
};

export function HttpClientProvider({ client, children }: HttpClientProviderProps) {
  return <HttpClientContextProvider value={client}>{children}</HttpClientContextProvider>;
}
