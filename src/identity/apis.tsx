import { api } from "@/api/apiHelper";
import { Endpoints } from "@/api/apiConst";
import * as IdentityType from "./type";
import { AuthEndpointsEnum } from "./endpoints";
import { AxiosResponse } from "axios";

/**
 * Register User
 * @returns {Auth Response}
 */
export const registerUser = async (
  user: IdentityType.RegisterUser
): Promise<AxiosResponse> => await api.post(AuthEndpointsEnum.REGISTER, user);

/**
 * Login User
 * @returns {Auth Response}
 */

export const loginUser = async (
  user: IdentityType.LoginUser
): Promise<AxiosResponse> => await api.post(Endpoints.AUTH + "/local", user);

/**
 * Refresh Token
 * @returns {Auth Response}
 */
export const refreshToken = (refreshToken: string): Promise<any> => {
  return api
    .post(Endpoints.AUTH + "/refresh-token", { refreshToken })
    .then((response) => response.data.data);
};

/**
 * Refresh Token
 * @returns {Auth Response}
 */
export const passwordReset = async (
  user: IdentityType.PasswordReset,
  params?: any
): Promise<any> =>
  await api.post(Endpoints.AUTH + "/password-reset", user, {
    params,
  });

/**
 * forgot Password
 * @returns {Auth Response}
 */
export const forgotPassword = async (
  user: IdentityType.ForgotPassword,
  params?: any
): Promise<any> =>
  await api.post(Endpoints.AUTH + "/forgot-password", user, {
    params,
  });
