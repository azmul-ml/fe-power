import PageFormat from "@/components/page-format/PageFormat";
import PivotTable from "@/pages/pivot-table/pivot-table-handle/PivotTableHandle";
import TotalCount from "./total-count/TotalCount";

export default function ChartsPage() {
  return (
    <PageFormat title="Pivot Table | Data" description="Pivot Table Page">
      <TotalCount />
      <PivotTable />
    </PageFormat>
  );
}
