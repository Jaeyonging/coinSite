import React from 'react';
import { CHART_TIME_UNITS, COLORS } from '../../utils/constants';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface ChartTimeUnitSelectorProps {
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
  isRising: boolean;
}

const ChartTimeUnitSelector = ({
  selectedUnit,
  onUnitChange,
  isRising,
}: ChartTimeUnitSelectorProps) => {
  const isMobile = useIsMobile();
  const chartColor = isRising ? COLORS.RISE : COLORS.FALL;

  return (
    <div className={`${isMobile ? 'py-3 px-4' : 'py-4 px-6'} border-b border-gray-300 flex ${isMobile ? 'gap-1.5' : 'gap-2'} flex-wrap justify-center bg-white w-full box-border`} style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {Object.keys(CHART_TIME_UNITS).map((timeUnit) => (
        <button
          key={timeUnit}
          onClick={() => onUnitChange(timeUnit)}
          className={`${isMobile ? 'py-1.5 px-2.5 text-[11px]' : 'py-2 px-3.5 text-sm'} rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
            selectedUnit === timeUnit
              ? `${isRising ? 'bg-rise border-rise' : 'bg-fall border-fall'} text-white font-semibold border`
              : 'bg-white border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {timeUnit}
        </button>
      ))}
    </div>
  );
};

export default ChartTimeUnitSelector;
