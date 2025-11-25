import React from 'react';
import { formatNumber } from '../../utils/formatters';
import { COLORS } from '../../utils/constants';

interface ChartHeaderProps {
  currentPrice: number;
  changePercent: number;
  isRising: boolean;
}

const ChartHeader = ({ currentPrice, changePercent, isRising }: ChartHeaderProps) => {
  const chartColor = isRising ? COLORS.RISE : COLORS.FALL;

  return (
    <div className="p-4 md:py-5 md:px-6 border-b border-gray-300 flex justify-between items-center flex-wrap gap-3 md:gap-4 bg-gray-50 w-full box-border" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <div className="flex-shrink-0">
        <div className="text-[10px] md:text-xs text-gray-500 mb-1 font-medium">
          현재 가격
        </div>
        <div className="text-[11px] md:text-xl lg:text-2xl font-bold text-gray-900">
          {formatNumber(currentPrice)}원
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[10px] md:text-xs text-gray-500 mb-1 font-medium">
          변동률
        </div>
        <div className={`text-[10px] md:text-lg lg:text-xl font-bold ${isRising ? 'text-rise' : 'text-fall'}`}>
          {isRising ? '+' : ''}{changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
