import React from 'react';
import { MdWarning } from 'react-icons/md';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  isMobile: boolean;
}

const ResetModal = ({ isOpen, onClose, onReset }: ResetModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[10000] bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 z-[10001] w-[90%] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-100 bg-white/95 p-6 text-center shadow-2xl transition-colors md:w-[420px] md:p-8 dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="flex justify-center text-[32px] text-red-500 md:text-[64px]">
            <MdWarning className="h-12 w-12 md:h-16 md:w-16" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 md:text-xl dark:text-white">모의투자 초기화</h2>
          <p className="text-xs leading-relaxed text-slate-500 md:text-[15px] dark:text-slate-400">
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
            className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 md:py-3.5 md:text-base dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            취소
          </button>
          <button
            onClick={onReset}
            className="flex-1 rounded-2xl border-none bg-red-600 py-3 text-xs font-bold text-white transition-colors duration-200 hover:bg-red-500 md:py-3.5 md:text-base"
          >
            초기화하기
          </button>
        </div>
      </div>
    </>
  );
};

export default ResetModal;
