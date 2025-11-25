import React from 'react';
import { formatCompactNumber } from '../../utils/formatters';
import { ChartConfigShape } from './hooks/useChartConfig';

interface ChartDesktopYAxisProps {
  chartConfig: ChartConfigShape;
}

const ChartDesktopYAxis = ({ chartConfig }: ChartDesktopYAxisProps) => {
  const { padding, plotHeight, minPrice, priceRange } = chartConfig;
  
  // 안전성 체크: priceRange가 유효하지 않은 경우 렌더링하지 않음
  if (!priceRange || priceRange <= 0 || !isFinite(priceRange) || !isFinite(minPrice)) {
    return null;
  }
  
  return (
    <>
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        // 높은 가격이 위에, 낮은 가격이 아래에 오도록 수정
        const price = minPrice + priceRange * ratio;
        const y = padding.top + plotHeight * (1 - ratio);
        
        // 가격이 유효하지 않은 경우 렌더링하지 않음
        if (!isFinite(price) || price <= 0) {
          return null;
        }
        
        return (
          <text
            key={ratio}
            x={padding.left - 10}
            y={y + 4}
            textAnchor="end"
            fontSize={12}
            fontWeight={600}
            fill="currentColor"
            className="text-slate-600 dark:text-slate-300"
          >
            {formatCompactNumber(price)}
          </text>
        );
      })}
    </>
  );
};

export default ChartDesktopYAxis;
