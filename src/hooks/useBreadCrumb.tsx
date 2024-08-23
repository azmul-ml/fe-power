import * as React from "react";
import { useBreadCrumb } from "@/state/breadcrumb";

/**
 * Hook for adding item name in the breadcrumb
 * @dynamic
 * @hook {function}
 */
const useEditPageTitle = (title: string) => {
  const { addEditPageTitle } = useBreadCrumb((state: any) => {
    return {
      addEditPageTitle: state.addEditPageTitle,
    };
  });

  React.useEffect(() => {
    addEditPageTitle(title);
  }, [title]);

};

export default useEditPageTitle;
