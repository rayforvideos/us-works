import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { createHttpClient, createQueryClient, HttpClientProvider } from "@/shared/api";

import { createFakeAdapter } from "./fake-adapter";
import { type RenderWithProvidersOptions } from "./types";

/**
 * @constants
 */
const TEST_BASE_URL = "http://api.test";

export function renderWithProviders({
  routes,
  respond,
  initialEntries = ["/"],
  store,
}: RenderWithProvidersOptions) {
  const { adapter, calls } = createFakeAdapter(respond);
  const queryClient = createQueryClient({ queries: { retry: false } });
  const router = createMemoryRouter(routes, { initialEntries });
  const tree = <RouterProvider router={router} />;

  render(
    <QueryClientProvider client={queryClient}>
      <HttpClientProvider client={createHttpClient({ baseUrl: TEST_BASE_URL, adapter })}>
        {store ? <JotaiProvider store={store}>{tree}</JotaiProvider> : tree}
      </HttpClientProvider>
    </QueryClientProvider>,
  );

  return { router, calls, queryClient };
}
