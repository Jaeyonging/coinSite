import React from 'react';

const ChartEmptyState = () => {
  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white/90 py-10 px-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-3 text-[32px]">📉</div>
      <div className="text-[15px] font-medium text-slate-500 dark:text-slate-300">
        데이터가 없습니다.
      </div>
    </div>
  );
};

export default ChartEmptyState;
