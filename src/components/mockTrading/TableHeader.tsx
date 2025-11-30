import React from 'react';

interface TableHeaderProps {
  isMobile: boolean;
}

const TableHeader = ({ isMobile }: TableHeaderProps) => {
  const headerCellClass = isMobile
    ? 'py-1.5 px-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'
    : 'py-3 px-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400';

  return (
    <thead>
      <tr className="bg-slate-50/80 border-b border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
        <th className={`${headerCellClass} text-left whitespace-nowrap`}>
          종목
        </th>
        <th className={`${headerCellClass} text-right whitespace-nowrap`}>
          투자액
        </th>
        <th className={`${headerCellClass} text-right whitespace-nowrap`}>
          평균단가
        </th>
        <th className={`${headerCellClass} text-right whitespace-nowrap`}>
          현재가
        </th>
        {isMobile && (
          <th className={`${headerCellClass} text-right whitespace-nowrap`}>
            수익률
          </th>
        )}
        <th className={`${headerCellClass} text-right whitespace-nowrap`}>
          평가금액
        </th>
        {!isMobile && (
          <th className={`${headerCellClass} text-right whitespace-nowrap`}>
            수익률
          </th>
        )}
        {!isMobile && (
          <th className={`${headerCellClass} text-center whitespace-nowrap`}>
            일자
          </th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;
