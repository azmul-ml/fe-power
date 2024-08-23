import { UtilHelper } from "@/utils/helpers";
import { useMemo, useState } from "react";

export default function useColumn(headers: string[]) {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const dynamicColumns: any =
    headers && Array.isArray(headers)
      ? headers.map((item: string) => {
          return {
            accessorKey: item,
            header: UtilHelper.formatString(item),
            size: 150,
            enableEditing: true,
            mantineEditTextInputProps: {
              type: 'email',
              required: true,
              error: validationErrors[item],
              //remove any previous validation errors when user focuses on the input
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  [item]: undefined,
                }),
              //optionally add validation checking for onBlur or onChange
            },
          };
        })
      : [];

  const columns = useMemo(() => [...dynamicColumns], [dynamicColumns, validationErrors]);

  return columns;
}
