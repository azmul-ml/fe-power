import * as RouterType from "@/routers/type";
import HomePage from "./page";
import { UserRoles } from "@/identity/scopes";

export const CHARTS_SCREEN: RouterType.RouteItemType = {
  path: "/charts",
  title: "Charts",
  permissions: [UserRoles.USER],
  component: HomePage,
  hasAll: false,
};
