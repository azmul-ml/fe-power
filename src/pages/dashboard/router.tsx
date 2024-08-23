import * as RouterType from "@/routers/type";
import { UserRoles } from "@/identity/scopes";
import HomePage from "./page";

export const DASHBOARD_SCREEN: RouterType.RouteItemType = {
  path: "/",
  title: "Data Table",
  permissions: [UserRoles.USER],
  component: HomePage,
  hasAll: false,
};
