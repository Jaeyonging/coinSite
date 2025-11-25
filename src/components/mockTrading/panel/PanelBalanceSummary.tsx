import React from 'react';
import { Position } from '../../../types/mockTrading.types';
import { formatPrice } from '../../../utils/formatters';

interface PanelBalanceSummaryProps {
  balance: number;
  currentPosition: Position | undefined;
  profitLoss: number;
  profitLossPercent: number;
}

const PanelBalanceSummary = ({
  balance,
  currentPosition,
  profitLoss,
  profitLossPercent,
}: PanelBalanceSummaryProps) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 md:p-5 mb-5">
      <div className="text-[11px] md:text-sm text-gray-500 mb-2">보유 현금</div>
      <div className="text-lg md:text-[28px] font-bold mb-4">{formatPrice(balance)}원</div>

      {currentPosition && (
        <div className="border-t border-gray-300 pt-4 mt-4">
          <div className="text-[11px] md:text-sm text-gray-500 mb-2">보유 수량</div>
          <div className="text-base md:text-2xl font-bold mb-2">{currentPosition.amount}개</div>
          <div className="text-[10px] md:text-sm text-gray-500 mb-1">
            평균 단가: {formatPrice(currentPosition.avgPrice)}원
          </div>
          <div
            className={`text-xs md:text-base font-semibold mt-2 ${
              profitLoss >= 0 ? 'text-rise' : 'text-fall'
            }`}
          >
            {profitLoss >= 0 ? '+' : ''}
            {formatPrice(profitLoss)}원{' '}
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
      )}
    </div>
  );
};

export default PanelBalanceSummary;
