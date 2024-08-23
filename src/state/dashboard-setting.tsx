import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface menuState {
  viewSelection: number;
  handleViewSelection: (data: number) => void;
  totalData: any[];
  handleTotalData: (data: any[]) => void;
  headers: string[];
  handleHeaders: (data: string[]) => void;
  numberHeaders: string[];
  handleNumberHeaders: (data: string[]) => void;
  stringHeaders: string[];
  handleStringHeaders: (data: string[]) => void;
  clearAll: () => void;
}

/**
 * State Management for Dashboard Data
 * @dynamic
 * @hook {function}
 */
const useDashboardDataStore = create(
  persist<menuState>(
    (set) => ({
      viewSelection: 1,
      handleViewSelection: (data: number) =>
        set(() => ({ viewSelection: data })),
      totalData: [],
      handleTotalData: (data: any[]) => set(() => ({ totalData: data })),
      headers: [],
      handleHeaders: (data: string[]) => set(() => ({ headers: data })),
      numberHeaders: [],
      handleNumberHeaders: (data: string[]) =>
        set(() => ({ numberHeaders: data })),
      stringHeaders: [],
      handleStringHeaders: (data: string[]) =>
        set(() => ({ stringHeaders: data })),
      clearAll: () =>
        set(() => ({
          totalData: [],
          headers: [],
          numberHeaders: [],
          stringHeaders: [],
        })),
    }),
    {
      name: "dashboard-data",
    }
  )
);

export default useDashboardDataStore;
