import React from 'react';
import { ChartConfigShape } from './hooks/useChartConfig';
import { ChartDataShape } from './hooks/useCoinChartData';

interface ChartDesktopXAxisProps {
  chartConfig: ChartConfigShape;
  chartData: ChartDataShape;
}

const ChartDesktopXAxis = ({ chartConfig, chartData }: ChartDesktopXAxisProps) => {
  const { padding, chartHeight, candleSpacing } = chartConfig;
  const { labels, candles } = chartData;
  const tickCount = Math.min(10, candles.length);
  const step = Math.max(1, Math.floor(candles.length / tickCount));

  return (
    <>
      {labels.map((label, index) => {
        if (index % step !== 0 && index !== labels.length - 1) return null;
        const x = padding.left + index * candleSpacing + candleSpacing / 2;
        return (
          <text
            key={index}
            x={x}
            y={chartHeight - padding.bottom + 20}
            textAnchor="middle"
            fontSize={11}
            fill="#6c757d"
            transform={`rotate(-45 ${x} ${chartHeight - padding.bottom + 20})`}
          >
            {label}
          </text>
        );
      })}
    </>
  );
};

export default ChartDesktopXAxis;
