import React from 'react';
import { formatPrice } from '../../../utils/formatters';

interface PrevPriceCellProps {
  prevPrice: number | null;
  change: string;
}

const PrevPriceCell = ({ prevPrice, change }: PrevPriceCellProps) => {
  return (
    <td className="hidden text-sm font-medium text-gray-900 leading-normal py-4 px-4 border-none align-middle first:pl-5 last:pr-5 md:py-3 md:px-2 md:whitespace-nowrap md:min-w-[80px] dark:text-white">
      {formatPrice(prevPrice)}원
      {change === 'RISE' ? (
        <span className="text-rise font-semibold">⬆️</span>
      ) : change === 'FALL' ? (
        <span className="text-fall font-semibold">⬇️</span>
      ) : (
        ''
      )}
    </td>
  );
};

export default PrevPriceCell;
