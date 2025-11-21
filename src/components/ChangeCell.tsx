import React from 'react';
import { formatPrice } from '../utils/formatters';

interface ChangeCellProps {
  value: number;
  change: string;
  isPercent?: boolean;
}

const ChangeCell = ({ value, change, isPercent = false }: ChangeCellProps) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  const displayValue = isPercent ? value.toFixed(2) + '%' : formatPrice(value) + '원';

  if (change === 'RISE') {
    return (
      <td className="font-10px" style={{ whiteSpace: isMobile ? 'nowrap' : 'normal' }}>
        <span className="rise">+{displayValue}</span>
      </td>
    );
  } else if (change === 'FALL') {
    return (
      <td className="font-10px" style={{ whiteSpace: isMobile ? 'nowrap' : 'normal' }}>
        <span className="fall">-{displayValue}</span>
      </td>
    );
  }

  return (
    <td className="font-10px" style={{ whiteSpace: isMobile ? 'nowrap' : 'normal' }}>
      <span>{displayValue}</span>
    </td>
  );
};

export default ChangeCell;
