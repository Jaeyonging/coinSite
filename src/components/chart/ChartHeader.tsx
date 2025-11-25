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
    <div
      className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 p-4 md:gap-4 md:px-6 md:py-5 dark:border-slate-800 dark:bg-slate-900"
      style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
    >
      <div className="flex-shrink-0">
        <div className="mb-1 text-[10px] font-medium text-slate-500 md:text-xs dark:text-slate-400">
          현재 가격
        </div>
        <div className="text-[11px] font-bold text-slate-900 md:text-xl lg:text-2xl dark:text-white">
          {formatNumber(currentPrice)}원
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="mb-1 text-[10px] font-medium text-slate-500 md:text-xs dark:text-slate-400">
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
