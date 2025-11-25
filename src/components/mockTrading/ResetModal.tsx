import React from 'react';
import { MdWarning } from 'react-icons/md';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  isMobile: boolean;
}

const ResetModal = ({ isOpen, onClose, onReset, isMobile }: ResetModalProps) => {
  if (!isOpen) return null;

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
        <div className="text-center mb-6">
          <div className="text-[32px] md:text-[64px] mb-4 flex justify-center">
            <MdWarning className="w-12 h-12 md:w-16 md:h-16 text-red-600" />
          </div>
          <h2 className="text-sm md:text-xl font-bold text-gray-900 mb-3">
            모의투자 초기화
          </h2>
          <p className="text-xs md:text-[15px] text-gray-500 leading-relaxed m-0">
            모든 투자종목과 보유 현금이 초기화됩니다.
            <br />
            (보유 현금: 1천만원으로 초기화)
            <br />
            <strong className="text-fall">이 작업은 되돌릴 수 없습니다.</strong>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs md:py-3.5 md:text-base font-semibold bg-gray-50 text-gray-900 border border-gray-300 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-3 text-xs md:py-3.5 md:text-base font-bold bg-red-600 text-white border-none rounded-lg cursor-pointer transition-colors duration-200 ease-in-out hover:bg-red-700"
          >
            초기화하기
          </button>
        </div>
      </div>
    </>
  );
};

export default ResetModal;
