import { useEffect } from 'react';
import { fetchUpbitMarkets } from '../../api/services/upbit.service';
import { useAppDispatch } from '../useAppDispatch';
import { setCoinNames } from '../../store/coinsSlice';
import { syncCoins } from '../../store/upbitCoinsSlice';
import { setUSCoin } from '../../store/coinUsPriceSlice';
import { UpbitCoin } from '../../types/coin.types';

export const useMarketInitialization = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    fetchUpbitMarkets()
      .then((data) => {
        if (!isMounted) return;

        const krwCoins = data.filter((coin) => coin.market.startsWith('KRW-'));
        const newUpbitCoinState: { [key: string]: UpbitCoin } = {};
        const newUSCOIN: { [key: string]: { usSymbol: string; usprice: number } } = {};

        const marketCodes: string[] = [];
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
          marketCodes.push(coin.market);
        });
        dispatch(setCoinNames(marketCodes));
        dispatch(syncCoins(newUpbitCoinState));
        dispatch(setUSCoin(newUSCOIN));
      })
      .catch((error) => {
        console.error('Error fetching KRW coins:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};
