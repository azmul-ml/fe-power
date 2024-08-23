import * as React from "react";
import { useLocation } from "react-router-dom";
import { UtilHelper } from "@/utils";
import { useBreadCrumb } from "@/state/breadcrumb";
import { Breadcrumbs, Anchor, Loader } from "@mantine/core";

export default function BreadCrumb() {
  const location = useLocation();

  const { editPageTitle, clearAll } = useBreadCrumb((state: any) => {
    return {
      editPageTitle: state.editPageTitle,
      clearAll: state.clearAll,
    };
  });

  let currentLink = "";

  const crumbItems: string[] = location.pathname.split("/");

  const crumbs = crumbItems.map((crumb: string, index: number) => {
    if (index === 0)
      return {
        title: "Home",
        href: "/",
      };

    if (index === crumbItems.length - 1)
      return {
        title: isNaN(Number(crumb))
          ? UtilHelper.formatString(crumb)
          : editPageTitle ?? <Loader size="small" />,
        href: "#",
      };

    currentLink = currentLink + `/${crumb}`;

    return {
      title: UtilHelper.formatString(crumb),
      href: currentLink,
    };
  });

  React.useEffect(() => {
    clearAll();
  }, [location.pathname]);

  return location.pathname === "/" ? null : (
    <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
      {crumbs.map((item, index) => (
        <Anchor href={item.href} key={index}>
          {item.title}
        </Anchor>
      ))}
    </Breadcrumbs>
  );
}
