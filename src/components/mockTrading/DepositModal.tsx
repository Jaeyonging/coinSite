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
  isMobile,
}: DepositModalProps) => {
  if (!isOpen) return null;

  const isDisabled = !depositAmount || isNaN(parseFloat(depositAmount.replace(/,/g, ''))) || parseFloat(depositAmount.replace(/,/g, '')) <= 0;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[10000] ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-opacity duration-300 ease-in-out`}
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 md:p-8 z-[10001] w-[90%] md:w-[400px] max-w-[90vw] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm md:text-xl font-bold text-gray-900 m-0">
            현금 입금
          </h2>
          <IoMdClose
            onClick={onClose}
            className="text-xl md:text-2xl cursor-pointer text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-900"
          />
        </div>

        <div className="mb-5">
          <label className="block text-[11px] md:text-sm text-gray-600 mb-2 font-medium">
            입금 금액
          </label>
          <input
            type="text"
            value={depositAmount}
            onChange={onDepositAmountChange}
            placeholder="금액을 입력하세요"
            className="w-full py-3 px-3 text-sm md:py-3.5 md:px-3.5 md:text-lg border-2 border-gray-300 rounded-lg outline-none box-border focus:border-blue-600 transition-colors duration-200"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onDeposit();
              }
            }}
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            {[100000, 500000, 1000000, 5000000].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  const formatted = amount.toLocaleString();
                  onDepositAmountChange({
                    target: { value: formatted },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className="flex-1 py-2 text-[10px] md:py-2.5 md:text-sm bg-gray-50 border border-gray-300 rounded-md cursor-pointer font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 hover:border-blue-600"
              >
                {formatPrice(amount)}
              </button>
            ))}
          </div>
        </div>

        {depositAmount && !isNaN(parseFloat(depositAmount.replace(/,/g, ''))) && (
          <div className="bg-blue-50 p-3 md:p-4 rounded-lg mb-5">
            <div className="text-[11px] md:text-sm text-gray-600 mb-1">
              입금 후 잔액
            </div>
            <div className="text-sm md:text-xl font-bold">
              {formatPrice(balance + parseFloat(depositAmount.replace(/,/g, '')))}원
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs md:py-3.5 md:text-base font-semibold bg-gray-50 text-gray-900 border border-gray-300 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={onDeposit}
            disabled={isDisabled}
            className={`flex-1 py-3 text-xs md:py-3.5 md:text-base font-bold bg-blue-600 text-white border-none rounded-lg ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} transition-opacity duration-200 ease-in-out hover:bg-blue-700 disabled:hover:bg-blue-600`}
          >
            입금하기
          </button>
        </div>
      </div>
    </>
  );
};

export default DepositModal;
