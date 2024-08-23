import * as RouterType from "@/routers/type";
import HomePage from "./page";
import { UserRoles } from "@/identity/scopes";

export const USER_SETTING_SCREEN: RouterType.RouteItemType = {
  path: "/user-setting",
  title: "User Setting",
  permissions: [UserRoles.USER],
  component: HomePage,
  hasAll: false,
};
