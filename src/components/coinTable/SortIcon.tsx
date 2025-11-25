import React from 'react';

interface SortIconProps {
  sortKey: string;
  currentSortKey: string | null;
  direction: string | null;
  isRendered: boolean;
}

const SortIcon = ({
  sortKey,
  currentSortKey,
  direction,
  isRendered,
}: SortIconProps) => {
  if (!isRendered) {
    return <span className="text-[10px] inline-block align-middle">△▽</span>;
  }

  if (currentSortKey !== sortKey) {
    return <span className="text-[10px] inline-block align-middle">△▽</span>;
  }

  if (direction === 'ascending') {
    return <span className="text-[10px] inline-block align-middle">▲▽</span>;
  } else if (direction === 'descending') {
    return <span className="text-[10px] inline-block align-middle">△▼</span>;
  }

  return <span className="text-[10px] inline-block align-middle">△▽</span>;
};

export default SortIcon;
