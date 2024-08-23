import PageFormat from "@/components/page-format/PageFormat";
import useUserSettingStore, { UserSettingState } from "@/state/user-setting";
import { Box, Select, Grid, Title, Divider, NumberInput } from "@mantine/core";

export const themes = [
  { value: "green", label: "Green" },
  { value: "lightBlue", label: "Light Blue" },
  { value: "red", label: "Red" },
];

export default function UserSettingPage() {
  const userSettingStore: UserSettingState = useUserSettingStore();

  return (
    <PageFormat title="User Setting | Data" description="User Setting Page">
      <Box>
        <Title order={3}>Number Setting:</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3, lg: 2 }}>
            <Box>
              <Select
                label="Thousand Separator"
                onChange={(value) =>
                  userSettingStore.handleThousandSeparator(value)
                }
                value={userSettingStore.thousandSeparator}
                data={[",", "."]}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3, lg: 2 }}>
            <Box>
              <Select
                label="Decimal Separator"
                onChange={(value) =>
                  userSettingStore.handleDecimalSeparator(value)
                }
                value={userSettingStore.decimalSeparator}
                data={[",", "."]}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3, lg: 2 }}></Grid.Col>
        </Grid>
      </Box>
      <Divider mt={18} mb={18} />
      <Box>
        <Title order={3}>Chart Setting:</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
            <Box>
              <NumberInput
                min={1}
                max={1000}
                label="Enter value between 1 and 1000"
                value={userSettingStore.itemPerChart}
                onChange={(value: number | string) =>
                  userSettingStore.handleItemPerChart(Number(value))
                }
              />
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3, lg: 2 }}></Grid.Col>
        </Grid>
      </Box>
      <Divider mt={18} mb={18} />

      <Box>
        <Title order={3}>Theme Setting:</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3, lg: 2 }}>
            <Box>
              <Select
                label="Theme Color"
                onChange={(value) => userSettingStore.handleThemeColor(value)}
                value={userSettingStore.themeColor}
                data={themes}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3, lg: 2 }}></Grid.Col>
        </Grid>
      </Box>
    </PageFormat>
  );
}
