import { createBrowserRouter, Navigate, type RouteObject } from "react-router";

import { ContentsPage } from "@/pages/contents";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";

import { RedirectIfSession, RequireSession } from "./route-guards";

export const routes: RouteObject[] = [
  {
    Component: RedirectIfSession,
    children: [
      { path: "/login", Component: LoginPage },
      { path: "/register", Component: RegisterPage },
    ],
  },
  {
    Component: RequireSession,
    children: [
      { path: "/", Component: ContentsPage },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
