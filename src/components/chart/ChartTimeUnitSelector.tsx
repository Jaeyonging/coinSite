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
    <div
      className={`${isMobile ? 'py-3 px-4' : 'py-4 px-6'} flex ${
        isMobile ? 'gap-1.5' : 'gap-2'
      } w-full flex-wrap justify-center border-b border-slate-200 bg-white box-border dark:border-slate-800 dark:bg-slate-900`}
      style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
    >
      {Object.keys(CHART_TIME_UNITS).map((timeUnit) => (
        <button
          key={timeUnit}
          onClick={() => onUnitChange(timeUnit)}
          className={`${isMobile ? 'py-1.5 px-2.5 text-[11px]' : 'py-2 px-3.5 text-sm'} rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
            selectedUnit === timeUnit
              ? `${isRising ? 'bg-rise border-rise' : 'bg-fall border-fall'} text-white font-semibold border`
              : 'border border-slate-200 bg-white text-slate-600 font-medium hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-400'
          }`}
        >
          {timeUnit}
        </button>
      ))}
    </div>
  );
};

export default ChartTimeUnitSelector;
