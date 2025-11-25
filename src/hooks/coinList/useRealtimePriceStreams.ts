import { useEffect } from 'react';
import { useAppDispatch } from '../useAppDispatch';
import { syncKRWPrice2 } from '../../store/coinKrwPriceSlice';
import { syncUSPRICE } from '../../store/coinUsPriceSlice';

interface RealtimeOptions {
  enabled: boolean;
  coinNames: string[];
  onError: (message: string) => void;
}

export const useRealtimePriceStreams = ({
  enabled,
  coinNames,
  onError,
}: RealtimeOptions) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled || coinNames.length === 0) {
      return;
    }

    const upbitWS = new WebSocket('wss://api.upbit.com/websocket/v1');
    const convertedPairs = coinNames.map((pair) => {
      const currency = pair.split('-')[1].toLowerCase();
      return `${currency}usdt@markPrice@1s`;
    });
    const combinedString = convertedPairs.join('/');
    const binanceWS = new WebSocket(`wss://fstream.binance.com/stream?streams=${combinedString}`);

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

    binanceWS.onmessage = (e) => {
      const handleData = (text: string) => {
        try {
          const parsed = JSON.parse(text);
          if (parsed.data && parsed.data.s && parsed.data.p) {
            const updatedCoins = parsed.data;
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
        (e.data as Blob)
          .text()
          .then(handleData)
          .catch((error) => {
            console.error('Binance WS blob parse error:', error);
          });
      }
    };

    binanceWS.onerror = (error) => {
      console.error('Binance WebSocket error:', error);
    };

    upbitWS.onopen = () => {
      upbitWS.send(
        JSON.stringify([
          { ticket: 'test example' },
          { type: 'ticker', codes: coinNames },
          { format: 'DEFAULT' },
        ])
      );
    };

    upbitWS.onerror = () => {
      onError('웹소켓이 불안정합니다. F5를 눌러 새로고침을 해주세요');
    };

    upbitWS.onmessage = (e) => {
      (e.data as Blob)
        .text()
        .then((text) => {
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
                accTradePrice24h: updatedCoins.acc_trade_price_24h || 0,
              };
              krwUpdateQueue.set(coinSymbol, updatedCoin);
              scheduleUpdate();
            }
          } catch (parseError) {
            console.error('Upbit WS parse error:', parseError);
          }
        })
        .catch((error) => {
          console.error('Upbit WS blob parse error:', error);
        });
    };

    return () => {
      upbitWS.close();
      binanceWS.close();
    };
  }, [coinNames, dispatch, enabled, onError]);
};
