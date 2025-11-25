import React from 'react';
import { formatPrice } from '../../utils/formatters';

interface ProfitLossCellProps {
  profitLoss: number;
  profitLossPercent: number;
  isMobile: boolean;
}

const ProfitLossCell = ({ profitLoss, profitLossPercent, isMobile }: ProfitLossCellProps) => {
  const colorClass = profitLoss >= 0 ? 'text-rise' : 'text-fall';

  return (
    <td className={`py-1.5 px-0 md:py-3.5 md:px-3 text-right text-[9px] md:text-sm font-semibold ${colorClass}`}>
      <div className="md:hidden">
        {isFinite(profitLossPercent) && !isNaN(profitLossPercent) ? (
          <>
            {profitLossPercent >= 0 ? '+' : ''}
            {profitLossPercent.toFixed(2)}%
          </>
        ) : (
          '0.00%'
        )}
      </div>
      <div className="hidden md:block">
        <div>{profitLoss >= 0 ? '+' : ''}{formatPrice(profitLoss)}원</div>
        <div className="text-[11px] mt-px">
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
