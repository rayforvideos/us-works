import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";

import { HttpClientProvider } from "@/shared/api";

import { type AppSystem } from "./initialize-system";

/**
 * @types
 */
type AppProvidersProps = AppSystem & {
  children: ReactNode;
};

export function AppProviders({ store, queryClient, httpClient, children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HttpClientProvider client={httpClient}>
        <JotaiProvider store={store}>{children}</JotaiProvider>
      </HttpClientProvider>
    </QueryClientProvider>
  );
}
