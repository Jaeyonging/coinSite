import React from 'react';
import { ChartConfigShape } from './hooks/useChartConfig';
import { ChartDataShape } from './hooks/useCoinChartData';

interface ChartPurchaseMarkerProps {
  chartConfig: ChartConfigShape;
  chartData: ChartDataShape;
  position: {
    market: string;
    amount: number;
    avgPrice: number;
    purchaseDate?: string;
  };
  isMobile: boolean;
}

const ChartPurchaseMarker = ({
  chartConfig,
  chartData,
  position,
  isMobile,
}: ChartPurchaseMarkerProps) => {
  if (!position.purchaseDate) return null;

  const purchaseDateStr = position.purchaseDate;
  const matchingIndex = chartData.candles.findIndex((candle) => {
    const candleDate = new Date(candle.candle_date_time_kst);
    const candleDateStr = `${candleDate.getFullYear()}-${String(
      candleDate.getMonth() + 1
    ).padStart(2, '0')}-${String(candleDate.getDate()).padStart(2, '0')}`;
    return candleDateStr === purchaseDateStr;
  });

  if (matchingIndex === -1 || matchingIndex < 0 || matchingIndex >= chartData.candles.length) return null;

  const x = chartConfig.padding.left + matchingIndex * chartConfig.candleSpacing + chartConfig.candleSpacing / 2;
  const y = chartConfig.priceToY(position.avgPrice);
  
  // 안전성 체크: y 좌표가 유효한 범위 내에 있는지 확인
  if (!isFinite(y) || y < chartConfig.padding.top || y > chartConfig.padding.top + chartConfig.plotHeight) {
    return null;
  }

  return (
    <>
      <line
        x1={chartConfig.padding.left}
        y1={y}
        x2={chartConfig.padding.left + chartConfig.plotWidth}
        y2={y}
        stroke="#0d6efd"
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.8}
      />
      <line
        x1={x}
        y1={chartConfig.padding.top}
        x2={x}
        y2={chartConfig.padding.top + chartConfig.plotHeight}
        stroke="#0d6efd"
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.8}
      />
      <circle cx={x} cy={y} r={6} fill="#0d6efd" stroke="#ffffff" strokeWidth={2} />
      <text
        x={chartConfig.padding.left - 10}
        y={y}
        textAnchor="end"
        fontSize={11}
        fill="#0d6efd"
        fontWeight={700}
        alignmentBaseline="middle"
      >
        매수: {position.avgPrice.toLocaleString()}
      </text>
      {!isMobile && (
        <text
          x={x}
          y={chartConfig.chartHeight - chartConfig.padding.bottom + 15}
          textAnchor="middle"
          fontSize={11}
          fill="#0d6efd"
          fontWeight={700}
        >
          {position.purchaseDate}
        </text>
      )}
    </>
  );
};

export default ChartPurchaseMarker;
