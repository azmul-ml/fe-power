export interface RouteItemType {
  /** The id should be the same for paths that are showing the same component */
  id?: string;
  /** Browser title of menu item for navbar or sidebar */
  title: string;
  /** The URL path for when the component should be rendered */
  path: string;
  /** Screen (or component) to show when navigating to the menu item */
  component?: any;
  /** The required permissions to view this route */
  permissions?: string[];
  /** The required all permissions or not to view this route */
  hasAll: boolean;
}
