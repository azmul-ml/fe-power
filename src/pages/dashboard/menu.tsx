import { MenuItemType } from "@/layout/menu-list/type";
import { PRIVATE_ROUTERS } from "@/routers/private";
import { IconTable } from "@tabler/icons-react";

export const DASHBOARD_MENUS: MenuItemType = {
  label: PRIVATE_ROUTERS.DASHBOARD_SCREEN.title,
  key: PRIVATE_ROUTERS.DASHBOARD_SCREEN.title,
  link: PRIVATE_ROUTERS.DASHBOARD_SCREEN.path,
  permission: [],
  icon: IconTable,
};
