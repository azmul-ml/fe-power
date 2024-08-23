import { MenuItemType } from "@/layout/menu-list/type";
import { PRIVATE_ROUTERS } from "@/routers/private";
import { IconTableHeart } from "@tabler/icons-react";
import { UserRoles } from "@/identity/scopes";

export const PIVOT_TABLE_MENUS: MenuItemType = {
  label: PRIVATE_ROUTERS.PIVOT_TABLE_SCREEN.title,
  key: PRIVATE_ROUTERS.PIVOT_TABLE_SCREEN.title,
  link: PRIVATE_ROUTERS.PIVOT_TABLE_SCREEN.path,
  permission: [UserRoles.USER],
  icon: IconTableHeart,
};
