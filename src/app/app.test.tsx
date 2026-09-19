import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { render, screen } from "@testing-library/react";

import { App } from "./app";
import { AppProviders } from "./app-providers";
import { routes } from "./router";

describe("App", () => {
  it("앱 제목을 렌더링한다", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "US Alliance" })).toBeInTheDocument();
  });

  it("프로바이더와 라우터를 통해 루트 경로가 렌더링된다", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });

    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    );

    expect(await screen.findByRole("heading", { name: "US Alliance" })).toBeInTheDocument();
  });
});
