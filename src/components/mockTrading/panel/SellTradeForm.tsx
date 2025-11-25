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
      <div className="text-center py-10 px-5 md:py-[60px] text-gray-500">
        <div className="text-[32px] md:text-[64px] mb-4">📦</div>
        <div className="text-xs md:text-base">보유 중인 코인이 없습니다.</div>
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
    <>
      <div className="mb-3">
        <label className="block text-[11px] md:text-sm text-gray-600 mb-2 font-medium">
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
            className="flex-1 py-3 px-3 text-xs md:py-3.5 md:px-3.5 md:text-base border border-gray-300 rounded-lg outline-none focus:border-red-600 transition-colors duration-200"
          />
          <button
            onClick={onMaxSell}
            className="py-3 px-4 text-[11px] md:py-3.5 md:px-5 md:text-sm bg-gray-50 border border-gray-300 rounded-lg cursor-pointer font-medium whitespace-nowrap hover:bg-gray-100 transition-colors duration-200"
          >
            최대
          </button>
        </div>
        <div className="text-[10px] md:text-sm text-gray-500 mt-2">
          보유 수량: {currentPosition.amount.toFixed(8)}개
        </div>
      </div>

      {!isInvalid && (
        <div className="bg-red-50 p-3 md:p-4 rounded-lg mb-5">
          <div className="text-[11px] md:text-sm text-gray-600 mb-1">예상 금액</div>
          <div className="text-sm md:text-xl font-bold mb-2">
            {formatPrice(parsedAmount * currentPrice)}원
          </div>
          {(() => {
            const profit = (currentPrice - currentPosition.avgPrice) * parsedAmount;
            return (
              <div
                className={`text-[11px] md:text-sm font-semibold ${
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
        className={`w-full py-3.5 text-sm md:py-4 md:text-lg font-bold bg-red-600 text-white border-none rounded-lg transition-opacity duration-200 ease-in-out ${
          isInvalid ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-red-700'
        }`}
      >
        매도하기
      </button>
    </>
  );
};

export default SellTradeForm;
