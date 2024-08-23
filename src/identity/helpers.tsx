import cookie from "react-cookies";
import { jwtDecode } from "jwt-decode";
import { JwtPayload, UserType } from "@/identity/type";
import { PUBLIC_ROUTERS } from "@/routers/public";

interface MyWindow extends Window {}
declare var window: MyWindow;

const SESSION_TOKEN = "session-token";
const ROLES_PERMISSIONS = "roles-permissions";

/**
 * Save token in a cookie
 * @param {string} accessToken
 * @param {string} expireAt
 * @param {string} refreshToken
 */
export const saveTokens = (
  accessToken: string,
  refreshToken: string,
  user: UserType
) => {
  const decoded: JwtPayload = jwtDecode(accessToken);
  const value = { accessToken, refreshToken, user, expireAt: decoded.exp };
  cookie.save(SESSION_TOKEN, value, { path: "/" });
};

/**
 * Save roles and permissions in a cookie
 * @param {Array<string>} roles
 * @param {Array<string>} permissions
 */
export const saveRolesPermissions = (
  roles: string[],
  permissions?: string[]
) => {
  const value = { roles, permissions };
  cookie.save(ROLES_PERMISSIONS, value, { path: "/" });
};

/**
 * Loads token from session cookie
 * @returns {object}
 */
export const getTokens = () => {
  const value = cookie.load(SESSION_TOKEN);

  return {
    accessToken: value && value.accessToken,
    expireAt: value && value.expireAt,
    user: value && value.user,
    refreshToken: value && value.refreshToken,
  };
};

/**
 * Loads token from session cookie
 * @returns {object}
 */
export const getRolesPermissions = () => {
  const value = cookie.load(ROLES_PERMISSIONS);

  return {
    roles: value && value.roles,
    permissions: value && value.permissions,
  };
};

/**
 * Deletes the session cookie
 */
export const clearTokens = () => {
  cookie.remove(ROLES_PERMISSIONS, { path: "/" });
  cookie.remove(SESSION_TOKEN, { path: "/" });
};

/**
 * Checks if the user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = (): boolean => {
  const { accessToken, expireAt } = getTokens();
  return accessToken != null && expireAt != null;
};

/**
 * Logout user, i.e. clear tokens
 */
export const logout = async () => {
  clearTokens();
  window.location.href = PUBLIC_ROUTERS.AUTHENTICATION_SCREEN.path;
};
