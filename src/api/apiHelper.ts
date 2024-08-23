import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import qs from "query-string";
import { getTokens } from "@/identity/helpers";
import { saveTokens, logout } from "@/identity/helpers";
import { ResponseStatus } from "./apiConst";
import { ENV } from "./config";
import { jwtDecode } from "jwt-decode";
import { JwtPayload, UserType } from "@/identity/type";
import { notifications } from '@mantine/notifications';

interface MyWindow extends Window {}
declare var window: MyWindow;

/** Setup an API instance */
export const api = axios.create({
  baseURL: ENV.API_HOST,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "index" });
  },
});

/**
 * Adds autherization headers to API calls
 * @param {InternalAxiosRequestConfig} request
 */
api.interceptors.request.use(
  async (
    request: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig<any>> => {
    const { accessToken, refreshToken } = getTokens();

    if (refreshToken) {
      const decoded: JwtPayload = jwtDecode(refreshToken);

      if (new Date(decoded.exp * 1000).getTime() < new Date().getTime()) {
        logout();
        return Promise.reject("Refresh Token Expired");
      }
    }

    if (accessToken) request.headers["Authorization"] = `Bearer ${accessToken}`;
    return request;
  }
);

/** Response interceptor for API calls and refresh token handing */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error?.response.status.toString().startsWith("5")) {
      notifications.show({
        color: 'red',
        title: "ServerError",
        message: 'Error',
      })
      return Promise.reject(error);
    }

    if (
      (error?.response?.status === ResponseStatus.TOKEN_EXPIRED ||
        error?.response?.status === ResponseStatus.UNAUTHORIZED) &&
      !originalRequest._retry
    ) {
      const { refreshToken } = getTokens();

      originalRequest._retry = true;

      try {
        const response = await fetch(
          ENV.API_HOST + "/api/v1/auth/refresh-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refreshToken: refreshToken,
            }),
          }
        );
        const token: { data: { jwt: string; user: UserType } } =
          await response.json();

        saveTokens(token.data.jwt, token.data.jwt, token.data.user);

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${token.data.jwt}`;

        return api(originalRequest);
      } catch (_error: any) {
        if (_error.response && _error.response.data) {
          return Promise.reject(_error.response.data);
        }

        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
);
