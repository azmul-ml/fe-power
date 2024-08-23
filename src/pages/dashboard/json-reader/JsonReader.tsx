import useDashboardDataSetting, { menuState } from "@/state/dashboard-setting";
import { UtilHelper } from "@/utils/helpers";
import { sample, sampleSize } from "lodash";
import { db } from "@/db";

export default function JsonReader() {
  const dashboardDataSetting: menuState = useDashboardDataSetting();

  const readJsonFile = (file: Blob) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        if (event.target) {
          resolve(JSON.parse(event.target.result as string));
        }
      };

      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      try {
        const data = await readJsonFile(event.target.files[0]);

        if (data && Array.isArray(data)) {
          const headers = data && Object.keys(data?.[0]);
          const { numbers, strings } = UtilHelper.getNumberStringHeader(
            headers,
            sample(sampleSize(data, 5))
          );

          await db.dashboardData.clear();
          await db.dashboardData.bulkAdd(data);

          dashboardDataSetting.handleViewSelection(1);
          dashboardDataSetting.handleHeaders(headers);
          dashboardDataSetting.handleNumberHeaders(numbers);
          dashboardDataSetting.handleStringHeaders(strings);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <input type="file" accept=".json,application/json" onChange={onChange} />
  );
}
