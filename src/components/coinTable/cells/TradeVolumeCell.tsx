import React from 'react';
import { formatTradeVolume } from '../../../utils/formatters';

interface TradeVolumeCellProps {
  accTradePrice24h: number;
}

const TradeVolumeCell = ({ accTradePrice24h }: TradeVolumeCellProps) => {
  const displayValue = formatTradeVolume(accTradePrice24h);

  return (
    <td className="text-[9px] md:text-sm font-medium text-gray-900 leading-normal py-2 px-0 sm:py-1 sm:px-0 sm:pl-0 sm:-ml-0.5 md:py-3 md:px-2 border-none align-middle first:pl-1 sm:first:pl-0.5 md:first:pl-5 last:pr-1 sm:last:pr-0.5 md:last:pr-5 md:whitespace-nowrap md:min-w-[80px] sm:whitespace-nowrap sm:break-words sm:min-w-0 text-center">
      {displayValue}
    </td>
  );
};

export default TradeVolumeCell;
