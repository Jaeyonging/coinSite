import React from 'react';
import { ChartConfigShape } from './hooks/useChartConfig';
import { ChartDataShape } from './hooks/useCoinChartData';

interface ChartMobileXAxisProps {
  chartConfig: ChartConfigShape;
  chartData: ChartDataShape;
  xAxisScrollRef: React.RefObject<HTMLDivElement>;
  onSyncScroll: (scrollLeft: number) => void;
}

const ChartMobileXAxis = ({
  chartConfig,
  chartData,
  xAxisScrollRef,
  onSyncScroll,
}: ChartMobileXAxisProps) => {
  return (
    <div
      ref={xAxisScrollRef}
      data-x-axis-scroll
      className="mt-2 overflow-x-auto overflow-y-hidden touch-pan-x pointer-events-auto"
      onScroll={(event) => {
        onSyncScroll(event.currentTarget.scrollLeft);
      }}
    >
      <div
        className="relative h-full"
        style={{
          width: `${chartConfig.chartWidth}px`,
          height: `${chartConfig.padding.bottom + 12}px`,
        }}
      >
        {(() => {
          const tickCount = Math.min(10, chartData.candles.length);
          const step = Math.max(1, Math.floor(chartData.candles.length / tickCount));
          return chartData.labels.map((label, index) => {
            if (index % step !== 0 && index !== chartData.labels.length - 1) return null;
            const x =
              chartConfig.padding.left + index * chartConfig.candleSpacing + chartConfig.candleSpacing / 2;
            return (
              <div
                key={index}
                className="absolute top-0 text-[9px] text-gray-500 whitespace-nowrap -translate-x-1/2"
                style={{ left: `${x}px` }}
              >
                {label}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};

export default ChartMobileXAxis;
