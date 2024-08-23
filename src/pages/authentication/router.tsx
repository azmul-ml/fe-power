import * as RouterType from "@/routers/type";
import HomePage from "./page";

export const AUTHENTICATION_SCREEN: RouterType.RouteItemType = {
  path: "/authentication",
  title: "Authentication",
  component: HomePage,
  hasAll: false,
};
