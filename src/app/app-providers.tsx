import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";

import { type AppSystem } from "./initialize-system";

/**
 * @types
 */
type AppProvidersProps = AppSystem & {
  children: ReactNode;
};

export function AppProviders({ store, queryClient, children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>{children}</JotaiProvider>
    </QueryClientProvider>
  );
}
