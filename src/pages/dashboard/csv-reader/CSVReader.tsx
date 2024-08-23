import { useState, CSSProperties } from "react";
import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";
import { UtilHelper } from "@/utils/helpers";
import { sample, sampleSize } from "lodash";
import useDashboardDataStore, { menuState } from "@/state/dashboard-setting";
import { db } from "@/db";
import { useQueryClient } from "@tanstack/react-query";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const styles = {
  zone: {
    alignItems: "center",
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    height: 100,
    justifyContent: "center",
    padding: 2,
  } as CSSProperties,
  file: {
    background: "linear-gradient(to bottom, #EEE, #DDD)",
    borderRadius: 20,
    display: "flex",
    height: 110,
    width: "100%",
    position: "relative",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
  } as CSSProperties,
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
  } as CSSProperties,
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
  } as CSSProperties,
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  zoneHover: {
    borderColor: GREY_DIM,
  } as CSSProperties,
  default: {
    borderColor: GREY,
  } as CSSProperties,
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  } as CSSProperties,
};

export default function CSVReader() {
  const queryClient = useQueryClient();
  const dashboardDataStore: menuState = useDashboardDataStore();
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  async function csvArrayToJson(csvArray: any[]) {
    /**
     * Convert CSV data in array of arrays format to JSON.
     *
     * @param {Array<Array<string>>} csvArray - Array of arrays representing CSV data.
     * @return {string} - JSON string representation of the CSV data.
     */
    try {
      const [headers, ...rows] = csvArray;
      const jsonArray = rows.map((row) => {
        const jsonObject: any = {};
        row.forEach((cell: any, index: number) => {
          jsonObject[headers[index]] = cell;
        });
        return jsonObject;
      });
      const data: any[] = JSON.parse(JSON.stringify(jsonArray, null, 4));
      const { numbers, strings } = UtilHelper.getNumberStringHeader(
        headers,
        sample(sampleSize(data, 5))
      );

      // const indexed = headers.join(",");
      // db.version(1).stores({
      //   dashboardData: `++id, ${indexed}`, // Primary key and indexed props
      // });

      await db.dashboardData.clear();
      await db.dashboardData.bulkAdd(data);

      dashboardDataStore.handleHeaders(headers);
      dashboardDataStore.handleNumberHeaders(numbers);
      dashboardDataStore.handleStringHeaders(strings);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error: any) {
      return `An error occurred: ${error.message}`;
    }
  }

  return (
    <>
      <CSVReader
        onUploadAccepted={(results: any) => {
          csvArrayToJson(results.data);
          setZoneHover(false);
        }}
        onDragOver={(event: DragEvent) => {
          event.preventDefault();
          setZoneHover(true);
        }}
        onDragLeave={(event: DragEvent) => {
          event.preventDefault();
          setZoneHover(false);
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
          Remove,
        }: any) => (
          <>
            <div
              {...getRootProps()}
              style={Object.assign(
                {},
                styles.zone,
                zoneHover && styles.zoneHover
              )}
            >
              {acceptedFile ? (
                <>
                  <div style={styles.file}>
                    <div style={styles.info}>
                      <span style={styles.size}>
                        {formatFileSize(acceptedFile.size)}
                      </span>
                      <span style={styles.name}>{acceptedFile.name}</span>
                    </div>
                    <div style={styles.progressBar}>
                      <ProgressBar />
                    </div>
                    <div
                      {...getRemoveFileProps()}
                      style={styles.remove}
                      onMouseOver={(event: Event) => {
                        event.preventDefault();
                        setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                      }}
                      onMouseOut={(event: Event) => {
                        event.preventDefault();
                        setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                      }}
                    >
                      <Remove color={removeHoverColor} />
                    </div>
                  </div>
                </>
              ) : (
                <div>Drop CSV file here or click to upload</div>
              )}
            </div>
          </>
        )}
      </CSVReader>
      {/* <Flex justify="center" className="mt-2">
        <Button type="primary" size="small" onClick={clearTableDate}>
          <ClearOutlined /> Clear All Data
        </Button>
      </Flex> */}
    </>
  );
}
