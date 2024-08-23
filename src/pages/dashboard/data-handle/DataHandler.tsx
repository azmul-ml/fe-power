import CSVReader from "../csv-reader/CSVReader";
import ApiReader from "../api-reader/ApiReader";
import useImportDataSettingStore, {
  ImportDataSettingState,
} from "@/state/import-data-setting";
import JsonReader from "../json-reader/JsonReader";
import XLSXReader from "../xlsx-reader/XLSXReader";
import { Flex, SegmentedControl } from "@mantine/core";

export default function DataHandler() {
  const importDataSettingStore: ImportDataSettingState =
    useImportDataSettingStore();

  const onChange = (value: string) => {
    importDataSettingStore.handleSelectedItem(Number(value));
  };

  return (
    <Flex gap={20} direction={"column"}>
      <SegmentedControl
        name="favoriteFramework"
        title="Choose Format"
        value={importDataSettingStore.selectedItem.toString()}
        onChange={onChange}
        data={[
          {
            label: "API URL",
            value: "1",
          },
          {
            label: "CSV",
            value: "2",
          },
          {
            label: "JSON",
            value: "3",
          },
          {
            label: "XLSX",
            value: "4",
          },
        ]}
      />

      {importDataSettingStore.selectedItem === 1 && <ApiReader />}
      {importDataSettingStore.selectedItem === 2 && <CSVReader />}
      {importDataSettingStore.selectedItem === 3 && <JsonReader />}
      {importDataSettingStore.selectedItem === 4 && <XLSXReader />}
    </Flex>
  );
}
