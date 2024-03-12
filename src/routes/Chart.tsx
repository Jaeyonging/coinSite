import { BarChart } from "@mui/x-charts";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";

export const Chart = () => {
  const coinState = useSelector((state: RootState) => state.coin);

  const sortedCoins = Object.values(coinState).sort(
    (a, b) => b.absValue - a.absValue
  );

  const top3Coins = sortedCoins.slice(0, 3);

  const chartData = {
    xAxis: [
      {
        id: "barCategories",
        data: top3Coins.map((coin) => coin.koreanName),
        scaleType: "band" as const,
      },
    ],
    series: [
      {
        data: top3Coins.map((coin) => coin.absValue),
      },
    ],
  };

  return (
    <div className="HomeDiv">
      <BarChart
        xAxis={chartData.xAxis}
        series={chartData.series}
        width={500}
        height={300}
      />
    </div>
  );
};
