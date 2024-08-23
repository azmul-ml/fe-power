import dayjs from "dayjs";
import { DatePickerSelectionMode, DateFormat } from "@/constants/date";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export class UtilDateHelper {
  static dateFormatHandler(date: dayjs.Dayjs | null, type: string) {
    if (!date) return dayjs().format(DateFormat.DATE);

    switch (type) {
      case DatePickerSelectionMode.DATE:
        return dayjs(date).format(DateFormat.DATE);
      case DatePickerSelectionMode.MONTH:
        return dayjs(date).format(DateFormat.MONTH_YEAR);
      case DatePickerSelectionMode.YEAR:
        return dayjs(date).format(DateFormat.YEAR);
      default:
        return dayjs(date).format(DateFormat.DATE);
    }
  }

  static fromNowHandler(date: dayjs.Dayjs | null) {
    if (!date) return;
    return dayjs(date).fromNow();
  }

  static fullDataTimeHandler(date: dayjs.Dayjs | null) {
    if (!date) return;
    return dayjs(date).format(DateFormat.DATE_TIME_FULL);
  }

  static shortDataTimeHandler(date: dayjs.Dayjs | null) {
    if (!date) return;
    return dayjs(date).format(DateFormat.DATE_TIME_SHORT);
  }
}
