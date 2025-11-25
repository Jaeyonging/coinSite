import React from 'react';
import { MdAccountBalanceWallet, MdRefresh } from 'react-icons/md';
import { formatPrice } from '../../utils/formatters';

interface AssetSummaryProps {
  totalAssets: number;
  balance: number;
  totalInvestment: number;
  totalProfitLoss: number;
  totalReturnPercent: number;
  onDepositClick: () => void;
  onResetClick: () => void;
  isMobile: boolean;
}

const AssetSummary = ({
  totalAssets,
  balance,
  totalInvestment,
  totalProfitLoss,
  totalReturnPercent,
  onDepositClick,
  onResetClick,
  isMobile,
}: AssetSummaryProps) => {
  return (
    <div className="mb-5 md:mb-6">
      <div className="flex justify-between items-center mb-5 sm:mb-4">
        <h2 className="text-sm md:text-xl font-bold text-gray-900 m-0 flex items-center gap-2">
          <MdAccountBalanceWallet className="w-5 h-5 md:w-6 md:h-6" />
          보유자산
        </h2>
        <button
          onClick={onResetClick}
          className="py-1.5 px-3 text-[10px] md:py-2 md:px-4 md:text-sm font-semibold bg-red-600 text-white border-none rounded-md cursor-pointer transition-colors duration-200 ease-in-out flex items-center gap-1 hover:bg-red-700"
        >
          <MdRefresh size={16} />
          초기화
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-3">
        <div className="bg-gray-50 rounded-lg p-4 sm:p-3">
          <div className="text-[10px] md:text-sm text-gray-500 mb-2">
            총 자산
          </div>
          <div className="text-base md:text-2xl font-bold text-gray-900">
            {formatPrice(totalAssets)}원
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 relative sm:p-3">
          <div className="text-[10px] md:text-sm text-gray-500 mb-2">
            보유 현금
          </div>
          <div className="text-base md:text-2xl font-bold text-gray-900 mb-2">
            {formatPrice(balance)}원
          </div>
          <button
            onClick={onDepositClick}
            className="w-full py-1.5 text-[9px] md:py-2 md:text-xs font-semibold bg-blue-600 text-white border-none rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-700"
          >
            입금하기
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 sm:p-3">
          <div className="text-[10px] md:text-sm text-gray-500 mb-2">
            투자금액
          </div>
          <div className="text-base md:text-2xl font-bold text-gray-900">
            {formatPrice(totalInvestment)}원
          </div>
        </div>
        <div className={`rounded-lg p-4 sm:p-3 ${totalProfitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-[10px] md:text-sm text-gray-500 mb-2">
            수익/손실
          </div>
          <div className={`text-base md:text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-rise' : 'text-fall'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}
            {formatPrice(totalProfitLoss)}원
          </div>
          <div className={`text-[9px] md:text-xs ${totalProfitLoss >= 0 ? 'text-rise' : 'text-fall'} mt-1 font-semibold`}>
            {isFinite(totalReturnPercent) && !isNaN(totalReturnPercent) ? (
              <>
                ({totalProfitLoss >= 0 ? '+' : ''}
                {totalReturnPercent.toFixed(2)}%)
              </>
            ) : (
              '(0.00%)'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetSummary;
