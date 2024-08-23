import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChartSelectionMode } from "@/constants/chart";

export interface ChartSettingState {
  selectedChart: ChartSelectionMode;
  handleSelectedChart: (data: ChartSelectionMode) => void;
  rotatedChart: boolean;
  handleRotatedChart: (data: boolean) => void;
  clearAll: () => void;
}

/**
 * State Management for  Chart Setting
 * @dynamic
 * @hook {function}
 */
const useChartSettingStore = create(
  persist<ChartSettingState>(
    (set) => ({
      selectedChart: ChartSelectionMode.LINE_CHART,
      handleSelectedChart: (data: ChartSelectionMode) =>
        set(() => ({ selectedChart: data })),
      rotatedChart: false,
      handleRotatedChart: (data: boolean) =>
        set(() => ({ rotatedChart: data })),
      clearAll: () =>
        set(() => ({
          rotatedChart: false,
          selectedChart: ChartSelectionMode.LINE_CHART,
        })),
    }),
    {
      name: "chart-setting",
    }
  )
);

export default useChartSettingStore;
