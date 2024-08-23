import {
  isArray,
  kebabCase,
  capitalize,
  pullAll,
  cloneDeep,
  sumBy,
} from "lodash";

export class UtilHelper {
  static removeUndefined(values: any | undefined) {
    if (!values) {
      return values;
    }
    if (values.q !== undefined) {
      if (isArray(values.q)) {
        values.q = values.q.join("");
      }
      if (values.q.replace(/\s/g, "") === "") {
        values.q = null;
      }
    }
    Object.keys(values).forEach(
      (key) =>
        (values[key] == null || values[key].length === 0) && delete values[key]
    );
    return values;
  }
  static objectToArray(values: any) {
    const objectToArray: any[] = [];
    Object.keys(values).forEach((key) =>
      objectToArray.push([key, values[key]])
    );
    return objectToArray;
  }

  static formatString(crumb: string | undefined) {
    return (
      crumb &&
      kebabCase(crumb)
        .split("-")
        .map((name: string) => capitalize(name))
        .join(" ")
    );
  }

  static getPercentage(item: number, total: number) {
    if (!Boolean(item)) return "0%";
    const percentage = (item / total) * 100;
    return `${percentage.toFixed(2)}%`;
  }

  static getTotal(arr: any[], headers: string[]) {
    let sum = 0;
    for (let index = 0; index < headers.length; index++) {
      sum = sum + sumBy(arr, headers[index]);
    }
    return sum;
  }

  static chartPercentage(value: number, total: number) {
    const percentage = ((value / total) * 100).toFixed(2);
    return `${value}  (${percentage}%)`;
  }

  static getNumberStringHeader(keys: string[], data: any) {
    const numbers = [];
    const strings = [];
    if (keys) {
      for (let index = 0; index < keys.length; index++) {
        if (typeof data[keys[index]] === "number") {
          numbers.push(keys[index]);
        } else {
          if (isNaN(Number(data[keys[index]]))) {
            const item = data[keys[index]];
            if (typeof item === "object") {
              continue;
            }
            if (item.indexOf(",") > -1) {
              if (isNaN(item.split(",").join(""))) {
                strings.push(keys[index]);
              } else {
                numbers.push(keys[index]);
              }
            } else {
              strings.push(keys[index]);
            }
          } else {
            numbers.push(keys[index]);
          }
        }
      }
    }

    return { numbers, strings };
  }

  static getHeaders(items: string[], omitItem: object) {
    return pullAll(items, Object.keys(cloneDeep(omitItem)));
  }

}
