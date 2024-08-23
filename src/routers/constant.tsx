/**
 * Enum with router URL parameters.
 * @readonly
 * @enum {string}
 */
export enum RouterParameters {
  TAB = "/:tab",
  ID = "/:id",
  ITEM_ID = "/:itemId",
  CREATE = "/create",
  DETAILS = "/details",
  EDIT = "/edit",
}

/**
 * Tab params
 */
export type TabParams<T> = {
  id: string;
  tab: T;
  itemId: string;
};

/**
 * Details params
 */
export type DetailsParams = {
  id: string;
  itemId?: string;
};
