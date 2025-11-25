import { useCallback, useState } from 'react';

export interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending' | 'default';
}

export const useMarketSorting = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  const setInitialSort = useCallback((config: SortConfig) => {
    setSortConfig(config);
    setIsRendered(true);
  }, []);

  const handleSort = useCallback(
    (key: string) => {
      setIsRendered(true);
      setSortConfig((prevSort) => {
        if (prevSort && prevSort.key === key) {
          if (prevSort.direction === 'ascending') {
            return { key, direction: 'descending' };
          }
          if (prevSort.direction === 'descending') {
            return { key, direction: 'default' };
          }
        }
        return { key, direction: 'ascending' };
      });
    },
    []
  );

  return {
    sortConfig,
    isRendered,
    handleSort,
    setInitialSort,
  };
};
