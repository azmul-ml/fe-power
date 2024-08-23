
export interface MenuItemType {
    label: string;
    key: string;
    link: string;
    icon?: any;
    permission?: string[];
}

export interface SubMenuItemType extends MenuItemType{
    children?: MenuItemType[]
}

export interface MenuItemsType extends  SubMenuItemType{
    children?: SubMenuItemType[]
  }
  