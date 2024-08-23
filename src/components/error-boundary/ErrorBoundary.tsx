"use client";

import React from "react";
import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { ErrorBoundary } from "react-error-boundary";

interface IProps {
  children: React.ReactNode;
}

const Fallback = ({ error }: any) => {
  const icon = <IconInfoCircle />;

  return (
    <Alert variant="light" color="red" title="Error Info:" icon={icon}>
      {error.message}
    </Alert>
  );
};

const ErrorFallbackUI = ({ children }: IProps) => {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
};

export default ErrorFallbackUI;
