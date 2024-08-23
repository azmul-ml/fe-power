import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Title,
  Paper,
  Group,
  Button,
  Checkbox,
  Anchor,
  Stack,
  Image,
  Center,
  Text,
  Divider,
  PaperProps,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import * as authApi from "@/identity/apis";
import { saveTokens, saveRolesPermissions } from "@/identity/helpers";
import { UserPermissions, UserRoles } from "@/identity/scopes";
import { useNavigate, useLocation } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import classes from "./page.module.scss";
import PublicPageFormat from "@/components/public-page-format/PublicPageFormat";
import { AuthFieldsType } from "./type";
import { GoogleButton } from "./GoogleIcon";
import { TwitterButton } from "./TwitterButton";
import { useViewportSize } from "@mantine/hooks";

export default function SignIn(props: PaperProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { height } = useViewportSize();
  const [type, toggle] = useToggle(["login", "register"]);

  const successRedirectUrl: string = location.state?.from?.pathname ?? "/";

  const userLogin = useMutation({
    mutationFn: authApi.loginUser,
  });

  const userRegister = useMutation({
    mutationFn: authApi.registerUser,
  });

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) =>
        /^\S+@\S+$/.test(val) || type === "login" ? null : "Invalid email",
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
    },
  });

  function handleForm(values: AuthFieldsType) {
    try {
      type === "register"
        ? userRegister.mutate(values, {
            onSuccess: (response) => {
              const accessToken = response.data.jwt;
              const refreshToken = response.data.jwt;
              // const decoded: JwtPayload = jwtDecode(accessToken);

              saveTokens(accessToken, refreshToken, response.data?.user);
              saveRolesPermissions(
                [UserRoles.USER],
                [UserPermissions.TEST_READ]
              );
              navigate(successRedirectUrl);
            },

            onError: (err: any) => {
              const errorMessage = err?.response?.data?.error?.message;
              notifications.show({
                color: "red",
                title: errorMessage,
                id: errorMessage,
                message: "Error",
                classNames: classes,
              });
            },
          })
        : userLogin.mutate(
            { ...values, identifier: values?.username },
            {
              onSuccess: (response) => {
                const accessToken = response.data.jwt;
                const refreshToken = response.data.jwt;

                saveTokens(accessToken, refreshToken, response.data?.user);
                saveRolesPermissions(
                  [UserRoles.USER],
                  [UserPermissions.TEST_READ]
                );
                navigate(successRedirectUrl);
              },
              onError: (err: any) => {
                const errorMessage = err?.response?.data?.error?.message;
                notifications.show({
                  color: "red",
                  title: errorMessage,
                  id: errorMessage,
                  message: "Error",
                  classNames: classes,
                });
              },
            }
          );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <PublicPageFormat
      title="Lozo Authentication"
      description="Lozo Authentication"
    >
      <Center h={height}>
        <Paper w={450} radius="md" p="xl" withBorder {...props}>
          <Text size="lg" fw={500}>
            Welcome to Data Monkey, {type} with
          </Text>

          <Group grow mb="md" mt="md">
            <GoogleButton size="md" radius="xl">
              Google
            </GoogleButton>
            <TwitterButton size="md" radius="xl">
              Twitter
            </TwitterButton>
          </Group>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />

          <form onSubmit={form.onSubmit((values) => handleForm(values))}>
            <Stack>
              <TextInput
                required
                size="md"
                label={type === "login" ? "Name or Email" : "Name"}
                placeholder={
                  type === "login" ? "Your name or email" : "Your name"
                }
                value={form.values.username}
                onChange={(event) =>
                  form.setFieldValue("username", event.currentTarget.value)
                }
                radius="md"
              />
              {type === "register" && (
                <>
                  <TextInput
                    required
                    label="Email"
                    placeholder="hello@mantine.dev"
                    value={form.values.email}
                    size="md"
                    onChange={(event) =>
                      form.setFieldValue("email", event.currentTarget.value)
                    }
                    error={form.errors.email && "Invalid email"}
                    radius="md"
                  />
                </>
              )}

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                size="md"
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  "Password should include at least 6 characters"
                }
                radius="md"
              />

              {type === "register" && (
                <Checkbox
                  required
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                />
              )}
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor
                component="button"
                type="button"
                c="dimmed"
                onClick={() => {
                  form.reset();
                  toggle();
                }}
                size="xs"
              >
                {type === "register"
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Anchor>
              <Button
                loading={userRegister.isPending || userLogin.isPending}
                type="submit"
                radius="xl"
                fullWidth
                size="md"
                variant="filled"
              >
                {upperFirst(type)}
              </Button>
            </Group>
          </form>
        </Paper>
      </Center>
    </PublicPageFormat>
  );
}
