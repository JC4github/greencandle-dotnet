import { useEffect, useState } from "react";
import { LineChart } from "@tremor/react";
import { GetChartData } from "../../../static/util/api";
import { ChartInstanceInfo } from "../../../types/entities";

export default function Chart({
  tickerSymbol,
  period,
}: {
  tickerSymbol: string;
  period: string;
}) {
  const [chartData, setChartData] = useState<ChartInstanceInfo[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await GetChartData(tickerSymbol, period);
      if (response) setChartData(response);
    }

    fetchData();
  }, [tickerSymbol, period]);
    return (
        <div  style={{
          width: '100%',
          height: '300px',
          minWidth: '300px',  // Ensures a minimum width
          minHeight: '300px', // Ensures a minimum height
        }}>
            <LineChart
      className="h-72"
      data={chartData}
      index="Date"
      yAxisWidth={60}
      categories={["Price"]}
      colors={["indigo"]}
      valueFormatter={valueFormatter}
      autoMinValue={true}
      tickGap={72}
    />
        </div>
    );
  }

const valueFormatter = function (number: number) {
  return "$ " + new Intl.NumberFormat("us").format(number).toString();
};
