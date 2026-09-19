import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { render, screen } from "@testing-library/react";

import { App } from "./app";
import { AppProviders } from "./app-providers";
import { initializeSystem } from "./initialize-system";
import { routes } from "./router";

describe("App", () => {
  it("앱 제목을 렌더링한다", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "US Alliance" })).toBeInTheDocument();
  });

  it("초기화된 시스템과 라우터를 통해 루트 경로가 렌더링된다", async () => {
    const system = initializeSystem({ queryClient: { queries: { retry: false } } });
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });

    render(
      <AppProviders {...system}>
        <RouterProvider router={router} />
      </AppProviders>,
    );

    expect(await screen.findByRole("heading", { name: "US Alliance" })).toBeInTheDocument();
  });
});
