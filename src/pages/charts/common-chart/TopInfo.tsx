import { Text, Flex, Center, Title, Box } from "@mantine/core";
import { MNumberFormatter } from "@/components/number-format/NumberFormat";

interface IProps {
  totalDataLength: number;
  perChartData: number;
  chartWidth: number | null;
  chartHeight: number | null;
}

export default function TopInfo({
  totalDataLength,
  perChartData,
  chartHeight,
  chartWidth,
}: IProps) {
  return (
    <Center>
      <Flex justify="flex-start" align="flex-start" gap="lg" wrap="wrap">
        <Box>
          <Text size="xs" ta="center">
            Total Data Items
          </Text>
          <Title order={1} size="xs" ta="center">
            <MNumberFormatter value={totalDataLength} />
          </Title>
        </Box>
        <Box>
          <Text size="xs" ta="center">
            Per Chart Data Limit
          </Text>
          <Title order={1} size="xs" ta="center">
            <MNumberFormatter value={perChartData} />
          </Title>
        </Box>
        <Box>
          <Text size="xs" ta="center">
            Chart Width
          </Text>
          <Title order={1} size="xs" ta="center">
            {`${chartWidth === 0 ? "auto" : `${chartWidth}px`}`}
          </Title>
        </Box>
        <Box>
          <Text size="xs" ta="center">
            Chart Height
          </Text>
          <Title order={1} size="xs" ta="center">
            {`${chartHeight === 0 ? "auto" : `${chartHeight}px`}`}
          </Title>
        </Box>
      </Flex>
    </Center>
  );
}
