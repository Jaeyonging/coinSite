import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { formatPrice } from '../../utils/formatters';

interface DepositModalProps {
  isOpen: boolean;
  depositAmount: string;
  balance: number;
  onClose: () => void;
  onDepositAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeposit: () => void;
  isMobile: boolean;
}

const DepositModal = ({
  isOpen,
  depositAmount,
  balance,
  onClose,
  onDepositAmountChange,
  onDeposit,
}: DepositModalProps) => {
  if (!isOpen) return null;

  const parsedAmount = parseFloat(depositAmount.replace(/,/g, ''));
  const isDisabled = !depositAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0;

  return (
    <>
      <div
        className={`fixed inset-0 z-[10000] bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 z-[10001] w-[90%] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-2xl transition-colors md:w-[420px] md:p-8 dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="m-0 text-sm font-bold text-slate-900 md:text-xl dark:text-white">현금 입금</h2>
          <IoMdClose
            onClick={onClose}
            className="cursor-pointer text-xl text-slate-400 transition-colors duration-200 hover:text-slate-900 md:text-2xl dark:text-slate-500 dark:hover:text-white"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-medium text-slate-500 md:text-sm dark:text-slate-300">
            입금 금액
          </label>
          <input
            type="text"
            value={depositAmount}
            onChange={onDepositAmountChange}
            placeholder="금액을 입력하세요"
            className="w-full rounded-2xl border-2 border-slate-200 bg-white/70 py-3 px-3 text-sm outline-none transition-colors duration-200 focus:border-blue-600 md:py-3.5 md:px-3.5 md:text-lg dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onDeposit();
              }
            }}
            autoFocus
          />
          <div className="mt-3 flex gap-2">
            {[100000, 500000, 1000000, 5000000].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  const formatted = amount.toLocaleString();
                  onDepositAmountChange({
                    target: { value: formatted },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 text-[10px] font-medium text-slate-700 transition-all duration-200 hover:border-blue-500 hover:bg-white md:py-2.5 md:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-indigo-400"
              >
                {formatPrice(amount)}
              </button>
            ))}
          </div>
        </div>

        {depositAmount && !Number.isNaN(parsedAmount) && parsedAmount > 0 && (
          <div className="mb-5 rounded-2xl bg-blue-50/80 p-3 text-slate-800 md:p-4 dark:bg-indigo-500/10 dark:text-white">
            <div className="mb-1 text-[11px] font-medium text-slate-500 md:text-sm dark:text-slate-300">
              입금 후 잔액
            </div>
            <div className="text-sm font-bold md:text-xl">
              {formatPrice(balance + parsedAmount)}원
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 md:py-3.5 md:text-base dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            취소
          </button>
          <button
            onClick={onDeposit}
            disabled={isDisabled}
            className={`flex-1 rounded-2xl border-none py-3 text-xs font-bold text-white md:py-3.5 md:text-base ${
              isDisabled
                ? 'cursor-not-allowed bg-indigo-400/60 opacity-60'
                : 'cursor-pointer bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            입금하기
          </button>
        </div>
      </div>
    </>
  );
};

export default DepositModal;
