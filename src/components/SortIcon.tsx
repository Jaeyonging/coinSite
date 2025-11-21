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
    return <span style={{ fontSize: '10px' }}>△▽</span>;
  }

  if (currentSortKey !== sortKey) {
    return <span style={{ fontSize: '10px' }}>△▽</span>;
  }

  if (direction === 'ascending') {
    return <span style={{ fontSize: '10px' }}>▲▽</span>;
  } else if (direction === 'descending') {
    return <span style={{ fontSize: '10px' }}>△▼</span>;
  }

  return <span style={{ fontSize: '10px' }}>△▽</span>;
};

export default SortIcon;
