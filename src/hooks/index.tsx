import {
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import useEditPageTitle from "./useBreadCrumb";
import usePath from "./usePath";
import useData from "./useData";
import useSearch from "./useSearch";

export {
  useEditPageTitle,
  usePath,
  useData,
  useSearch,
};

export type ApiServiceErr = any;
export type MutOpt<Response, TVariables = unknown> = UseMutationOptions<
  Response,
  ApiServiceErr,
  TVariables,
  unknown
>;
export type QueryOpt<Response, TVariables = unknown> = UseQueryOptions<
  Response,
  ApiServiceErr,
  TVariables,
  any[]
>;

export type QueryResult = UseQueryResult<any, Error>;

export interface ParamOptions {
  limit: number;
  page: number;
  sortBy: string;
}
