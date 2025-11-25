import React from 'react';
import { formatCompactNumber } from '../../utils/formatters';
import { ChartConfigShape } from './hooks/useChartConfig';
import { ChartDataShape } from './hooks/useCoinChartData';

interface ChartMobileYAxisProps {
  chartConfig: ChartConfigShape;
  chartData: ChartDataShape;
}

const ChartMobileYAxis = ({ chartConfig, chartData }: ChartMobileYAxisProps) => {
  // 안전성 체크: priceRange가 유효하지 않은 경우 렌더링하지 않음
  if (!chartData.priceRange || chartData.priceRange <= 0 || !isFinite(chartData.priceRange) || !isFinite(chartData.minPrice)) {
    return null;
  }
  
  return (
    <div
      className="absolute left-0 top-0 pointer-events-none z-10"
      style={{
        width: chartConfig.padding.left - 5,
        height: chartConfig.plotHeight + chartConfig.padding.top + chartConfig.padding.bottom,
        paddingLeft: '3px',
        paddingTop: `${chartConfig.padding.top}px`,
      }}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        // 높은 가격이 위에, 낮은 가격이 아래에 오도록 수정
        const price = chartData.minPrice + chartData.priceRange * ratio;
        const y = chartConfig.padding.top + chartConfig.plotHeight * (1 - ratio);
        
        // 가격이 유효하지 않은 경우 렌더링하지 않음
        if (!isFinite(price) || price <= 0) {
          return null;
        }
        
        return (
          <div
            key={ratio}
            className="absolute left-0 -translate-y-1/2 text-[9px] text-gray-500 font-medium text-right w-full pr-[5px]"
            style={{ top: `${y}px` }}
          >
            {formatCompactNumber(price)}
          </div>
        );
      })}
    </div>
  );
};

export default ChartMobileYAxis;
