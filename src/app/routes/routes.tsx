import { createBrowserRouter, Navigate, type RouteObject } from "react-router";

import { AlarmWritePage } from "@/pages/alarm-write";
import { AlarmsPage } from "@/pages/alarms";
import { ContentWritePage } from "@/pages/content-write";
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
      { path: ROUTES.contentNew, Component: ContentWritePage },
      { path: ROUTES.contentDetailPattern, Component: ContentWritePage },
      { path: ROUTES.alarmNew, Component: AlarmWritePage },
      { path: ROUTES.alarmDetailPattern, Component: AlarmWritePage },
      { path: "*", element: <Navigate to={ROUTES.contents} replace /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
