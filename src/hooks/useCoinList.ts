import { useEffect, useState, useCallback } from 'react';
import { useCoinPriceAnimation } from './useCoinPriceAnimation';
import { useFavorites } from './useFavorites';
import { useAppSelector } from './useAppSelector';
import { useExchangeRate } from './coinList/useExchangeRate';
import { useMarketInitialization } from './coinList/useMarketInitialization';
import { useInitialPriceFetch } from './coinList/useInitialPriceFetch';
import { useRealtimePriceStreams } from './coinList/useRealtimePriceStreams';
import { useSortedFilteredMarkets } from './coinList/useSortedFilteredMarkets';
import { useMarketSorting } from './coinList/useMarketSorting';

export const useCoinList = () => {
  const [fetchFinished, setFetchedFinished] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState('');
  const [expandedTradingViewCharts, setExpandedTradingViewCharts] = useState<{ [key: string]: boolean }>({});

  const todayDollar = useExchangeRate();
  const coinsState = useAppSelector((state) => state.coins);
  const coinKrwPriceState = useAppSelector((state) => state.coinKrwPrice);
  const coinUSPriceState = useAppSelector((state) => state.coinUsPrice);
  const upbitCoinState = useAppSelector((state) => state.upbitCoins);

  useMarketInitialization();
  useInitialPriceFetch(coinsState.coinNames);

  const { sortConfig, isRendered, handleSort, setInitialSort } = useMarketSorting();

  const priceAnimations = useCoinPriceAnimation(coinKrwPriceState.coins, fetchFinished);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (coinKrwPriceState.loading === 'success') {
      setFetchedFinished(true);
      setError('');

      if (!sortConfig) {
        setInitialSort({ key: 'accTradePrice24h', direction: 'descending' });
      }
    } else if (coinKrwPriceState.loading === 'error') {
      setFetchedFinished(true);
      setError(
        coinKrwPriceState.error || '시세 데이터를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.'
      );
    }
  }, [coinKrwPriceState.error, coinKrwPriceState.loading, setInitialSort, sortConfig]);

  useRealtimePriceStreams({
    enabled: fetchFinished,
    coinNames: coinsState.coinNames,
    onError: setError,
  });

  const { filteredMarkets: filteredCoins } = useSortedFilteredMarkets({
    sortConfig,
    todayDollar,
    favorites,
    upbitCoinState,
    krwPrices: coinKrwPriceState.coins,
    usPrices: coinUSPriceState,
    searchTerm,
  });

  const handleTradingViewToggle = useCallback((market: string) => {
    setExpandedTradingViewCharts((prev) => ({
      ...prev,
      [market]: !prev[market],
    }));
  }, []);

  return {
    todayDollar,
    fetchFinished,
    sortConfig,
    searchTerm,
    setSearchTerm,
    isRendered,
    error,
    expandedTradingViewCharts,
    priceAnimations,
    filteredCoins,
    upbitCoinState,
    coinKrwPriceState,
    coinUSPriceState,
    isFavorite,
    toggleFavorite,
    handleSort,
    handleTradingViewToggle,
  };
};
