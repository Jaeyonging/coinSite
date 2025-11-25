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
    <div className="mb-5 space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 md:text-sm dark:text-slate-500">
          보유 현금
        </div>
        <div className="mt-1 text-lg font-bold text-slate-900 md:text-[28px] dark:text-white">
          {formatPrice(balance)}원
        </div>
      </div>

      {currentPosition && (
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 md:text-sm dark:text-slate-500">
            보유 수량
          </div>
          <div className="mt-1 text-base font-bold text-slate-900 md:text-2xl dark:text-white">
            {currentPosition.amount}개
          </div>
          <div className="mt-2 text-[10px] text-slate-500 md:text-sm dark:text-slate-400">
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
