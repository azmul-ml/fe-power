import * as DASHBOARD_ROUTER from "@/pages/dashboard/router";
import * as CHARTS_ROUTER from "@/pages/charts/router";
import * as PIVOT_TABLE_ROUTER from "@/pages/pivot-table/router";
import * as USER_SETTING_ROUTER from "@/pages/user-setting/router";

export const PRIVATE_ROUTERS = {
  ...DASHBOARD_ROUTER,
  ...CHARTS_ROUTER,
  ...PIVOT_TABLE_ROUTER,
  ...USER_SETTING_ROUTER,
};
