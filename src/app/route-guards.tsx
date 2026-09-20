import { Navigate, Outlet, useLocation } from "react-router";

import { useIsAuthenticated } from "@/entities/session";
import { ROUTES } from "@/shared/config";

export function RequireSession() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (isAuthenticated) {
    return <Outlet />;
  }
  return (
    <Navigate to={ROUTES.login} replace state={{ from: location.pathname + location.search }} />
  );
}

export function RedirectIfSession() {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.contents} replace />;
  }
  return <Outlet />;
}
