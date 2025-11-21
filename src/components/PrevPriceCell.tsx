import React from 'react';
import { formatPrice } from '../utils/formatters';

interface PrevPriceCellProps {
  prevPrice: number;
  change: string;
}

const PrevPriceCell = ({ prevPrice, change }: PrevPriceCellProps) => {
  return (
    <td className="font-10px display-none">
      {formatPrice(prevPrice)}원
      {change === 'RISE' ? (
        <span className="rise">⬆️</span>
      ) : change === 'FALL' ? (
        <span className="fall">⬇️</span>
      ) : (
        ''
      )}
    </td>
  );
};

export default PrevPriceCell;
