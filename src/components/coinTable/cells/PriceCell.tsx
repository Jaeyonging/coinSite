import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatPrice } from '../../../utils/formatters';
import { PriceChangeDirection } from '../../../types/coin.types';
import { ANIMATION_DURATION } from '../../../utils/constants';

interface PriceCellProps {
  krwPrice: number | null;
  usPrice: number;
  todayDollar: number;
  animation: PriceChangeDirection;
}

const PriceCell = React.memo(({
  krwPrice,
  usPrice,
  todayDollar,
  animation,
}: PriceCellProps) => {
  const [binanceAnimation, setBinanceAnimation] = useState<PriceChangeDirection>(null);
  const prevBinancePriceRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const binanceKrwPrice = useMemo(() => {
    if (!usPrice || usPrice === 0 || !todayDollar) return null;
    const converted = usPrice * todayDollar;
    const normalized =
      converted < 100 ? parseFloat(converted.toFixed(2)) : parseFloat(converted.toFixed(1));
    return normalized;
  }, [usPrice, todayDollar]);

  const binancePrice = binanceKrwPrice !== null ? `${formatPrice(binanceKrwPrice)}원` : '';

  useEffect(() => {
    if (binanceKrwPrice === null) return;
    const prevPrice = prevBinancePriceRef.current;

    if (prevPrice !== null && prevPrice !== binanceKrwPrice) {
      const nextAnimation = binanceKrwPrice > prevPrice ? 'up' : 'down';
      setBinanceAnimation(nextAnimation);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (typeof window !== 'undefined') {
        timeoutRef.current = window.setTimeout(() => {
          setBinanceAnimation((current) => (current === nextAnimation ? null : current));
          timeoutRef.current = null;
        }, ANIMATION_DURATION.PRICE_CHANGE);
      }
    }

    prevBinancePriceRef.current = binanceKrwPrice;
  }, [binanceKrwPrice]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const colorClass = animation === 'up' 
    ? 'text-rise' 
    : animation === 'down' 
    ? 'text-fall' 
    : 'text-gray-900';
  const binanceColorClass = binanceAnimation === 'up'
    ? 'text-rise'
    : binanceAnimation === 'down'
    ? 'text-fall'
    : 'text-gray-500';

  return (
    <td className="text-center py-2 px-0 sm:py-1 sm:px-0 md:py-3 md:px-2 border-none align-middle first:pl-1 sm:first:pl-0.5 md:first:pl-5 last:pr-1 sm:last:pr-0.5 md:last:pr-5 md:whitespace-nowrap md:min-w-[80px] sm:whitespace-normal sm:break-words sm:min-w-0">
      <div className="flex flex-col items-center">
        <span
          className={`text-[9px] sm:text-[9px] md:text-sm font-semibold leading-normal ${colorClass} ${animation ? 'transition-colors duration-150 ease-in-out' : ''} ${animation ? 'will-change-[color]' : ''} px-1 sm:px-1 md:px-1.5 whitespace-nowrap`}
        >
          {formatPrice(krwPrice)}원
        </span>
        {binancePrice && (
          <span
            className={`text-[7px] sm:text-[7px] md:text-xs mt-0.5 sm:mt-0.5 md:mt-1 text-center font-normal whitespace-nowrap ${binanceAnimation ? 'transition-colors duration-150 ease-in-out' : ''} ${binanceAnimation ? 'will-change-[color]' : ''} ${binanceColorClass}`}
          >
            {binancePrice}
          </span>
        )}
      </div>
    </td>
  );
});

export default PriceCell;
