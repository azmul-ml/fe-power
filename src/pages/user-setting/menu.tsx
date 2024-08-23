import { MenuItemType } from "@/layout/menu-list/type";
import { PRIVATE_ROUTERS } from "@/routers/private";
import { IconSettings } from "@tabler/icons-react";
import { UserRoles } from "@/identity/scopes";

export const USER_SETTING_MENUS: MenuItemType = {
  label: PRIVATE_ROUTERS.USER_SETTING_SCREEN.title,
  key: PRIVATE_ROUTERS.USER_SETTING_SCREEN.title,
  link: PRIVATE_ROUTERS.USER_SETTING_SCREEN.path,
  permission: [UserRoles.USER],
  icon: IconSettings,
};
