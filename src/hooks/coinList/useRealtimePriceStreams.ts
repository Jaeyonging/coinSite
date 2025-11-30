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

    const trackedSymbols = new Set(
      coinNames
        .map((pair) => pair.split('-')[1]?.toUpperCase())
        .filter((symbol): symbol is string => Boolean(symbol))
    );
    if (trackedSymbols.size === 0) {
      return;
    }

    const upbitWS = new WebSocket('wss://api.upbit.com/websocket/v1');
    const binanceWS = new WebSocket('wss://fstream.binance.com/ws/!markPrice@arr@1s');

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

    const processBinancePayload = (payload: any) => {
      if (!payload) return;

      let entries: any[] = [];
      if (Array.isArray(payload)) {
        entries = payload;
      } else if (Array.isArray(payload.data)) {
        entries = payload.data;
      } else if (payload.data) {
        entries = [payload.data];
      } else {
        entries = [payload];
      }

      let hasUpdate = false;

      entries.forEach((entry) => {
        if (!entry || !entry.s) return;
        const usSymbol = entry.s.replace('USDT', '').toUpperCase();
        if (!trackedSymbols.has(usSymbol)) return;
        const priceValue = entry.p ?? entry.markPrice;
        const parsedPrice = parseFloat(priceValue);
        if (Number.isNaN(parsedPrice)) return;
        usUpdateQueue.set(usSymbol, { usprice: parsedPrice });
        hasUpdate = true;
      });

      if (hasUpdate) {
        scheduleUpdate();
      }
    };

    binanceWS.onmessage = (e) => {
      if (typeof e.data === 'string') {
        try {
          const parsed = JSON.parse(e.data);
          processBinancePayload(parsed);
        } catch (parseError) {
          console.error('Binance data parse error:', parseError, e.data);
        }
        return;
      }

      (e.data as Blob)
        .text()
        .then((text) => {
          try {
            const parsed = JSON.parse(text);
            processBinancePayload(parsed);
          } catch (parseError) {
            console.error('Binance data parse error:', parseError, text);
          }
        })
        .catch((error) => {
          console.error('Binance WS blob parse error:', error);
        });
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
