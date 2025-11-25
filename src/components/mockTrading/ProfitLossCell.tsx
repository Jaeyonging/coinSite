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
    <td className="py-1.5 px-0 text-right text-[9px] md:py-3.5 md:px-3 md:text-sm">
      <div className={`md:hidden font-semibold ${colorClass}`}>
        {isFinite(profitLossPercent) && !isNaN(profitLossPercent) ? (
          <>
            {profitLossPercent >= 0 ? '+' : ''}
            {profitLossPercent.toFixed(2)}%
          </>
        ) : (
          '0.00%'
        )}
      </div>
      <div className="hidden md:flex md:flex-col md:items-end">
        <div className={`font-semibold ${colorClass}`}>
          {profitLoss >= 0 ? '+' : ''}
          {formatPrice(profitLoss)}원
        </div>
        <div className={`mt-px text-[11px] ${colorClass}`}>
          {isFinite(profitLossPercent) && !isNaN(profitLossPercent) ? (
            <>
              ({profitLossPercent >= 0 ? '+' : ''}
              {profitLossPercent.toFixed(2)}%)
            </>
          ) : (
            '(0.00%)'
          )}
        </div>
      </div>
    </td>
  );
};

export default ProfitLossCell;
