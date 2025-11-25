import React from 'react';
import { UpbitCoin } from '../../types/coin.types';
import { Position } from '../../types/mockTrading.types';
import { formatPrice } from '../../utils/formatters';

interface CoinNameCellProps {
  position: Position;
  coin: UpbitCoin;
  profitLoss: number;
  profitLossPercent: number;
  isMobile: boolean;
}

const CoinNameCell = ({ position, coin, profitLoss, profitLossPercent, isMobile }: CoinNameCellProps) => {
  return (
    <td className="py-1.5 px-0 md:py-3.5 md:px-3">
      <div className="flex items-center gap-0.5 md:gap-1.5">
        <img
          src={`https://static.upbit.com/logos/${position.market.replace('KRW-', '')}.png`}
          alt={coin.korean_name}
          className="w-3 h-3 md:w-5 md:h-5 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <div className="font-semibold text-gray-900 text-[9px] md:text-sm whitespace-nowrap overflow-hidden text-ellipsis dark:text-white">
              {coin.korean_name}
            </div>
            <div className="flex flex-col items-end gap-px flex-shrink-0 md:hidden">
              <div className={`text-[9px] font-semibold ${profitLoss >= 0 ? 'text-rise' : 'text-fall'}`}>
                {isFinite(profitLossPercent) && !isNaN(profitLossPercent) ? (
                  <>
                    {profitLossPercent >= 0 ? '+' : ''}
                    {profitLossPercent.toFixed(2)}%
                  </>
                ) : (
                  '0.00%'
                )}
              </div>
              <div className={`text-[8px] font-medium ${profitLoss >= 0 ? 'text-rise' : 'text-fall'}`}>
                {profitLoss >= 0 ? '+' : ''}{formatPrice(profitLoss)}원
              </div>
            </div>
          </div>
          <div className="hidden md:block text-[11px] text-gray-500 mt-px dark:text-slate-400">
            {coin.english_name}
          </div>
        </div>
      </div>
    </td>
  );
};

export default CoinNameCell;
