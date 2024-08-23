import * as React from "react";
import { Navigate } from "react-router-dom";
import { getRolesPermissions } from "@/identity/helpers";
import NotFoundPage from "@/pages/not-found/page";

interface IProps {
  /**
   * An array of required roles
   */
  required: string[];
  /**
   * Wrapped elements to be outputted given the required
   * permissions are met
   */
  children: React.ReactNode;
  /**
   * Toggles whether a user must have all of the required
   * roles, or only one of them. Default is TRUE.
   */
  hasAll?: boolean;

  /**
   * Where to direct the user, if required permissions
   * aren't met. If no path is supplied, the user will
   * not be redirected.
   */
  redirect?: string;
  /**
   * User Don't want to show the not screen
   */
  isNotScreen?: boolean;
}

/**
 * The Protected Route component allows you to only display
 * page to users that have the required roles.
 */
export default function ProtectedRoute({
  required,
  children,
  hasAll = true,
  redirect,
  isNotScreen = true,
}: IProps) {
  const { roles } = getRolesPermissions();

  if (!Array.isArray(roles) || !Array.isArray(required))
    return <NotFoundPage />;

  const isAccess = RoutePermission(required, hasAll);

  if (isAccess) return <>{children}</>;
  if (!isAccess && redirect) return <Navigate to={redirect} replace={true} />;
  return isNotScreen ? <NotFoundPage /> : null;
}

export function RoutePermission(
  required: string[] | undefined,
  hasAll: boolean = true
) {
  if (!required) return;

  const { roles } = getRolesPermissions();

  return hasAll
    ? required.every((role) => role && roles.includes(role))
    : required.some((role) => role && roles.includes(role));
}
