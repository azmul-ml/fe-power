// @ts-ignore
// @ts-nocheck
import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as themeColors from "@/constants/theme";
import { MantineColorsTuple } from "@mantine/core";

export interface UserSettingState {
  thousandSeparator: string | null;
  handleThousandSeparator: (data: string | null) => void;
  decimalSeparator: string | null;
  handleDecimalSeparator: (data: string | null) => void;
  themeColor: string | null;
  colorPlate: MantineColorsTuple;
  handleThemeColor: (data: string | null) => void;
  itemPerChart: number;
  handleItemPerChart: (data: number) => void;
  clearAll: () => void;
}

/**
 * State Management for  Menu Setting
 * @dynamic
 * @hook {function}
 */
const useUserSettingStore = create(
  persist<UserSettingState>(
    (set) => ({
      thousandSeparator: null,
      decimalSeparator: null,
      themeColor: "green",
      colorPlate: themeColors.green,
      itemPerChart: 100,
      handleThousandSeparator: (data: string | null) =>
        set(() => ({ thousandSeparator: data })),
      handleItemPerChart: (data: number) => set(() => ({ itemPerChart: data })),
      handleDecimalSeparator: (data: string | null) =>
        set(() => ({ decimalSeparator: data })),
      handleThemeColor: (data: string | null) =>
        set(() => {
          if (typeof data === "string") {
            const color: string = data;
            // eslint-disable-next-line
            return { colorPlate: themeColors[color], themeColor: data };
          }
          return { themeColor: data };
        }),
      clearAll: () =>
        set(() => ({
          itemPerChart: 100,
          thousandSeparator: null,
          decimalSeparator: null,
          themeColor: "green",
        })),
    }),
    {
      name: "user-setting",
    }
  )
);

export default useUserSettingStore;
