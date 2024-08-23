import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuSettingState {
  selectedMenu: number;
  handleSelectedMenu: (data: number) => void;
  clearAll: () => void;
}

/**
 * State Management for  Menu Setting
 * @dynamic
 * @hook {function}
 */
const useMenuSettingStore = create(
  persist<MenuSettingState>(
    (set) => ({
      selectedMenu: 0,
      handleSelectedMenu: (data: number) => set(() => ({ selectedMenu: data })),
      clearAll: () =>
        set(() => ({
          selectedMenu: 0,
        })),
    }),
    {
      name: "menu-setting",
    }
  )
);

export default useMenuSettingStore;
