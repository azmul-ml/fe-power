import * as React from "react";
import { getRolesPermissions } from "@/identity/helpers";

interface IProps {
  /**
   * An array of required permissions
   */
  required: string[] | undefined;
  /**
   * Wrapped elements to be outputted given the required
   * permissions are met
   */
  children: React.ReactNode;
  /**
   * Toggles whether a user must have all of the required
   * permissions, or only one of them. Default is TRUE.
   */
  hasAll?: boolean;
}

/**
 * The permission component allows you to only display
 * content to users that have the required permissions.
 */
export default function Permission({
  required,
  children,
  hasAll = true,
}: IProps) {
  if (!Array.isArray(required)) return null;

  const isAccess = hasPermission(required, hasAll);
  return isAccess ? <>{children}</> : null;
}

export function hasPermission(
  required: string[] | undefined,
  hasAll: boolean = true
) {
  const { permissions } = getRolesPermissions();

  if (!required) {
    return new Error(
      "Missing 'required' parameter. No required permissions have been specified"
    );
  }

  return hasAll
    ? required.every(
        (permission) => permission && permissions.includes(permission)
      )
    : required.some(
        (permission) => permission && permissions.includes(permission)
      );
}
