import React from 'react';
import { formatPrice } from '../../../utils/formatters';

interface ChangeCellProps {
  value: number;
  change: string;
  isPercent?: boolean;
  absValue?: number;
}

const ChangeCell = ({ value, change, isPercent = false, absValue }: ChangeCellProps) => {
  const displayValue = isPercent ? value.toFixed(2) + '%' : formatPrice(value) + '원';
  const absDisplayValue = absValue !== undefined ? formatPrice(absValue) + '원' : '';

  if (change === 'RISE') {
    return (
      <td className="text-[9px] md:text-sm font-medium text-gray-900 leading-normal py-2 px-0 sm:py-1 sm:px-0 sm:pr-0 sm:-mr-0.5 md:py-3 md:px-2 border-none align-middle first:pl-1 sm:first:pl-0.5 md:first:pl-5 last:pr-1 sm:last:pr-0.5 md:last:pr-5 md:whitespace-nowrap md:min-w-[80px] sm:whitespace-nowrap sm:break-words sm:min-w-0 text-center dark:text-white">
        <div className="flex flex-col">
          <span className="text-rise font-semibold">+{displayValue}</span>
          {isPercent && absValue !== undefined && (
            <span className="text-[7px] md:text-[10px] text-gray-500 mt-0.5 dark:text-slate-400">+{absDisplayValue}</span>
          )}
        </div>
      </td>
    );
  } else if (change === 'FALL') {
    return (
      <td className="text-[9px] md:text-sm font-medium text-gray-900 leading-normal py-2 px-0 sm:py-1 sm:px-0 sm:pr-0 sm:-mr-0.5 md:py-3 md:px-2 border-none align-middle first:pl-1 sm:first:pl-0.5 md:first:pl-5 last:pr-1 sm:last:pr-0.5 md:last:pr-5 md:whitespace-nowrap md:min-w-[80px] sm:whitespace-nowrap sm:break-words sm:min-w-0 text-center dark:text-white">
        <div className="flex flex-col">
          <span className="text-fall font-semibold">-{displayValue}</span>
          {isPercent && absValue !== undefined && (
            <span className="text-[7px] md:text-[10px] text-gray-500 mt-0.5 dark:text-slate-400">-{absDisplayValue}</span>
          )}
        </div>
      </td>
    );
  }

  return (
    <td className="text-[9px] md:text-sm font-medium text-gray-900 leading-normal py-2 px-0 sm:py-2 sm:px-0 sm:pr-0 md:py-3 md:px-2 border-none align-middle first:pl-1 sm:first:pl-1 md:first:pl-5 last:pr-1 sm:last:pr-1 md:last:pr-5 md:whitespace-nowrap md:min-w-[80px] sm:whitespace-nowrap sm:break-words sm:min-w-0 text-center dark:text-white">
      <div className="flex flex-col">
        <span>{displayValue}</span>
        {isPercent && absValue !== undefined && (
          <span className="text-[7px] md:text-[10px] text-gray-500 mt-0.5 dark:text-slate-400">{absValue >= 0 ? '+' : ''}{absDisplayValue}</span>
        )}
      </div>
    </td>
  );
};

export default ChangeCell;
