import { useEffect, useState, useMemo, useCallback } from 'react';
import { setCoinName } from '../store/coinsSlice';
import { syncCoins } from '../store/upbitCoinsSlice';
import { fetchKRWPrice, syncKRWPrice2 } from '../store/coinKrwPriceSlice';
import { setUSCoin, syncUSPRICE } from '../store/coinUsPriceSlice';
import { useCoinPriceAnimation } from './useCoinPriceAnimation';
import { useFavorites } from './useFavorites';
import { UpbitCoin } from '../types/coin.types';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { fetchExchangeRate } from '../api/services/exchange-rate.service';
import { fetchUpbitMarkets } from '../api/services/upbit.service';

export const useCoinList = () => {
  const [todayDollar, setTodayDollar] = useState<number>(0);
  const [fetchFinished, setFetchedFinished] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRendered, setIsRendered] = useState(false);
  const [error, setError] = useState('');
  const [expandedCharts, setExpandedCharts] = useState<{ [key: string]: boolean }>({});

  const dispatch = useAppDispatch();
  const coinsState = useAppSelector((state) => state.coins);
  const coinKrwPriceState = useAppSelector((state) => state.coinKrwPrice);
  const coinUSPriceState = useAppSelector((state) => state.coinUsPrice);
  const upbitCoinState = useAppSelector((state) => state.upbitCoins);

  const priceAnimations = useCoinPriceAnimation(coinKrwPriceState.coins, fetchFinished);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // 환율 및 코인 목록 초기 로드
  useEffect(() => {
    fetchExchangeRate()
      .then((dollar) => {
        setTodayDollar(dollar);
      })
      .catch((error) => {
        setTodayDollar(1389);
        console.error("Error fetching today's dollar:", error);
      });

    fetchUpbitMarkets()
      .then((data) => {
        const krwCoins = data.filter((coin) => coin.market.startsWith('KRW-'));
        const newUpbitCoinState: { [key: string]: UpbitCoin } = {};
        const newUSCOIN: { [key: string]: { usSymbol: string; usprice: number } } = {};

        krwCoins.forEach((coin) => {
          const coinSymbol = coin.market.substring(4);
          newUpbitCoinState[coinSymbol] = {
            english_name: coin.english_name,
            korean_name: coin.korean_name,
            market_KRW: coin.market,
            market_USDT: coinSymbol + 'USDT',
          };
          newUSCOIN[coinSymbol] = {
            usSymbol: coinSymbol,
            usprice: 0,
          };
          dispatch(setCoinName(coin.market));
        });
        dispatch(syncCoins(newUpbitCoinState));
        dispatch(setUSCoin(newUSCOIN));
      })
      .catch((error) => {
        console.error('Error fetching KRW coins:', error);
      });
  }, [dispatch]);

  // 가격 로딩 완료 체크 및 초기 정렬 설정
  useEffect(() => {
    if (coinKrwPriceState.loading === 'success') {
      setFetchedFinished(true);
      // 초기 로드 시 가격 높은 순으로 정렬
      if (!sortConfig) {
        setSortConfig({ key: 'price', direction: 'descending' });
        setIsRendered(true);
      }
    }
  }, [coinKrwPriceState.loading, sortConfig]);

  // 초기 가격 조회
  useEffect(() => {
    const markets = coinsState.coinNames.join(',');
    if (markets) {
      dispatch(fetchKRWPrice(markets));
    }
  }, [upbitCoinState, coinsState.coinNames, dispatch]);

  // WebSocket 연결
  useEffect(() => {
    if (fetchFinished) {
      const upbitWS = new WebSocket('wss://api.upbit.com/websocket/v1');
      const convertedPairs = coinsState.coinNames.map((pair) => {
        const currency = pair.split('-')[1].toLowerCase();
        return `${currency}usdt@markPrice@1s`;
      });
      const combinedString = convertedPairs.join('/');
      const binanceWS = new WebSocket(`wss://fstream.binance.com/stream?streams=${combinedString}`);

      // 배치 업데이트를 위한 큐
      const krwUpdateQueue: Map<string, any> = new Map();
      const usUpdateQueue: Map<string, any> = new Map();
      let rafScheduled = false;

      const flushUpdates = () => {
        if (krwUpdateQueue.size > 0) {
          krwUpdateQueue.forEach((updatedCoin, code) => {
            dispatch(syncKRWPrice2({ code, updatedCoin }));
          });
          krwUpdateQueue.clear();
        }
        if (usUpdateQueue.size > 0) {
          usUpdateQueue.forEach((updatedCoin, code) => {
            dispatch(syncUSPRICE({ code, updatedCoin }));
          });
          usUpdateQueue.clear();
        }
        rafScheduled = false;
      };

      const scheduleUpdate = () => {
        if (!rafScheduled) {
          rafScheduled = true;
          requestAnimationFrame(flushUpdates);
        }
      };

      binanceWS.onopen = () => {
        console.log('Binance WebSocket connected');
      };

      binanceWS.onmessage = (e) => {
        try {
          // 바이낸스는 텍스트 형식으로 데이터를 보냄
          const handleData = (text: string) => {
            try {
              const parsed = JSON.parse(text);
              // 바이낸스 스트림 형식: { stream: "...", data: { s: "BTCUSDT", p: "50000", ... } }
              if (parsed.data && parsed.data.s && parsed.data.p) {
                const updatedCoins = parsed.data;
                // BTCUSDT -> BTC로 변환 (대문자 유지)
                const usSymbol = updatedCoins.s.replace('USDT', '').toUpperCase();
                const updatedCoin = { usprice: parseFloat(updatedCoins.p) };
                usUpdateQueue.set(usSymbol, updatedCoin);
                scheduleUpdate();
              }
            } catch (parseError) {
              console.error('Binance data parse error:', parseError, text);
            }
          };

          if (typeof e.data === 'string') {
            handleData(e.data);
          } else {
            // Blob.text()가 더 최적화되어 있음
            (e.data as Blob).text().then(handleData).catch((error) => {
              console.error('Binance WS blob parse error:', error);
            });
          }
        } catch (error) {
          console.error('Binance WS error:', error);
        }
      };

      binanceWS.onerror = (error) => {
        console.error('Binance WebSocket error:', error);
      };

      binanceWS.onclose = () => {
        console.log('Binance WebSocket closed');
      };

      upbitWS.onopen = () => {
        upbitWS.send(
          JSON.stringify([
            { ticket: 'test example' },
            { type: 'ticker', codes: coinsState.coinNames },
            { format: 'DEFAULT' },
          ])
        );
      };

      upbitWS.onerror = () => {
        setError('웹소켓이 불안정합니다. F5를 눌러 새로고침을 해주세요');
      };

      upbitWS.onmessage = (e) => {
        try {
          // Blob.text()를 사용하여 비동기 처리 (배치 업데이트와 함께)
          (e.data as Blob).text().then((text) => {
            try {
              const updatedCoins = JSON.parse(text);
              if (updatedCoins.code) {
                const coinSymbol = updatedCoins.code.substring(4);
                const updatedCoin = {
                  krwSymbol: coinSymbol,
                  krwprice: updatedCoins.trade_price,
                  prevPrice: updatedCoins.prev_closing_price,
                  change: updatedCoins.change,
                  changePercent: updatedCoins.change_rate * 100,
                  absValue: updatedCoins.change_price,
                };
                krwUpdateQueue.set(coinSymbol, updatedCoin);
                scheduleUpdate();
              }
            } catch (parseError) {
              console.error('Upbit WS parse error:', parseError);
            }
          }).catch((error) => {
            console.error('Upbit WS blob parse error:', error);
          });
        } catch (error) {
          console.error('Upbit WS error:', error);
        }
      };

      return () => {
        upbitWS.close();
        binanceWS.close();
      };
    }
  }, [fetchFinished, coinsState.coinNames, dispatch]);

  // 정렬 핸들러
  const handleSort = useCallback(
    (key: string) => {
      setIsRendered(true);
      let direction = 'ascending';
      if (sortConfig && sortConfig.key === key) {
        if (sortConfig.direction === 'ascending') {
          direction = 'descending';
        } else if (sortConfig.direction === 'descending') {
          direction = 'default';
        }
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  // 정렬된 코인 목록 (즐겨찾기 우선)
  const sortedCoins = useMemo(() => {
    const allMarkets = Object.keys(upbitCoinState);
    
    // 즐겨찾기와 일반 코인 분리
    const favoriteMarkets = allMarkets.filter(market => favorites.includes(market));
    const normalMarkets = allMarkets.filter(market => !favorites.includes(market));

    // 각 그룹 내에서 정렬
    const sortMarkets = (markets: string[]) => {
      const sorted = [...markets];
      
      // 기본 상태일 때 가격 높은 순으로 정렬
      if (!sortConfig || sortConfig.direction === 'default') {
        sorted.sort((a, b) => {
          const valueA = coinKrwPriceState.coins[a]?.krwprice ?? 0;
          const valueB = coinKrwPriceState.coins[b]?.krwprice ?? 0;
          return valueB - valueA; // 내림차순 (높은 가격 먼저)
        });
        return sorted;
      }

      sorted.sort((a, b) => {
        const coinA = upbitCoinState[a];
        const coinB = upbitCoinState[b];
        let comparison = 0;

        let valueA, valueB;
        switch (sortConfig.key) {
          case 'koreanName':
            comparison = coinA.korean_name.localeCompare(coinB.korean_name);
            break;
          case 'price':
            valueA = coinKrwPriceState.coins[a]?.krwprice ?? 0;
            valueB = coinKrwPriceState.coins[b]?.krwprice ?? 0;
            comparison = valueA - valueB;
            break;
          case 'kimp':
            const usPriceA = coinUSPriceState[a]?.usprice ?? 0;
            const usPriceB = coinUSPriceState[b]?.usprice ?? 0;
            valueA =
              ((coinKrwPriceState.coins[a].krwprice - usPriceA * todayDollar) /
                (usPriceA * todayDollar)) *
              100;
            valueB =
              ((coinKrwPriceState.coins[b].krwprice - usPriceB * todayDollar) /
                (usPriceB * todayDollar)) *
              100;
            comparison = valueA - valueB;
            break;
          case 'prevPrice':
            valueA = coinKrwPriceState.coins[a]?.prevPrice ?? 0;
            valueB = coinKrwPriceState.coins[b]?.prevPrice ?? 0;
            comparison = valueA - valueB;
            break;
          case 'absValue':
            valueA = coinKrwPriceState.coins[a]?.absValue ?? 0;
            valueB = coinKrwPriceState.coins[b]?.absValue ?? 0;
            const actualValueA = coinKrwPriceState.coins[a]?.change === 'RISE' ? valueA : -valueA;
            const actualValueB = coinKrwPriceState.coins[b]?.change === 'RISE' ? valueB : -valueB;
            comparison = actualValueA - actualValueB;
            break;
          case 'changePercent':
            valueA = coinKrwPriceState.coins[a]?.changePercent ?? 0;
            valueB = coinKrwPriceState.coins[b]?.changePercent ?? 0;
            const actualPercentA = coinKrwPriceState.coins[a]?.change === 'RISE' ? valueA : -valueA;
            const actualPercentB = coinKrwPriceState.coins[b]?.change === 'RISE' ? valueB : -valueB;
            comparison = actualPercentA - actualPercentB;
            break;
          default:
            return 0;
        }

        if (sortConfig.direction === 'descending') {
          comparison *= -1;
        }

        return comparison;
      });

      return sorted;
    };

    // 즐겨찾기 먼저, 그 다음 일반 코인
    return [...sortMarkets(favoriteMarkets), ...sortMarkets(normalMarkets)];
  }, [sortConfig, upbitCoinState, coinKrwPriceState, coinUSPriceState, todayDollar, favorites]);

  // 필터링된 코인 목록
  const filteredCoins = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return sortedCoins.filter((market) => {
      const coin = upbitCoinState[market];
      return (
        coin.korean_name.toLowerCase().includes(searchLower) ||
        coin.english_name.toLowerCase().includes(searchLower)
      );
    });
  }, [sortedCoins, searchTerm, upbitCoinState]);

  // 차트 토글 핸들러
  const handleChartToggle = useCallback((market: string) => {
    setExpandedCharts((prev) => ({
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
    expandedCharts,
    priceAnimations,
    filteredCoins,
    upbitCoinState,
    coinKrwPriceState,
    coinUSPriceState,
    favorites,
    isFavorite,
    toggleFavorite,
    handleSort,
    handleChartToggle,
  };
};
