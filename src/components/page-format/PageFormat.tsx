import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ErrorFallbackUI from "@/components/error-boundary/ErrorBoundary";

interface IProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function PageFormat({ children, title, description }: IProps) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <ErrorFallbackUI>{children}</ErrorFallbackUI>
    </HelmetProvider>
  );
}
