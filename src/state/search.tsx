import { create } from "zustand";
import { persist } from "zustand/middleware";

type SearchState = {
  search: null | string;
  addSearch: (data: string) => void;
  removeSearch: () => void;
  clearAll: () => void;
};

/**
 * State Management for Search
 * @dynamic
 * @hook {function}
 */
export const useSearch = create(
  persist<SearchState>(
    (set) => ({
      search: "",
      addSearch: (search: string) => {
        set(() => {
          return { search };
        });
      },
      removeSearch: () => {
        set(() => ({ search: "" }));
      },
      clearAll: () =>
        set({
          search: "",
        }),
    }),
    {
      name: "breadcrumb-storage",
    }
  )
);
