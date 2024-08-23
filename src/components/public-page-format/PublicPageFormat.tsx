import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ErrorFallbackUI from "@/components/error-boundary/ErrorBoundary";
import BackgroundImage from "@/components/bg-image/BackgroundImage";
import BG_IMAGE from "@/assets/images/login-bg.jpg";

interface IProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function PublicPageFormat({
  children,
  title,
  description,
}: IProps) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <BackgroundImage
        className="accountbg"
        backgroundImage={`url(${BG_IMAGE})`}
      />
      <ErrorFallbackUI>{children}</ErrorFallbackUI>
    </HelmetProvider>
  );
}
