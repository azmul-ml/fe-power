import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/identity/helpers";

/**
 * The Public Route component allows you to only
 * handle logic for public route
 */
export default function PublicRoute() {
  const location = useLocation();
  const successRedirectUrl: string = location.state?.from?.pathname ?? "/";

  return isAuthenticated() ? (
    <Navigate to={successRedirectUrl} replace />
  ) : (
    <Outlet />
  );
}
