import React from 'react';
import { formatPrice } from '../utils/formatters';

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
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  
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
    <td style={{ whiteSpace: isMobile ? 'nowrap' : 'normal' }}>
      <div className={isPositive ? 'font-10px green' : 'font-10px red'} style={{ whiteSpace: isMobile ? 'nowrap' : 'normal' }}>
        {percentage}
      </div>
      <div className="binance" style={{ whiteSpace: isMobile ? 'nowrap' : 'normal' }}>
        {usPrice !== 0 && formatPrice(difference) + '원'}
      </div>
    </td>
  );
};

export default KimchiPremiumCell;
