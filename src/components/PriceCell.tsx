import React from 'react';
import { formatPrice } from '../utils/formatters';
import { COLORS, ANIMATION_DURATION } from '../utils/constants';
import { PriceChangeDirection } from '../types/coin.types';

interface PriceCellProps {
  krwPrice: number;
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  const binancePrice =
    usPrice && usPrice !== 0
      ? formatPrice(
          usPrice * todayDollar < 100
            ? parseFloat((usPrice * todayDollar).toFixed(2))
            : parseFloat((usPrice * todayDollar).toFixed(1))
        ) + '원'
      : '';

  return (
    <td style={{ textAlign: 'center' }}>
      <div
        className="font-10px"
        style={{
          color:
            animation === 'up'
              ? COLORS.RISE
              : animation === 'down'
              ? COLORS.FALL
              : '#212529',
          transition: animation ? `color ${ANIMATION_DURATION.TRANSITION}ms ease` : 'none',
          padding: isMobile ? '2px 4px' : '4px 8px',
          display: 'inline-block',
          fontWeight: 600,
          fontSize: isMobile ? '9px' : '15px',
          willChange: animation ? 'color' : 'auto',
          whiteSpace: isMobile ? 'nowrap' : 'normal',
        }}
      >
        {formatPrice(krwPrice)}원
      </div>
      {binancePrice && (
        <div className="binance" style={{ textAlign: 'center', whiteSpace: isMobile ? 'nowrap' : 'normal' }}>{binancePrice}</div>
      )}
    </td>
  );
});

export default PriceCell;
