import React from 'react';
import { formatPrice } from '../../utils/formatters';

interface ProfitLossCellProps {
  profitLoss: number;
  profitLossPercent: number;
  isMobile: boolean;
}

const ProfitLossCell = ({ profitLoss, profitLossPercent, isMobile }: ProfitLossCellProps) => {
  const colorClass =
    profitLoss > 0 ? 'text-rise' : profitLoss < 0 ? 'text-fall' : 'text-slate-500 dark:text-slate-400';

  return (
    <td className="py-1.5 px-0 text-right text-[7px] md:py-3.5 md:px-3 md:text-sm whitespace-nowrap">
      <div className="flex flex-col items-end">
        <div className={`text-[7px] md:text-sm font-semibold ${colorClass}`}>
          {isFinite(profitLossPercent) && !isNaN(profitLossPercent) ? (
            <>
              {profitLossPercent >= 0 ? '+' : ''}
              {profitLossPercent.toFixed(2)}%
            </>
          ) : (
            '0.00%'
          )}
        </div>
        <div className={`mt-px text-[6px] md:text-[11px] font-medium ${colorClass}`}>
          {profitLoss >= 0 ? '+' : ''}
          {formatPrice(profitLoss)}원
        </div>
      </div>
    </td>
  );
};

export default ProfitLossCell;
