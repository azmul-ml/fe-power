import { create } from "zustand";
import { persist } from "zustand/middleware";

type LayoutState = {
  isOpenLogoutModal: boolean;
  mobileOpened: boolean;
  desktopOpened: boolean;
  handleMobileOpened: (data: boolean) => void;
  handleDesktopOpened: (data: boolean) => void;
  handleOpenLogoutModal: (data: boolean) => void;
  clearAll: () => void;
};

/**
 * State Management for Layout
 * @dynamic
 * @hook {function}
 */
export const useLayout = create(
  persist<LayoutState>(
    (set) => ({
      isOpenLogoutModal: false,
      mobileOpened: false,
      desktopOpened: false,
      handleOpenLogoutModal: (data: boolean) => {
        set(() => {
          return { isOpenLogoutModal: data };
        });
      },
      handleMobileOpened: (data: boolean) => {
        set(() => {
          return { mobileOpened: data };
        });
      },
      handleDesktopOpened: (data: boolean) => {
        set(() => {
          return { desktopOpened: data };
        });
      },
      clearAll: () =>
        set({
          isOpenLogoutModal: false,
          mobileOpened: false,
          desktopOpened: false,
        }),
    }),
    {
      name: "layout-storage",
    }
  )
);
