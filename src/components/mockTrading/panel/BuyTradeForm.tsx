import React from 'react';
import { formatPrice } from '../../../utils/formatters';

interface BuyTradeFormProps {
  buyAmount: string;
  onBuyAmountChange: (value: string) => void;
  onMaxBuy: () => void;
  maxBuyable: number;
  currentPrice: number;
  onSubmit: () => void;
}

const BuyTradeForm = ({
  buyAmount,
  onBuyAmountChange,
  onMaxBuy,
  maxBuyable,
  currentPrice,
  onSubmit,
}: BuyTradeFormProps) => {
  const parsedAmount = parseFloat(buyAmount);
  const isInvalid = !buyAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0;

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
            value={buyAmount}
            onChange={(e) => onBuyAmountChange(e.target.value)}
            placeholder="수량 입력"
            className="flex-1 rounded-2xl border border-slate-200 bg-white/80 py-3 px-3 text-xs outline-none transition-colors duration-200 focus:border-indigo-500 md:py-3.5 md:px-3.5 md:text-base dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <button
            onClick={onMaxBuy}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-medium text-slate-700 transition-colors duration-200 hover:border-indigo-400 hover:bg-white md:px-5 md:py-3.5 md:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-indigo-400"
          >
            최대
          </button>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 md:text-sm dark:text-slate-400">
          최대 구매 가능: {maxBuyable.toFixed(8)}개
        </div>
      </div>

      {!isInvalid && (
        <div className="rounded-2xl bg-indigo-50/80 p-3 text-slate-900 md:p-4 dark:bg-indigo-500/10 dark:text-white">
          <div className="text-[11px] font-medium text-slate-500 md:text-sm dark:text-slate-300">
            예상 금액
          </div>
          <div className="text-sm font-bold md:text-xl">
            {formatPrice(parsedAmount * currentPrice)}원
          </div>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isInvalid}
        className={`w-full rounded-2xl py-3.5 text-sm font-bold text-white md:py-4 md:text-lg ${
          isInvalid
            ? 'cursor-not-allowed bg-indigo-400/70 opacity-60'
            : 'cursor-pointer bg-indigo-600 transition-colors duration-200 hover:bg-indigo-500'
        }`}
      >
        매수하기
      </button>
    </div>
  );
};

export default BuyTradeForm;
