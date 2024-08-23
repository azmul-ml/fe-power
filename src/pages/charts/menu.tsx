import { MenuItemType } from "@/layout/menu-list/type";
import { PRIVATE_ROUTERS } from "@/routers/private";
import { IconChartArea } from "@tabler/icons-react";
import { UserRoles } from "@/identity/scopes";

export const CHARTS_MENUS: MenuItemType = {
  label: PRIVATE_ROUTERS.CHARTS_SCREEN.title,
  key: PRIVATE_ROUTERS.CHARTS_SCREEN.title,
  link: PRIVATE_ROUTERS.CHARTS_SCREEN.path,
  permission: [UserRoles.USER],
  icon: IconChartArea,
};
