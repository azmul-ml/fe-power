import Chart from "../charts/Chart";
import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import useDashboardDataStore, { menuState } from "@/state/dashboard-setting";
import { db } from "@/db";
import useChartSettingStore, { ChartSettingState } from "@/state/chart-setting";
import { ChartSelectionMode } from "@/constants/chart";
import {
  MultiSelect,
  Checkbox,
  Text,
  Flex,
  Center,
  Title,
  Slider,
  Box,
  Select,
  Grid,
  Menu,
  Button,
  rem,
  Divider,
  Pagination,
  ScrollArea,
  Loader,
  NumberInput,
} from "@mantine/core";
import {
  IconDownload,
  IconSettings,
  IconArrowBarToRight,
  IconArrowBarToLeft,
  IconArrowLeft,
  IconArrowRight,
  IconGripHorizontal,
} from "@tabler/icons-react";
import { MNumberFormatter } from "@/components/number-format/NumberFormat";
import TopInfo from "./TopInfo";
import { useViewportSize, useDebouncedCallback } from "@mantine/hooks";
import { useLayout } from "@/state/layout";
import useUserSettingStore, { UserSettingState } from "@/state/user-setting";

export default function LineChart() {
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useViewportSize();
  const layout = useLayout();
  const isClosed = !layout.desktopOpened && !layout.mobileOpened;
  const dashboardDataStore: menuState = useDashboardDataStore();
  const chartSettingStore: ChartSettingState = useChartSettingStore();
  const userSettingStore: UserSettingState = useUserSettingStore();
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(400);
  const [dataCount, setDataCount] = useState(0);
  const [activePage, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [selectedXValue, setSelectedXValue] = useState<string | null>("");

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  const getData = useCallback(async () => {
    setLoading(true);
    const offset = activePage - 1;
    const data: any = await db.dashboardData
      .offset(offset * userSettingStore.itemPerChart)
      .limit(userSettingStore.itemPerChart)
      .toArray();
    setData(data);
    setLoading(false);
  }, [activePage]);

  const getTotalCount = async () => {
    const count = await db.dashboardData.count();
    setDataCount(count);
  };

  const goToPage = useDebouncedCallback((page: number | string | undefined) => {
    if (!page) return;
    const totalPage = Math.ceil(dataCount / userSettingStore.itemPerChart);
    if (Number(page) > totalPage) {
      setPage(totalPage);
      return;
    }
    if (Number(page) < 1) {
      setPage(1);
      return;
    }
    setPage(Number(page));
  }, 500);

  useEffect(() => {
    if (dataCount && dataCount > 0) {
      setSelectedValue(dashboardDataStore.numberHeaders);
    }
  }, [dataCount]);

  useEffect(() => {
    getData();
  }, [activePage]);

  useEffect(() => {
    setChartWidth(isClosed ? width : width - 180);
  }, [isClosed, width]);

  useEffect(() => {
    getTotalCount();
  }, []);

  const offset = activePage - 1;
  const startIndex = offset * userSettingStore.itemPerChart;
  const lastIndex =
    startIndex + userSettingStore.itemPerChart > dataCount
      ? dataCount
      : startIndex + userSettingStore.itemPerChart;

  return (
    <>
      <TopInfo
        totalDataLength={dataCount}
        perChartData={userSettingStore.itemPerChart}
        chartHeight={chartHeight}
        chartWidth={chartWidth}
      />

      <Divider mt={10} mb={10} />

      <Grid>
        <Grid.Col
          span={{ base: 12, sm: 8, lg: 8 }}
          order={{ base: 2, sm: 1, lg: 8 }}
        >
          <Text>Chart Width:</Text>
          <Slider
            defaultValue={0}
            onChangeEnd={(value: number) => {
              setChartWidth(value);
            }}
            min={0}
            max={100000}
            variant="gradient"
          />
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, sm: 4, lg: 4 }}
          order={{ base: 2, sm: 1, lg: 4 }}
        >
          <Text>Chart Height:</Text>
          <Slider
            defaultValue={0}
            onChangeEnd={(value: number) => {
              setChartHeight(value);
            }}
            min={0}
            max={5000}
            variant="gradient"
          />
        </Grid.Col>
      </Grid>

      <Flex my={10} gap={8} justify="space-between" align="flex-end">
        <Flex gap={16} align="flex-end">
          <Box>
            <MultiSelect
              label={
                <>
                  <Text>
                    {chartSettingStore.rotatedChart
                      ? "Row (X-Axis)"
                      : "Column (Y-Axis)"}
                  </Text>
                </>
              }
              placeholder="Pick value"
              onChange={(value) => {
                setSelectedValue(value);
              }}
              value={selectedValue}
              data={dashboardDataStore.numberHeaders ?? []}
            />
          </Box>
          <Box>
            <Select
            miw={200}
              label={
                <Text>
                  {chartSettingStore.rotatedChart
                    ? "Column (Y-Axis)"
                    : "Row (X-Axis)"}
                </Text>
              }
              placeholder="X Field"
              onChange={setSelectedXValue}
              value={selectedXValue}
              data={dashboardDataStore.stringHeaders ?? []}
            />
          </Box>

          <Checkbox
            label="Rotate Chart"
            checked={chartSettingStore.rotatedChart}
            onChange={(event) =>
              chartSettingStore.handleRotatedChart(event.target.checked)
            }
            miw={130}
          />
        </Flex>

        <Menu
          shadow="md"
          width={200}
          trigger="hover"
          openDelay={100}
          closeDelay={400}
        >
          <Menu.Target>
            <Button variant="gradient">
              <IconSettings />
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconDownload style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={onButtonClick}
            >
              Downalod PNG Image
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <Divider mt={10} mb={10} />

      <Flex gap={20} my={20} justify={"center"} align={"center"}>
        <Pagination
          total={Math.ceil(dataCount / userSettingStore.itemPerChart)}
          siblings={1}
          defaultValue={1}
          boundaries={3}
          value={activePage}
          withEdges
          onChange={setPage}
          nextIcon={IconArrowRight}
          previousIcon={IconArrowLeft}
          firstIcon={IconArrowBarToLeft}
          lastIcon={IconArrowBarToRight}
          dotsIcon={IconGripHorizontal}
        />
        <NumberInput
          placeholder="Goto Page"
          min={1}
          w={120}
          onChange={goToPage}
        />
      </Flex>

      {loading ? (
        <Center h={400}>
          <Loader />
        </Center>
      ) : (
        <Box mt={8} ref={ref}>
          <Center>
            <Flex justify="flex-start" align="flex-start" gap="lg" wrap="wrap">
              <Box>
                <Text size="xs" ta="center">
                  Start Index
                </Text>
                <Title order={1} size="xs" ta="center">
                  <MNumberFormatter value={startIndex} />
                </Title>
              </Box>
              <Box>
                <Text size="xs" ta="center">
                  End Index
                </Text>
                <Title order={1} size="xs" ta="center">
                  <MNumberFormatter value={lastIndex} />
                </Title>
              </Box>
              <Box>
                <Text size="xs" ta="center">
                  Total Data Items
                </Text>
                <Title order={1} size="xs" ta="center">
                  <MNumberFormatter value={lastIndex - startIndex} />
                </Title>
              </Box>
            </Flex>
          </Center>
          <ScrollArea w={isClosed ? width : width - 180}>
            <Chart
              id={`common-chart-${offset}`}
              size={{
                height: chartHeight,
                width: chartWidth,
              }}
              data={{
                json: data,
                keys: {
                  x: selectedXValue,
                  value: selectedValue,
                },
                type:
                  chartSettingStore.selectedChart ===
                  ChartSelectionMode.COMBINATION_CHART
                    ? "bar"
                    : chartSettingStore.selectedChart,
              }}
              grid={{
                x: {
                  show: true,
                },
                y: {
                  show: true,
                },
              }}
              axis={{
                rotated: chartSettingStore.rotatedChart,
                x: {
                  type: "category",
                },
              }}
            />
          </ScrollArea>
        </Box>
      )}
    </>
  );
}
