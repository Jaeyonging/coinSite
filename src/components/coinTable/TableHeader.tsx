import React from 'react';
import SortIcon from './SortIcon';

interface TableHeaderProps {
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: string } | null;
  isRendered: boolean;
}

const columns = [
  { label: '이름', key: 'koreanName', align: 'left', smWidth: 'w-[26%]' },
  { label: '가격', key: 'price', align: 'center', smWidth: 'w-[18%]' },
  { label: '김프', key: 'kimp', align: 'center', smWidth: 'w-[17%]' },
  { label: '변화율', key: 'changePercent', align: 'center', smWidth: 'w-[19%]' },
  { label: '거래액', key: 'accTradePrice24h', align: 'center', smWidth: 'w-[20%]' },
];

const TableHeader = ({ onSort, sortConfig, isRendered }: TableHeaderProps) => {
  return (
    <thead className="sticky top-0 z-10 bg-gray-50">
      <tr className="text-gray-600 font-semibold uppercase tracking-wide border-b-2 border-gray-300">
        {columns.map(({ label, key, align, smWidth }) => (
          <th
            key={key}
            onClick={() => onSort(key)}
            className={`
              cursor-pointer hover:bg-gray-100 hover:text-gray-900 select-none
              px-2 py-2 md:px-3 md:py-3
              text-[8px] md:text-[11px] lg:text-[13px]
              whitespace-nowrap
              sm:${smWidth}
              text-${align}
            `}
          >
            <div className={`flex items-center gap-0.5 justify-${align}`}>
              <span>{label}</span>
              <SortIcon
                sortKey={key}
                currentSortKey={sortConfig?.key || null}
                direction={sortConfig?.direction || null}
                isRendered={isRendered}
              />
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
