import { Title, Text, Button, Container, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { PUBLIC_ROUTERS } from "@/routers/public";
import { PRIVATE_ROUTERS } from "@/routers/private";
import classes from "./page.module.scss";
import { isAuthenticated } from "@/identity/helpers";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
      <Group justify="center">
        <Button
          variant="subtle"
          size="md"
          onClick={() =>
            navigate(
              isAuthenticated()
                ? PRIVATE_ROUTERS.DASHBOARD_SCREEN.path
                : PUBLIC_ROUTERS.AUTHENTICATION_SCREEN.path
            )
          }
        >
          Take me back to {isAuthenticated() ? "home" : "login"} page
        </Button>
      </Group>
    </Container>
  );
}
