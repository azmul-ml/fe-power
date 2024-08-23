import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ImportDataSettingState {
  selectedItem: number;
  handleSelectedItem: (data: number) => void;
  apiUrl: string;
  handleApiUrl: (data: string) => void;
  clearAll: () => void;
}

/**
 * State Management for  Import Data Setting
 * @dynamic
 * @hook {function}
 */
const useImportDataSettingStore = create(
  persist<ImportDataSettingState>(
    (set) => ({
      selectedItem: 1,
      handleSelectedItem: (data: number) => set(() => ({ selectedItem: data })),
      apiUrl: "",
      handleApiUrl: (data: string) => set(() => ({ apiUrl: data })),
      clearAll: () =>
        set(() => ({
          selectedItem: 1,
          apiUrl: "",
        })),
    }),
    {
      name: "import-data-setting",
    }
  )
);

export default useImportDataSettingStore;
