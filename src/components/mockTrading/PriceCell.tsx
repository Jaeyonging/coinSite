import React from 'react';
import { KrwCoinPrice } from '../../types/coin.types';
import { formatPrice } from '../../utils/formatters';

interface PriceCellProps {
  price: number;
  change?: KrwCoinPrice['change'];
  isMobile: boolean;
}

const PriceCell = ({ price, change, isMobile }: PriceCellProps) => {
  const color =
    change === 'RISE' ? '#198754' : change === 'FALL' ? '#dc3545' : '#212529';

  const colorClass = change === 'RISE' ? 'text-rise' : change === 'FALL' ? 'text-fall' : 'text-gray-900';

  return (
    <td className="py-1.5 px-0 md:py-3.5 md:px-3 text-[9px] md:text-sm text-right font-semibold">
      <span className={colorClass}>{formatPrice(price)}원</span>
    </td>
  );
};

export default PriceCell;
