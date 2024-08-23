// @ts-ignore
// @ts-nocheck
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //make sure MRT styles were imported in your app root (once)
import {
  MRT_EditActionButtons,
  MantineReactTable,
  useMantineReactTable,
  type MRT_Row,
  type MRT_SortingState,
  type MRT_RowVirtualizer,
  type MRT_TableOptions,
} from "mantine-react-table";
import { Box, Button } from "@mantine/core";
import { IconDownload, IconPlus } from "@tabler/icons-react";
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here
import { db } from "@/db";
// import { useLiveQuery } from "dexie-react-hooks";
import { useState, useEffect, useRef, useMemo } from "react";
import useDashboardDataStore, { menuState } from "@/state/dashboard-setting";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import {
  Radio,
  Group,
  Text,
  Stack,
  Title,
  Flex,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { UtilHelper } from "@/utils/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { modals } from "@mantine/modals";
import { isNumber } from "lodash";
import { MNumberFormatter } from "@/components/number-format/NumberFormat";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const ChartTable = () => {
  //optionally access the underlying virtualizer instance
  const queryClient = useQueryClient();
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const columnVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableCellElement>>(null);

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50, //customize the default page size
  });
  const [format, setFormat] = useState("csv");
  const dashboardDataStore: menuState = useDashboardDataStore();
  const [columnsName, setColumnsName] = useState<any>([]);

  // const totalData: any = useLiveQuery(
  //   async () => await db.dashboardData.toArray(),
  //   []
  // );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
  const handleCreateUser: MRT_TableOptions<any>["onCreatingRowSave"] = async ({
    values,
    exitCreatingMode,
  }) => {
    // const newValidationErrors = validateUser(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    setValidationErrors({});
    await createUser(values);
    exitCreatingMode();
  };

  //UPDATE action
  const handleSaveUser: MRT_TableOptions<any>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    // const newValidationErrors = validateUser(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<any>) =>
    modals.openConfirmModal({
      title: "Are you sure you want to delete this item?",
      children: (
        <Text>
          Are you sure you want to delete this item ? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteUser(row.original.id),
    });

  const dynamicColumns: any =
    columnsName && Array.isArray(columnsName)
      ? columnsName.map((item: string) => {
          return {
            accessorKey: item,
            header: UtilHelper.formatString(item),
            size: 180,
            enableEditing: true,
            mantineEditTextInputProps: {
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
            Cell: ({ renderedCellValue, row }) => {
              const item = Number(renderedCellValue);
              return (
                <span>
                  {isNaN(item) ? (
                    renderedCellValue
                  ) : (
                    <MNumberFormatter value={Number(renderedCellValue)} />
                  )}
                </span>
              );
            },
          };
        })
      : [];

  const columns: any = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        enableEditing: false,
        size: 80,
      },
      ...dynamicColumns,
    ],
    [dynamicColumns, validationErrors]
  );

  const handleExportRows = (rows: MRT_Row<any>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(fetchedUsers);
    download(csvConfig)(csv);
  };

  const handlePdfExportRows = (rows: MRT_Row<any>[]) => {
    const doc = new jsPDF();
    const tableData: any = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("pdf-data.pdf");
  };

  const table =
    fetchedUsers &&
    useMantineReactTable({
      data: fetchedUsers,
      columns: columns,
      enableRowSelection: true,
      columnFilterDisplayMode: "popover",
      paginationDisplayMode: "pages",
      positionToolbarAlertBanner: "bottom",
      enableBottomToolbar: true,
      enableColumnResizing: true,
      enableColumnVirtualization: true,
      enableRowVirtualization: true,
      enableGlobalFilterModes: true,
      enablePagination: true,
      enableColumnPinning: true,
      enableRowNumbers: false,
      enableGrouping: true,
      enableStickyFooter: true,
      enableRowVirtualization: true,
      columnVirtualizerInstanceRef, //optional
      columnVirtualizerProps: { overscan: 5, estimateSize: () => 400 }, //optionally customize the virtualizer
      onSortingChange: setSorting,
      initialState: { showColumnFilters: true },
      state: {
        sorting,
        pagination,
        isLoading: isLoadingUsers,
        isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
        showAlertBanner: isLoadingUsersError,
        showProgressBars: isFetchingUsers,
      },
      rowVirtualizerInstanceRef, //optional
      rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
      columnVirtualizerOptions: { overscan: 4 }, //optionally customize the column virtualizer
      createDisplayMode: "modal", //default ('row', and 'custom' are also available)
      editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
      enableEditing: true,
      rowVirtualizerProps: {
        overscan: 10, //adjust the number or rows that are rendered above and below the visible area of the table
        estimateSize: () => 100, //if your rows are taller than normal, try tweaking this value to make scrollbar size more accurate
      },
      getRowId: (row) => row.id,

      mantineToolbarAlertBannerProps: isLoadingUsersError
        ? {
            color: "red",
            children: "Error loading data",
          }
        : undefined,
      mantinePaginationProps: {
        rowsPerPageOptions: [
          "50",
          "100",
          "500",
          "1000",
          "1500",
          "2000",
          "2500",
          "3000",
          "3500",
          "4000",
          "4500",
          "5000",
          "7000",
          "10000",
        ],
        style: { maxHeight: "600px" },
      },
      onCreatingRowCancel: () => setValidationErrors({}),
      onCreatingRowSave: handleCreateUser,
      onEditingRowCancel: () => setValidationErrors({}),
      onEditingRowSave: handleSaveUser,
      onPaginationChange: setPagination, //hoist pagination state to your state when it changes internally
      renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
        <Stack>
          <Title order={3}>Create New Item</Title>
          {internalEditComponents}
          <Flex justify="flex-end" mt="xl">
            <MRT_EditActionButtons variant="text" table={table} row={row} />
          </Flex>
        </Stack>
      ),
      renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
        <Stack>
          <Title order={3}>Edit Item</Title>
          {internalEditComponents}
          <Flex justify="flex-end" mt="xl">
            <MRT_EditActionButtons variant="text" table={table} row={row} />
          </Flex>
        </Stack>
      ),
      renderRowActions: ({ row, table }) => (
        <Flex gap={2}>
          <Tooltip label="Edit">
            <ActionIcon w={15} onClick={() => table.setEditingRow(row)}>
              <IconEdit />
            </ActionIcon>
          </Tooltip>
          <Tooltip w={15} label="Delete">
            <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),
      renderTopToolbarCustomActions: ({ table }) => (
        <Box
          style={{
            display: "flex",
            gap: "16px",
            padding: "8px",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="gradient"
            leftSection={<IconPlus />}
            onClick={() => {
              table.setCreatingRow(true);
            }}
          >
            Create New Item
          </Button>

          {format === "pdf" ? (
            <>
              <Button
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                //export all rows, including from the next page, (still respects filtering and sorting)
                onClick={() =>
                  handlePdfExportRows(table.getPrePaginationRowModel().rows)
                }
                leftSection={<IconDownload />}
                variant="gradient"
              >
                Export All Rows
              </Button>
              <Button
                disabled={table.getRowModel().rows.length === 0}
                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                onClick={() => handlePdfExportRows(table.getRowModel().rows)}
                leftSection={<IconDownload />}
                variant="gradient"
              >
                Export Page Rows
              </Button>
              <Button
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                //only export selected rows
                onClick={() =>
                  handlePdfExportRows(table.getSelectedRowModel().rows)
                }
                leftSection={<IconDownload />}
                variant="gradient"
              >
                Export Selected Rows
              </Button>
            </>
          ) : (
            <>
              <Button
                color="lightblue"
                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                onClick={handleExportData}
                leftSection={<IconDownload />}
                variant="gradient"
              >
                Export All Data
              </Button>
              <Button
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                //export all rows, including from the next page, (still respects filtering and sorting)
                onClick={() =>
                  handleExportRows(table.getPrePaginationRowModel().rows)
                }
                leftSection={<IconDownload />}
                variant="gradient"
              >
                Export All Rows
              </Button>
              <Button
                disabled={table.getRowModel().rows.length === 0}
                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                onClick={() => handleExportRows(table.getRowModel().rows)}
                leftSection={<IconDownload />}
                variant="gradient"
              >
                Export Page Rows
              </Button>
              <Button
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                //only export selected rows
                onClick={() =>
                  handleExportRows(table.getSelectedRowModel().rows)
                }
                leftSection={<IconDownload />}
                variant="gradient"
              >
                Export Selected Rows
              </Button>
            </>
          )}
        </Box>
      ),
    });

  //CREATE hook (post new user to api)
  function useCreateUser() {
    return useMutation({
      mutationFn: async (item: any) => {
        //send api update request here
        await db.dashboardData.add({
          ...item,
        });
        return Promise.resolve();
      },
      //client side optimistic update
      onMutate: (newUserInfo: any) => {
        queryClient.setQueryData(
          ["users"],
          (prevUsers: any) =>
            [
              ...prevUsers,
              {
                ...newUserInfo,
                id: (Math.random() + 1).toString(36).substring(7),
              },
            ] as any[]
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
    });
  }

  //READ hook (get users from api)
  function useGetUsers() {
    return useQuery<any[]>({
      queryKey: ["users"],
      queryFn: async () => {
        //send api request here
        const totalData: any = await db.dashboardData.toArray();
        return Promise.resolve(totalData);
      },
      refetchOnWindowFocus: false,
    });
  }

  //UPDATE hook (put user in api)
  function useUpdateUser() {
    return useMutation({
      mutationFn: async (item: any) => {
        //send api update request here
        await db.dashboardData.put({
          ...item,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
        return Promise.resolve();
      },
      //client side optimistic update
      onMutate: (newUserInfo: any) => {
        queryClient.setQueryData(["users"], (prevUsers: any) =>
          prevUsers?.map((prevUser: any) =>
            prevUser.id === newUserInfo.id ? newUserInfo : prevUser
          )
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
    });
  }

  //DELETE hook (delete user in api)
  function useDeleteUser() {
    return useMutation({
      mutationFn: async (id: number) => {
        //send api update request here
        if (id) {
          await db.dashboardData.delete(id);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
        return Promise.resolve();
      },
      //client side optimistic update
      onMutate: (id: any) => {
        queryClient.setQueryData(["users"], (prevUsers: any) =>
          prevUsers?.filter((user: any) => user.id !== id)
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
    });
  }

  useEffect(() => {
    setColumnsName(dashboardDataStore.headers);
  }, [dashboardDataStore.headers]);

  useEffect(() => {
    try {
      //scroll to the top of the table when the sorting changes
      rowVirtualizerInstanceRef.current?.scrollToIndex(0);
    } catch (e) {
      console.log(e);
    }
  }, [sorting]);

  return (
    <>
      <Radio.Group
        name="format"
        withAsterisk
        value={format}
        onChange={setFormat}
        mt={0}
      >
        <Group mb="xs">
          <Radio value="csv" label="Download CSV" />
          <Radio value="pdf" label="Download PDF" />
        </Group>
      </Radio.Group>

      <MantineReactTable table={table} />
    </>
  );
};

export default ChartTable;
