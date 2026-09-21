import { createBrowserRouter, Navigate, type RouteObject } from "react-router";

import { ROUTES } from "@/shared/config";

import { RouteFallback } from "./route-fallback";
import { RedirectIfSession, RequireSession } from "./route-guards";

export const routes: RouteObject[] = [
  {
    Component: RedirectIfSession,
    HydrateFallback: RouteFallback,
    children: [
      {
        path: ROUTES.login,
        lazy: async () => ({ Component: (await import("@/pages/login")).LoginPage }),
      },
      {
        path: ROUTES.register,
        lazy: async () => ({ Component: (await import("@/pages/register")).RegisterPage }),
      },
    ],
  },
  {
    Component: RequireSession,
    HydrateFallback: RouteFallback,
    children: [
      {
        path: ROUTES.contents,
        lazy: async () => ({ Component: (await import("@/pages/contents")).ContentsPage }),
      },
      {
        path: ROUTES.alarms,
        lazy: async () => ({ Component: (await import("@/pages/alarms")).AlarmsPage }),
      },
      {
        path: ROUTES.contentNew,
        lazy: async () => ({ Component: (await import("@/pages/content-write")).ContentWritePage }),
      },
      {
        path: ROUTES.contentDetailPattern,
        lazy: async () => ({ Component: (await import("@/pages/content-write")).ContentWritePage }),
      },
      {
        path: ROUTES.alarmNew,
        lazy: async () => ({ Component: (await import("@/pages/alarm-write")).AlarmWritePage }),
      },
      {
        path: ROUTES.alarmDetailPattern,
        lazy: async () => ({ Component: (await import("@/pages/alarm-write")).AlarmWritePage }),
      },
      { path: "*", element: <Navigate to={ROUTES.contents} replace /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
