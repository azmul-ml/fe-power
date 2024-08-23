import { create } from "zustand";
import { persist } from "zustand/middleware";

type BreadCrumbState = {
  editPageTitle: null | string;
  addEditPageTitle: (data: string) => void;
  removeEditPageTitle: () => void;
  clearAll: () => void;
};

/**
 * State Management for BreadCrumb
 * @dynamic
 * @hook {function}
 */
export const useBreadCrumb = create(
  persist<BreadCrumbState>(
    (set) => ({
      editPageTitle: null,
      addEditPageTitle: (title: string) => {
        set(() => ({ editPageTitle: title }));
      },
      removeEditPageTitle: () => {
        set(() => ({ editPageTitle: null }));
      },
      clearAll: () =>
        set({
          editPageTitle: null,
        }),
    }),
    {
      name: "breadcrumb-storage",
    }
  )
);
