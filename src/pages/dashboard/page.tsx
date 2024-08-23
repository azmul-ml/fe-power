import PageFormat from "@/components/page-format/PageFormat";
import ChartDataTable from "@/pages/dashboard/mantine-table/Table";
import { ModalsProvider } from "@mantine/modals";

export default function DashboardPage() {
  return (
    <PageFormat title="Dashboard | Dashboard" description="Dashboard Page">
      <ModalsProvider>
        <ChartDataTable />
      </ModalsProvider>
    </PageFormat>
  );
}
