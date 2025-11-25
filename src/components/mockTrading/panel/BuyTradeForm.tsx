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
    <div>
      <div className="mb-3">
        <label className="block text-[11px] md:text-sm text-gray-600 mb-2 font-medium">수량</label>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            value={buyAmount}
            onChange={(e) => onBuyAmountChange(e.target.value)}
            placeholder="수량 입력"
            className="flex-1 py-3 px-3 text-xs md:py-3.5 md:px-3.5 md:text-base border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors duration-200"
          />
          <button
            onClick={onMaxBuy}
            className="py-3 px-4 text-[11px] md:py-3.5 md:px-5 md:text-sm bg-gray-50 border border-gray-300 rounded-lg cursor-pointer font-medium whitespace-nowrap hover:bg-gray-100 transition-colors duration-200"
          >
            최대
          </button>
        </div>
        <div className="text-[10px] md:text-sm text-gray-500 mt-2">
          최대 구매 가능: {maxBuyable.toFixed(8)}개
        </div>
      </div>

      {!isInvalid && (
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg mb-5">
          <div className="text-[11px] md:text-sm text-gray-600 mb-1">예상 금액</div>
          <div className="text-sm md:text-xl font-bold">
            {formatPrice(parsedAmount * currentPrice)}원
          </div>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isInvalid}
        className={`w-full py-3.5 text-sm md:py-4 md:text-lg font-bold bg-blue-600 text-white border-none rounded-lg transition-opacity duration-200 ease-in-out ${
          isInvalid ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-blue-700'
        }`}
      >
        매수하기
      </button>
    </div>
  );
};

export default BuyTradeForm;
