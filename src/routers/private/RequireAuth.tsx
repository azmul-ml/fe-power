import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/identity/helpers";
import { PUBLIC_ROUTERS } from "@/routers/public";

/**
 * The Require Auth component allows you to only display
 * content to users that have the required token.
 */
export default function RequireAuth() {
  const location = useLocation();
  return isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate
      to={PUBLIC_ROUTERS.AUTHENTICATION_SCREEN.path}
      state={{ from: location }}
      replace
    />
  );
}
