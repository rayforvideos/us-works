import { type ReactNode } from "react";
import { type AxiosInstance } from "axios";

import { HttpClientContext } from "./http-client-context";

/**
 * @types
 */
type HttpClientProviderProps = {
  client: AxiosInstance;
  children: ReactNode;
};

export function HttpClientProvider({ client, children }: HttpClientProviderProps) {
  return <HttpClientContext value={client}>{children}</HttpClientContext>;
}
