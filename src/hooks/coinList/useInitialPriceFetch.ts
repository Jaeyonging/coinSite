import { useEffect, useMemo } from 'react';
import { fetchKRWPrice } from '../../store/coinKrwPriceSlice';
import { useAppDispatch } from '../useAppDispatch';

export const useInitialPriceFetch = (marketCodes: string[]) => {
  const dispatch = useAppDispatch();
  const marketString = useMemo(() => marketCodes.join(','), [marketCodes]);

  useEffect(() => {
    if (!marketString) return;
    dispatch(fetchKRWPrice(marketString));
  }, [dispatch, marketString]);
};
