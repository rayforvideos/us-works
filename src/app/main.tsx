import "./styles/globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import { AppProviders } from "./app-providers";
import { initializeSystem } from "./initialize-system";
import { createAppRouter } from "./router";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("root 요소를 찾을 수 없습니다.");
}

const system = initializeSystem();
const router = createAppRouter();

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders {...system}>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
