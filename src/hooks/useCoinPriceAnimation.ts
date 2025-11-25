import { useEffect, useState, useRef } from 'react';
import { KrwCoinPriceState } from '../types/coin.types';
import { PriceChangeDirection } from '../types/coin.types';
import { ANIMATION_DURATION } from '../utils/constants';


export const useCoinPriceAnimation = (
  coinPrices: KrwCoinPriceState['coins'],
  fetchFinished: boolean
) => {
  const [animations, setAnimations] = useState<{ [key: string]: PriceChangeDirection }>({});
  const prevPricesRef = useRef<{ [key: string]: number }>({});
  const timeoutRefsRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    if (!fetchFinished) return;

    const rafId = requestAnimationFrame(() => {
      const newAnimations: { [key: string]: PriceChangeDirection } = {};
      const marketsToUpdate: string[] = [];

      Object.keys(coinPrices).forEach((market) => {
        const currentPrice = coinPrices[market]?.krwprice;
        const prevPrice = prevPricesRef.current[market];

        if (currentPrice !== undefined && prevPrice !== undefined && currentPrice !== prevPrice) {
          if (currentPrice > prevPrice) {
            newAnimations[market] = 'up';
          } else if (currentPrice < prevPrice) {
            newAnimations[market] = 'down';
          }
          marketsToUpdate.push(market);

          if (timeoutRefsRef.current[market]) {
            clearTimeout(timeoutRefsRef.current[market]);
          }

          timeoutRefsRef.current[market] = setTimeout(() => {
            setAnimations((prev) => {
              const updated = { ...prev };
              if (updated[market] === newAnimations[market]) {
                updated[market] = null;
              }
              delete timeoutRefsRef.current[market];
              return updated;
            });
          }, ANIMATION_DURATION.PRICE_CHANGE);
        }

        if (currentPrice !== undefined) {
          prevPricesRef.current[market] = currentPrice;
        }
      });

      if (marketsToUpdate.length > 0) {
        setAnimations((prev) => {
          const updated = { ...prev };
          marketsToUpdate.forEach((market) => {
            updated[market] = newAnimations[market];
          });
          return updated;
        });
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [coinPrices, fetchFinished]);

  useEffect(() => {
    return () => {
      Object.values(timeoutRefsRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  return animations;
};
