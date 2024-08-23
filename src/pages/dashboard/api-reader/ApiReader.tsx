import { useEffect, useState, useCallback } from "react";
import { UtilHelper } from "@/utils/helpers";
import { sample, sampleSize } from "lodash";
import useDashboardDataSetting, { menuState } from "@/state/dashboard-setting";
import useImportDataSettingStore, {
  ImportDataSettingState,
} from "@/state/import-data-setting";
import { db } from "@/db";
import qs from "query-string";
import { UtilDataHelper } from "@/utils/data";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Group,
  ActionIcon,
  Flex,
  Select,
  Button,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { randomId } from "@mantine/hooks";

type FieldType = {
  headers: Array<{ header: string; headerValue: string }>;
  queries: Array<{ query: string; queryValue: string }>;
};

export default function ApiReader() {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<string | null>("GET");
  const [url, setUrl] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      headers: [{ header: "", headerValue: "", key: randomId() }],
      queries: [{ query: "", queryValue: "", key: randomId() }],
    },
  });

  const dashboardDataSetting: menuState = useDashboardDataSetting();
  const importDataSettingStore: ImportDataSettingState =
    useImportDataSettingStore();

  const handleForm = async (values: FieldType) => {
    const headers = values?.headers?.reduce((obj: any, item) => {
      obj[item.header] = item.headerValue;
      return obj;
    }, {});

    const queries = values?.queries?.reduce((obj: any, item) => {
      obj[item.query] = item.queryValue;
      return obj;
    }, {});

    let URL = url.split("?")[0];

    const fetchObj: any = {
      method: method,
      headers: {
        Accept: "application/json",
        ...headers,
      },
    };

    if (method === "GET") {
      const params = qs.stringify(queries, { arrayFormat: "index" });
      if (!!params) {
        URL = URL + "?" + params;
      }
    }

    if (method === "POST") {
      fetchObj["body"] = JSON.stringify(queries);
    }

    try {
      setLoading(true);
      const response = await fetch(URL, fetchObj);
      const responseObj = await response.json();

      let data = [];

      if (Array.isArray(responseObj) && responseObj.length > 0) {
        data = responseObj;
      } else {
        if (Object.keys(responseObj).includes("data")) {
          if (
            Array.isArray(responseObj["data"]) &&
            responseObj["data"].length > 0
          ) {
            data = responseObj["data"];
          }
        } else {
          const parseData = UtilDataHelper.parseData(responseObj);
          if (Array.isArray(parseData) && parseData.length > 0) {
            data = parseData;
          }
        }
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const headers = data && Object.keys(data?.[0]);
        const { numbers, strings } = UtilHelper.getNumberStringHeader(
          headers,
          sample(sampleSize(data, 5))
        );

        await db.dashboardData.clear();
        await db.dashboardData.bulkAdd(data);

        dashboardDataSetting.handleViewSelection(1);
        dashboardDataSetting.handleHeaders(headers);
        dashboardDataSetting.handleNumberHeaders(numbers);
        dashboardDataSetting.handleStringHeaders(strings);
      }

      dashboardDataSetting.handleViewSelection(1);
      importDataSettingStore.handleApiUrl(url);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleUrl = useCallback(
    (event: any) => {
      const url: string = event.target.value;
      const urlFormat = url.split("?");
      setUrl(urlFormat[0]);

      if (urlFormat.length === 2) {
        const queryStrings = qs.parse(urlFormat[1]);
        const queries: any = Object.keys(queryStrings).map((key) => {
          return { query: key, queryValue: queryStrings[key] };
        });
        if (queries && Array.isArray(queries)) {
          form.setFieldValue("queries", queries);
        }
      } else {
        form.setFieldValue("queries", []);
      }
    },
    [form]
  );

  const headersComponent = form.getValues().headers.map((item, index) => (
    <Group key={item.key} mt="xs">
      <TextInput
        placeholder="Header"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`headers.${index}.header`)}
        {...form.getInputProps(`headers.${index}.header`)}
      />
      <TextInput
        placeholder="Value"
        withAsterisk
        style={{ flex: 2 }}
        key={form.key(`headers.${index}.headerValue`)}
        {...form.getInputProps(`headers.${index}.headerValue`)}
      />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem("headers", index)}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  const queriesComponent = form.getValues().queries.map((item, index) => (
    <Group key={item.key} mt="xs">
      <TextInput
        placeholder="Query"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`queries.${index}.query`)}
        {...form.getInputProps(`queries.${index}.query`)}
      />
      <TextInput
        placeholder="value"
        withAsterisk
        style={{ flex: 2 }}
        key={form.key(`queries.${index}.queryValue`)}
        {...form.getInputProps(`queries.${index}.queryValue`)}
      />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem("queries", index)}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  useEffect(() => {
    form.setFieldValue("url", importDataSettingStore.apiUrl);
  }, [importDataSettingStore.apiUrl]);

  return (
    <>
      <Flex gap={10}>
        <Select
          data={["GET", "POST"]}
          w={120}
          key={form.key("method")}
          {...form.getInputProps("method")}
          onChange={setMethod}
          value={method}
        />
        <TextInput
          placeholder="URL"
          key={form.key("url")}
          {...form.getInputProps("url")}
          w={"100%"}
          onChange={handleUrl}
        />
      </Flex>

      <form onSubmit={form.onSubmit((values) => handleForm(values))} noValidate>
        {headersComponent}
        <Button
          variant="gradient"
          mt={10}
          onClick={() =>
            form.insertListItem("headers", {
              header: "",
              headerValue: "",
              key: randomId(),
            })
          }
        >
          Add Header
        </Button>

        {queriesComponent}

        <Button
          mt={10}
          variant="gradient"
          onClick={() =>
            form.insertListItem("queries", {
              query: "",
              queryValue: "",
              key: randomId(),
            })
          }
        >
          Add Query
        </Button>

        <Button
          variant="gradient"
          loading={loading}
          type="submit"
          fullWidth
          mt={40}
        >
          Submit
        </Button>
      </form>
    </>
  );
}
