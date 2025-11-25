import React from 'react';

interface TableHeaderProps {
  isMobile: boolean;
}

const TableHeader = ({ isMobile }: TableHeaderProps) => {
  const headerCellClass = isMobile
    ? 'py-1.5 px-0.5 text-[8px] font-semibold text-gray-600 w-[25%]'
    : 'py-3 px-4 text-xs font-semibold text-gray-600';

  return (
    <thead>
      <tr className="bg-gray-50 border-b-2 border-gray-300">
        <th className={`${headerCellClass} text-left`}>
          종목
        </th>
        {!isMobile && (
          <>
            <th className={`${headerCellClass} text-right`}>
              투자금액
            </th>
            <th className={`${headerCellClass} text-right`}>
              보유수량
            </th>
            <th className={`${headerCellClass} text-right`}>
              평균단가
            </th>
          </>
        )}
        <th className={`${headerCellClass} text-right`}>
          {isMobile ? '평단가' : '현재가'}
        </th>
        <th className={`${headerCellClass} text-right`}>
          {isMobile ? '현재가' : '평가금액'}
        </th>
        <th className={`${headerCellClass} text-right`}>
          {isMobile ? '손익률' : '수익/손실'}
        </th>
        {!isMobile && (
          <th className={`${headerCellClass} text-center`}>
            일자
          </th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;
