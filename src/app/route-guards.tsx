import { Navigate, Outlet, useLocation } from "react-router";

import { useIsAuthenticated } from "@/entities/session";

export function RequireSession() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (isAuthenticated) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
}

export function RedirectIfSession() {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
