import Routers from "@/routers";
import { MantineProvider, createTheme, Notification } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import useUserSettingStore, { UserSettingState } from "@/state/user-setting";

export default function App() {
  const userSettingStore: UserSettingState = useUserSettingStore();

  const theme = createTheme({
    /** Put your mantine theme override here */
    autoContrast: true,
    colors: {
      blue: userSettingStore.colorPlate,
    },
    components: {
      Notification: Notification.extend({
        styles: {
          root: { position: "fixed", top: "60px", left: "40%" },
        },
      }),
    },
  });
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" zIndex={1000} />
      <Routers />
    </MantineProvider>
  );
}
