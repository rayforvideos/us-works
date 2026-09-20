import { createBrowserRouter, Navigate, type RouteObject } from "react-router";

import { AlarmsPage } from "@/pages/alarms";
import { ContentsPage } from "@/pages/contents";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ROUTES } from "@/shared/config";

import { RedirectIfSession, RequireSession } from "./route-guards";

export const routes: RouteObject[] = [
  {
    Component: RedirectIfSession,
    children: [
      { path: ROUTES.login, Component: LoginPage },
      { path: ROUTES.register, Component: RegisterPage },
    ],
  },
  {
    Component: RequireSession,
    children: [
      { path: ROUTES.contents, Component: ContentsPage },
      { path: ROUTES.alarms, Component: AlarmsPage },
      { path: "*", element: <Navigate to={ROUTES.contents} replace /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
