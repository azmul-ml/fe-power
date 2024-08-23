import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, ScrollArea } from "@mantine/core";
import {
  LineChartOutlined,
  FieldTimeOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  RadarChartOutlined,
  StockOutlined,
  DotChartOutlined,
  FundOutlined,
} from "@ant-design/icons";
import { ChartSelectionMode } from "@/constants/chart";
import useChartSettingStore, { ChartSettingState } from "@/state/chart-setting";
import { Radio, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconChartArea } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { PRIVATE_ROUTERS } from "@/routers/private";

export default function SelectChart() {
  const location = useLocation();
  const chartSettingStore: ChartSettingState = useChartSettingStore();

  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<any>(chartSettingStore.selectedChart);

  useEffect(() => {
    chartSettingStore.handleSelectedChart(value);
  }, [value]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Select your favorite chart"
        scrollAreaComponent={ScrollArea.Autosize}
        size={300}
      >
        <Radio.Group
          value={value}
          onChange={setValue}
          name="favoriteFramework"
          withAsterisk
        >
          <Stack gap={6}>
            <Radio
              value={ChartSelectionMode.LINE_CHART}
              label={
                <b>
                  <LineChartOutlined /> Line Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.AREA_CHART}
              label={
                <b>
                  <AreaChartOutlined /> Area Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.AREA_STEP_CHART}
              label={
                <b>
                  <AreaChartOutlined /> Area Stacked Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.AREA_SPLINE_CHART}
              label={
                <b>
                  <AreaChartOutlined /> Area Spline Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.BAR_CHART}
              label={
                <b>
                  <BarChartOutlined /> Bar Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.PIE_CHART}
              label={
                <b>
                  <PieChartOutlined /> Pie Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.SPLINE_CHART}
              label={
                <b>
                  <StockOutlined /> Spline Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.GAUGE_CHART}
              label={
                <b>
                  <RadarChartOutlined /> Gauge Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.DNOUT_CHART}
              label={
                <b>
                  <PieChartOutlined /> Dnout Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.SCATTER_PLOT_CHART}
              label={
                <b>
                  <DotChartOutlined /> Plot Chart
                </b>
              }
            />
            <Radio
              value={ChartSelectionMode.COMBINATION_CHART}
              label={
                <b>
                  <FundOutlined /> Combination Chart
                </b>
              }
            />

            <Radio
              value={ChartSelectionMode.TIME_SERIES_CHART}
              label={
                <b>
                  <FieldTimeOutlined /> Time Series Chart
                </b>
              }
            />
          </Stack>
        </Radio.Group>
      </Modal>

      {PRIVATE_ROUTERS.CHARTS_SCREEN.path === location.pathname && (
        <Button
          variant="gradient"
          leftSection={<IconChartArea />}
          onClick={open}
        >
          Select Chart
        </Button>
      )}
    </>
  );
}
