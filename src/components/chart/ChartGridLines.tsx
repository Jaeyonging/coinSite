import React from 'react';
import { ChartConfigShape } from './hooks/useChartConfig';

interface ChartGridLinesProps {
  chartConfig: ChartConfigShape;
}

const ChartGridLines = ({ chartConfig }: ChartGridLinesProps) => {
  const { padding, plotWidth, plotHeight } = chartConfig;
  return (
    <>
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = padding.top + plotHeight * (1 - ratio);
        return (
          <line
            key={ratio}
            x1={padding.left}
            y1={y}
            x2={padding.left + plotWidth}
            y2={y}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="4 4"
            className="text-slate-200 dark:text-slate-700"
          />
        );
      })}
    </>
  );
};

export default ChartGridLines;
