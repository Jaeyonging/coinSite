import { useMemo } from 'react';
import { UpbitCoin } from '../../types/coin.types';
import { KrwCoinPrice } from '../../types/coin.types';

type SortDirection = 'ascending' | 'descending' | 'default';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface SortedMarketsParams {
  sortConfig: SortConfig | null;
  todayDollar: number;
  favorites: string[];
  upbitCoinState: { [key: string]: UpbitCoin };
  krwPrices: { [key: string]: KrwCoinPrice };
  usPrices: { [key: string]: { usprice: number } };
  searchTerm: string;
}

const getKimchiPremium = (
  krwCoin: KrwCoinPrice | undefined,
  usPrice: number | undefined,
  todayDollar: number
) => {
  if (!krwCoin || !usPrice || !todayDollar) {
    return 0;
  }
  if (usPrice === 0) return 0;

  const denominator = usPrice * todayDollar;
  if (denominator === 0) return 0;

  return ((krwCoin.krwprice - denominator) / denominator) * 100;
};

const toActualValue = (value: number, change?: string) => {
  if (!change) return value;
  return change === 'RISE' ? value : -value;
};

export const useSortedFilteredMarkets = ({
  sortConfig,
  todayDollar,
  favorites,
  upbitCoinState,
  krwPrices,
  usPrices,
  searchTerm,
}: SortedMarketsParams) => {
  const sortedMarkets = useMemo(() => {
    const allMarkets = Object.keys(upbitCoinState);

    const favoriteMarkets = allMarkets.filter((market) => favorites.includes(market));
    const normalMarkets = allMarkets.filter((market) => !favorites.includes(market));

    const sortMarkets = (markets: string[]) => {
      const sorted = [...markets];

      if (!sortConfig || sortConfig.direction === 'default') {
        sorted.sort((a, b) => {
          const valueA = krwPrices[a]?.krwprice ?? 0;
          const valueB = krwPrices[b]?.krwprice ?? 0;
          return valueB - valueA;
        });
        return sorted;
      }

      sorted.sort((a, b) => {
        const coinA = upbitCoinState[a];
        const coinB = upbitCoinState[b];
        if (!coinA || !coinB) {
          return 0;
        }

        let comparison = 0;
        let valueA: number;
        let valueB: number;

        switch (sortConfig.key) {
          case 'koreanName':
            comparison = coinA.korean_name.localeCompare(coinB.korean_name);
            break;
          case 'price':
            valueA = krwPrices[a]?.krwprice ?? 0;
            valueB = krwPrices[b]?.krwprice ?? 0;
            comparison = valueA - valueB;
            break;
          case 'kimp':
            valueA = getKimchiPremium(krwPrices[a], usPrices[a]?.usprice, todayDollar);
            valueB = getKimchiPremium(krwPrices[b], usPrices[b]?.usprice, todayDollar);
            comparison = valueA - valueB;
            break;
          case 'prevPrice':
            valueA = krwPrices[a]?.prevPrice ?? 0;
            valueB = krwPrices[b]?.prevPrice ?? 0;
            comparison = valueA - valueB;
            break;
          case 'absValue':
            valueA = toActualValue(krwPrices[a]?.absValue ?? 0, krwPrices[a]?.change);
            valueB = toActualValue(krwPrices[b]?.absValue ?? 0, krwPrices[b]?.change);
            comparison = valueA - valueB;
            break;
          case 'changePercent':
            valueA = toActualValue(krwPrices[a]?.changePercent ?? 0, krwPrices[a]?.change);
            valueB = toActualValue(krwPrices[b]?.changePercent ?? 0, krwPrices[b]?.change);
            comparison = valueA - valueB;
            break;
          case 'accTradePrice24h':
            valueA = krwPrices[a]?.accTradePrice24h ?? 0;
            valueB = krwPrices[b]?.accTradePrice24h ?? 0;
            comparison = valueA - valueB;
            break;
          default:
            comparison = 0;
        }

        if (sortConfig.direction === 'descending') {
          comparison *= -1;
        }
        return comparison;
      });

      return sorted;
    };

    return [...sortMarkets(favoriteMarkets), ...sortMarkets(normalMarkets)];
  }, [favorites, krwPrices, sortConfig, todayDollar, upbitCoinState, usPrices]);

  const filteredMarkets = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return sortedMarkets.filter((market) => {
      const coin = upbitCoinState[market];
      if (!coin) return false;
      return (
        coin.korean_name.toLowerCase().includes(searchLower) ||
        coin.english_name.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm, sortedMarkets, upbitCoinState]);

  return {
    sortedMarkets,
    filteredMarkets,
  };
};
