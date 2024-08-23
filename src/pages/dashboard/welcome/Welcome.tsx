import { Title, Text, Anchor, Button, Center, Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";
import ShareAnimation from "@/assets/animations/share.json";
import classes from "./Welcome.module.scss";

export default function Welcome() {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        {t("dashboard.headerTitle", {
          appName: language === "cn" ? "中国" : "Dashboard",
        })}
        <Button variant="gradient" gradient={{ from: "pink", to: "yellow" }}>
          Mantine
        </Button>
      </Title>
      <Center h={100} mt={20}>
        <Box bg="var(--mantine-color-blue-light)">
          <Lottie
            style={{ width: 200, height: 100 }}
            animationData={ShareAnimation}
            loop
          />
        </Box>
      </Center>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This starter Vite project includes a minimal setup, if you want to learn
        more on Mantine + Vite integration follow{" "}
        <Anchor href="https://mantine.dev/guides/vite/" size="lg">
          this guide
        </Anchor>
        . To get started edit pages/Home.page.tsx file.
      </Text>
    </>
  );
}
