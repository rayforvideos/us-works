import { createBrowserRouter, type RouteObject } from "react-router";

import { App } from "./App";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: App,
  },
];

export const router = createBrowserRouter(routes);
