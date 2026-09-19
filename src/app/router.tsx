import { createBrowserRouter, type RouteObject } from "react-router";

import { App } from "./app";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: App,
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
