import { Outlet } from "react-router-dom";
import MenuList from "./navbar/Navbar";
import { AppShell, Burger, Group, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Tooltip,
  SegmentedControl,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import cx from "clsx";
import { useTranslation } from "react-i18next";
import classes from "./Layout.module.scss";
// import LOGO from "@/assets/images/logo.png";
import DataHandler from "@/pages/dashboard/data-handle";
import { PRIVATE_ROUTERS } from "@/routers/private";
import { useNavigate, useLocation } from "react-router-dom";
import SelectChart from "@/components/select-chart/SelectChart";
import { useLayout } from "@/state/layout";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const layout = useLayout();
  const { setColorScheme } = useMantineColorScheme();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [checked, setChecked] = useState(false);
  const [viewSelection, setViewSelection] = useState(location.pathname);

  const {
    i18n: { changeLanguage },
  } = useTranslation();

  const handleChangeLanguage = (event: any) => {
    setChecked(event.currentTarget.checked);
    changeLanguage(event.currentTarget.checked ? "cn" : "en");
  };

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    setViewSelection(viewSelection);
    navigate(viewSelection);
  }, [viewSelection]);

  useEffect(() => {
    setViewSelection(location.pathname);
    navigate(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    layout.handleDesktopOpened(desktopOpened);
    layout.handleMobileOpened(mobileOpened);
  }, [mobileOpened, desktopOpened]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 180,
        breakpoint: "md",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="sm"
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="sm">
          <Group h="100%">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="md"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="md"
              size="sm"
            />
            {/* <Image radius="md" h={40} w="auto" fit="contain" src={LOGO} /> */}
            <DataHandler />
            <SelectChart />
          </Group>
          <Group visibleFrom="sm">
            <SegmentedControl
              value={viewSelection}
              onChange={setViewSelection}
              data={[
                {
                  label: PRIVATE_ROUTERS.DASHBOARD_SCREEN.title,
                  value: PRIVATE_ROUTERS.DASHBOARD_SCREEN.path,
                },
                {
                  label: PRIVATE_ROUTERS.CHARTS_SCREEN.title,
                  value: PRIVATE_ROUTERS.CHARTS_SCREEN.path,
                },
                {
                  label: PRIVATE_ROUTERS.PIVOT_TABLE_SCREEN.title,
                  value: PRIVATE_ROUTERS.PIVOT_TABLE_SCREEN.path,
                },
              ]}
            />
          </Group>
          <Group>
            <Tooltip label="Language Switch" refProp="rootRef">
              <Switch
                checked={checked}
                size="lg"
                onLabel="CN"
                offLabel="EN"
                onChange={(event) => handleChangeLanguage(event)}
              />
            </Tooltip>
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                )
              }
              variant="default"
              size="xl"
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === "dark" ? (
                <IconSun
                  className={cx(classes.icon, classes.light)}
                  stroke={1.5}
                />
              ) : (
                <IconMoon
                  className={cx(classes.icon, classes.dark)}
                  stroke={1.5}
                />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        <MenuList />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
