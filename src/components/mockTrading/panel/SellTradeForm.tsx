import React from 'react';
import { Position } from '../../../types/mockTrading.types';
import { formatPrice } from '../../../utils/formatters';

interface SellTradeFormProps {
  sellAmount: string;
  onSellAmountChange: (value: string) => void;
  onMaxSell: () => void;
  currentPosition: Position | undefined;
  currentPrice: number;
  onSubmit: () => void;
}

const SellTradeForm = ({
  sellAmount,
  onSellAmountChange,
  onMaxSell,
  currentPosition,
  currentPrice,
  onSubmit,
}: SellTradeFormProps) => {
  if (!currentPosition) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/80 py-10 px-5 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400 md:py-[60px]">
        <div className="text-[32px] md:text-[48px]">📦</div>
        <div className="mt-2 text-xs font-semibold md:text-base">보유 중인 코인이 없습니다.</div>
      </div>
    );
  }

  const parsedAmount = parseFloat(sellAmount);
  const isInvalid =
    !sellAmount ||
    Number.isNaN(parsedAmount) ||
    parsedAmount <= 0 ||
    parsedAmount > currentPosition.amount;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-[11px] font-semibold text-slate-500 md:text-sm dark:text-slate-300">
          수량
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            value={sellAmount}
            onChange={(e) => onSellAmountChange(e.target.value)}
            placeholder="수량 입력"
            max={currentPosition.amount}
            className="flex-1 rounded-2xl border border-slate-200 bg-white/80 py-3 px-3 text-xs outline-none transition-colors duration-200 focus:border-rose-500 md:py-3.5 md:px-3.5 md:text-base dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <button
            onClick={onMaxSell}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-medium text-slate-700 transition-colors duration-200 hover:border-rose-400 hover:bg-white md:px-5 md:py-3.5 md:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-rose-400"
          >
            최대
          </button>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 md:text-sm dark:text-slate-400">
          보유 수량: {currentPosition.amount.toFixed(8)}개
        </div>
      </div>

      {!isInvalid && (
        <div className="rounded-2xl bg-rose-50/80 p-3 text-slate-900 md:p-4 dark:bg-rose-500/10 dark:text-white">
          <div className="text-[11px] font-medium text-slate-500 md:text-sm dark:text-slate-300">
            예상 금액
          </div>
          <div className="text-sm font-bold md:text-xl mb-1">
            {formatPrice(parsedAmount * currentPrice)}원
          </div>
          {(() => {
            const profit = (currentPrice - currentPosition.avgPrice) * parsedAmount;
            return (
              <div
                className={`text-[11px] font-semibold md:text-sm ${
                  profit >= 0 ? 'text-rise' : 'text-fall'
                }`}
              >
                {profit >= 0 ? '수익' : '손실'}: {profit >= 0 ? '+' : ''}
                {formatPrice(profit)}원
              </div>
            );
          })()}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isInvalid}
        className={`w-full rounded-2xl py-3.5 text-sm font-bold text-white md:py-4 md:text-lg ${
          isInvalid
            ? 'cursor-not-allowed bg-rose-400/70 opacity-60'
            : 'cursor-pointer bg-rose-500 transition-colors duration-200 hover:bg-rose-400'
        }`}
      >
        매도하기
      </button>
    </div>
  );
};

export default SellTradeForm;
