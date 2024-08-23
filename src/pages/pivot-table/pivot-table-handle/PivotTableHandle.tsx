import { useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

export default function App() {
  const [settings, setSettings] = useState({});

  const totalData: any = useLiveQuery(
    async () => await db.dashboardData.toArray(),
    []
  );


  return (
    <div>

      <PivotTableUI
        data={totalData}
        onChange={(s) => setSettings(s)}
        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        {...settings}
        hiddenAttributes={[
          "pvtRenderers",
          "pvtAxisContainer",
          "pvtVals",
          "pvtAxisContainer",
        ]}
      />
    </div>
  );
}
