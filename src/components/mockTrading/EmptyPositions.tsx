import React from 'react';
import { MdInventory } from 'react-icons/md';

interface EmptyPositionsProps {
  isMobile: boolean;
}

const EmptyPositions = ({ isMobile }: EmptyPositionsProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/90 py-10 px-5 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400 md:py-[60px]">
      <div className="mb-4 flex justify-center text-[32px] md:text-[64px]">
        <MdInventory className="h-12 w-12 text-slate-400 md:h-16 md:w-16 dark:text-slate-600" />
      </div>
      <div className="text-xs font-semibold md:text-base text-slate-600 dark:text-slate-200">
        보유 중인 종목이 없습니다.
      </div>
      <div className="mt-2 text-[10px] md:text-sm">
        코인을 클릭하여 모의투자를 시작하세요
      </div>
    </div>
  );
};

export default EmptyPositions;
