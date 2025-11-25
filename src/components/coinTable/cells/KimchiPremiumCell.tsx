import React from 'react';
import { formatPrice } from '../../../utils/formatters';

interface KimchiPremiumCellProps {
  krwPrice: number;
  usPrice: number;
  todayDollar: number;
}

const KimchiPremiumCell = ({
  krwPrice,
  usPrice,
  todayDollar,
}: KimchiPremiumCellProps) => {
  const calculatePremium = () => {
    if (!krwPrice || !usPrice || usPrice === 0) {
      return { percentage: 'Kimchi', difference: 0 };
    }

    const premium =
      ((krwPrice - usPrice * todayDollar) / (usPrice * todayDollar)) * 100;
    const difference = krwPrice - usPrice * todayDollar;

    const percentage = isFinite(Math.floor(premium * 100) / 100)
      ? `${Math.floor(premium * 100) / 100}%`
      : 'Kimchi';

    return { percentage, difference };
  };

  const { percentage, difference } = calculatePremium();
  const isPositive = difference > 0;

  return (
    <td className="py-2 px-0 sm:py-1 sm:px-0 md:py-3 md:px-2 border-none align-middle first:pl-1 sm:first:pl-0.5 md:first:pl-5 last:pr-1 sm:last:pr-0.5 md:last:pr-5 md:whitespace-nowrap md:min-w-[80px] sm:whitespace-nowrap sm:break-words sm:min-w-0 text-center">
      <div className={`text-[9px] md:text-sm font-medium leading-normal ${isPositive ? 'text-rise' : 'text-fall'} font-semibold whitespace-nowrap`}>
        {percentage}
      </div>
      <div className="text-[7px] md:text-xs text-gray-500 mt-0.5 md:mt-1 font-normal whitespace-nowrap">
        {usPrice !== 0 && formatPrice(difference) + '원'}
      </div>
    </td>
  );
};

export default KimchiPremiumCell;
