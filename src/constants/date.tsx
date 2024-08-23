/**
 * DatePicker Selection Mode
 * @readonly
 * @enum {string}
 */
export enum DatePickerSelectionMode {
  DATE = "date",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  PICKER = "picker",
}

/** DateP Format
 * @readonly
 * @enum {string}
 */
export enum DateFormat {
  DATE = "ddd, D MMM, YYYY",
  DATE_TIME = "ddd, D MMM, YYYY h:mm A",
  DATE_TIME_FULL = "dddd, MMMM D, YYYY h:mm A",
  DATE_TIME_SHORT = "MMM DD, YYYY h:mm A",
  MONTH_YEAR = "MMMM, YYYY",
  YEAR = "YYYY",
}
