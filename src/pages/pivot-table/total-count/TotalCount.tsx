import { useCallback, useEffect, useState } from "react";
import "react-pivottable/pivottable.css";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Select } from "@mantine/core";
import useDashboardDataStore, { menuState } from "@/state/dashboard-setting";
import { pick, map, countBy } from "lodash";

// create Plotly renderers via dependency injection

export default function App() {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const dashboardDataStore: menuState = useDashboardDataStore();

  const totalData: any = useLiveQuery(
    async () => await db.dashboardData.toArray(),
    []
  );

  const getData = useCallback(async () => {
    console.log(selectedValue);

    const newArray = map(totalData, (obj) => pick(obj, [selectedValue]));
    const result = map(countBy(newArray, selectedValue), (count, item) => ({
      item,
      count,
    }));

    console.log(result);
  }, [selectedValue]);

  useEffect(() => {
    getData();
  }, [selectedValue]);

  return (
    <div>
      <Select
        label={"Headers"}
        placeholder="Pick value"
        onChange={(value) => {
          if (value) {
            setSelectedValue(value?.toString());
          }
        }}
        value={selectedValue}
        data={dashboardDataStore.headers ?? []}
      />
    </div>
  );
}
