import React from 'react';
import { formatCompactNumber } from '../../utils/formatters';
import { ChartConfigShape } from './hooks/useChartConfig';
import { ChartDataShape } from './hooks/useCoinChartData';

interface ChartCrosshairProps {
  mousePosition: { x: number; y: number; timeIndex: number; price: number } | null;
  chartConfig: ChartConfigShape;
  chartData: ChartDataShape;
  isMobile: boolean;
}

const ChartCrosshair = ({ mousePosition, chartConfig, chartData, isMobile }: ChartCrosshairProps) => {
  if (!mousePosition) return null;
  const { x, y, timeIndex, price } = mousePosition;
  const { padding, plotHeight } = chartConfig;

  // 안전성 체크: timeIndex가 유효한 범위 내에 있는지 확인
  if (timeIndex < 0 || timeIndex >= chartData.labels.length || !isFinite(price) || price <= 0) {
    return null;
  }

  return (
    <>
      <line
        x1={x}
        y1={padding.top}
        x2={x}
        y2={padding.top + plotHeight}
        stroke="#6c757d"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.7}
      />
      <line
        x1={padding.left}
        y1={y}
        x2={padding.left + chartConfig.plotWidth}
        y2={y}
        stroke="#6c757d"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.7}
      />
      <circle cx={x} cy={y} r={4} fill="#6c757d" stroke="#ffffff" strokeWidth={2} />
      <text
        x={padding.left - 10}
        y={y}
        textAnchor="end"
        fontSize={11}
        fill="#6c757d"
        fontWeight={600}
        alignmentBaseline="middle"
      >
        {formatCompactNumber(price)}
      </text>
      {!isMobile && chartData.labels[timeIndex] && (
        <text
          x={x}
          y={chartConfig.chartHeight - padding.bottom + 15}
          textAnchor="middle"
          fontSize={11}
          fill="#6c757d"
          fontWeight={600}
        >
          {chartData.labels[timeIndex]}
        </text>
      )}
    </>
  );
};

export default ChartCrosshair;
