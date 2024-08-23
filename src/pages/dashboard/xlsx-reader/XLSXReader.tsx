import * as XLSX from 'xlsx';
import useDashboardDataSetting, { menuState } from "@/state/dashboard-setting";
import { UtilHelper } from "@/utils/helpers";
import { sample, sampleSize } from "lodash";
import { db } from "@/db";

export default function XLSXReader() {
  const dashboardDataSetting: menuState = useDashboardDataSetting();

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event: any) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data: any = XLSX.utils.sheet_to_json(sheet);

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
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}
