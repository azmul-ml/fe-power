import * as RouterType from "@/routers/type";
import HomePage from "./page";
import { UserRoles } from "@/identity/scopes";

export const PIVOT_TABLE_SCREEN: RouterType.RouteItemType = {
  path: "/pivot-table",
  title: "Pivot Table",
  permissions: [UserRoles.USER],
  component: HomePage,
  hasAll: false,
};
