import React from 'react';
import SortIcon from './SortIcon';

interface TableHeaderProps {
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: string } | null;
  isRendered: boolean;
}

const TableHeader = ({
  onSort,
  sortConfig,
  isRendered,
}: TableHeaderProps) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  const isTablet = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <thead>
      <tr>
        <th onClick={() => onSort('koreanName')}>
          <span className="coinName">{isMobile ? '이름' : isTablet ? '코인명' : 'Korean Name'}</span>{' '}
          <SortIcon
            sortKey="koreanName"
            currentSortKey={sortConfig?.key || null}
            direction={sortConfig?.direction || null}
            isRendered={isRendered}
          />
        </th>
        <th onClick={() => onSort('price')} style={{ textAlign: 'center' }}>
          <span className="coinPrice">{isMobile ? '가격' : 'Price'}</span>{' '}
          <SortIcon
            sortKey="price"
            currentSortKey={sortConfig?.key || null}
            direction={sortConfig?.direction || null}
            isRendered={isRendered}
          />
        </th>
        <th onClick={() => onSort('kimp')}>
          <span className="kimp">{isMobile ? '김프' : '김치프리미엄'}</span>{' '}
          <SortIcon
            sortKey="kimp"
            currentSortKey={sortConfig?.key || null}
            direction={sortConfig?.direction || null}
            isRendered={isRendered}
          />
        </th>
        <th className="display-none" onClick={() => onSort('prevPrice')}>
          <span className="prevPrice">전일종가</span>{' '}
          <SortIcon
            sortKey="prevPrice"
            currentSortKey={sortConfig?.key || null}
            direction={sortConfig?.direction || null}
            isRendered={isRendered}
          />
        </th>
        <th onClick={() => onSort('absValue')}>
          <span className="prevalue">{isMobile ? '변동' : '변동액'}</span>{' '}
          <SortIcon
            sortKey="absValue"
            currentSortKey={sortConfig?.key || null}
            direction={sortConfig?.direction || null}
            isRendered={isRendered}
          />
        </th>
        <th onClick={() => onSort('changePercent')}>
          <span className="prepercent">{isMobile ? '변화율' : '변화율'}</span>{' '}
          <SortIcon
            sortKey="changePercent"
            currentSortKey={sortConfig?.key || null}
            direction={sortConfig?.direction || null}
            isRendered={isRendered}
          />
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
