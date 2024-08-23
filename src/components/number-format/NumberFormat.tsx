import _chunk from "lodash/chunk";
import useUserSettingStore, { UserSettingState } from "@/state/user-setting";
import { NumberFormatter } from "@mantine/core";

export const StyleEnum = {
  THOUSANDS_SEPARATOR: ",",
  DECIMAL_SEPARATOR: ".",
};

const FRACTION_DIGITS = "";

interface IProps {
  /** currency/decimal/percentage value */
  value: number;
  // /** thousands separator */
  // thousandsSeparator: string;
  // /** decimal separator */
  // decimalSeparator: string;
  /** How much value want to show after fraction */
  fractionDigitsShow?: boolean;
  /** Decimal Count Show */
  decimalCount?: number;
  /** Return always positive number */
  isPositive?: boolean;
  /** Return always kilo format */
  isKiloShow?: boolean;
}

export const numberFormattor = (
  value = 0,
  // thousandsSeparator = StyleEnum.THOUSANDS_SEPARATOR,
  // decimalSeparator = StyleEnum.DECIMAL_SEPARATOR,
  fractionDigitsShow = true,
  decimalCount = 0,
  isPositive = false,
  isKiloShow = false
) => {
  const userSettingStore: UserSettingState = useUserSettingStore();
  const thousandsSeparator =
    userSettingStore.thousandSeparator || StyleEnum.THOUSANDS_SEPARATOR;
  const decimalSeparator =
    userSettingStore.decimalSeparator || StyleEnum.DECIMAL_SEPARATOR;

  let fractionDigits = FRACTION_DIGITS;
  let currencyValue = "";
  let isNegative = false;

  if (Number(value) < 0) {
    isNegative = true;
    value = Math.abs(Number(value));
  }

  // Handle zero values
  if (value === 0 && isKiloShow) {
    return `0 k`;
  }
  if (value === 0 && !isKiloShow) {
    return `0`;
  }

  // Handle kilo format
  if (value >= 1000 && isKiloShow) {
    const thousandFormat = (value / 1000).toFixed(1).toString().split(".");
    const thousandValue = thousandFormat[0];
    const thousandFraction =
      thousandFormat[1] && thousandFormat[1].length > 0
        ? thousandFormat[1].toString()[0]
        : "0";

    const result = `${thousandValue}${thousandsSeparator}${thousandFraction} k`;
    return isNegative ? `-${result}` : result;
  }

  const numberParts =
    decimalCount && decimalCount > 0
      ? Number(value).toFixed(decimalCount).split(".")
      : Number(value).toString().split(".");

  if (numberParts.length === 2) {
    fractionDigits = numberParts[1];
  }

  if (decimalCount && decimalCount > 0 && numberParts.length !== 2) {
    const zero = 0;
    fractionDigits = zero.toFixed(decimalCount).split(".")[1];
  }

  value = Number(numberParts[0]);

  const fractionArr: any = [];

  if (value > 999) {
    const count = value.toString().split("").reverse();
    _chunk(count, 3).forEach((fraction) =>
      fractionArr.push(fraction.reverse().join(""))
    );
  }

  currencyValue =
    fractionArr.length > 0
      ? `${fractionArr.reverse().join(thousandsSeparator)}`
      : value.toString();

  // Check if decimal separator should be shown
  if (fractionDigitsShow && fractionDigits !== FRACTION_DIGITS) {
    currencyValue = `${currencyValue}${decimalSeparator}${fractionDigits}`;
  }

  // Negativity check
  if (isNegative && !isPositive) {
    currencyValue = `-${currencyValue}`;
  }

  return currencyValue;
};

export function NumberFormat({
  value = 0,
  // thousandsSeparator = StyleEnum.THOUSANDS_SEPARATOR,
  // decimalSeparator = StyleEnum.DECIMAL_SEPARATOR,
  fractionDigitsShow = true,
  isPositive = false,
  decimalCount = 0,
  isKiloShow = true,
}: IProps) {
  const numberFormat = numberFormattor(
    value,
    // thousandsSeparator,
    // decimalSeparator,
    fractionDigitsShow,
    decimalCount,
    isPositive,
    isKiloShow
  );
  return <>{numberFormat}</>;
}

export function MNumberFormatter({ value, ...props }: { value: number }) {
  const userSettingStore: UserSettingState = useUserSettingStore();
  const thousandsSeparator =
    userSettingStore.thousandSeparator || StyleEnum.THOUSANDS_SEPARATOR;
  const decimalSeparator =
    userSettingStore.decimalSeparator || StyleEnum.DECIMAL_SEPARATOR;
  return (
    <NumberFormatter
      {...props}
      thousandSeparator={thousandsSeparator}
      decimalSeparator={decimalSeparator}
      value={value ?? 0}
    />
  );
}
