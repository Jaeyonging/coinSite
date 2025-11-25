import React from 'react';
import { formatNumber } from '../../utils/formatters';
import { COLORS } from '../../utils/constants';
import { ChartDataShape } from './hooks/useCoinChartData';

interface ChartTooltipProps {
  isMobile: boolean;
  tooltipPosition: { x: number; y: number } | null;
  mousePosition: { x: number; y: number; price: number; timeIndex: number } | null;
  chartData: ChartDataShape;
}

const ChartTooltip = ({
  isMobile,
  tooltipPosition,
  mousePosition,
  chartData,
}: ChartTooltipProps) => {
  if (!tooltipPosition || !mousePosition) {
    return null;
  }

  // 안전성 체크: timeIndex가 유효한 범위 내에 있는지 확인
  if (
    mousePosition.timeIndex < 0 ||
    mousePosition.timeIndex >= chartData.candles.length ||
    !chartData.labels[mousePosition.timeIndex]
  ) {
    return null;
  }

  const candle = chartData.candles[mousePosition.timeIndex];
  if (!candle) {
    return null;
  }

  const tradeRise = candle.trade_price >= candle.opening_price;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-full bg-black/85 text-white rounded-lg font-medium pointer-events-none z-[1000] shadow-lg leading-relaxed"
      style={{
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
        padding: isMobile ? '8px 10px' : '10px 14px',
        fontSize: isMobile ? '10px' : '12px',
        minWidth: isMobile ? '150px' : '180px',
      }}
    >
      <div className={`mb-1.5 ${isMobile ? 'text-[9px]' : 'text-[11px]'} text-gray-400 border-b border-white/20 pb-1`}>
        {chartData.labels[mousePosition.timeIndex]}
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-gray-400">가격:</span>
        <span className="font-semibold">{formatNumber(mousePosition.price)}원</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-gray-400">시가:</span>
        <span>{formatNumber(candle.opening_price)}원</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-gray-400">종가:</span>
        <span style={{ color: tradeRise ? COLORS.RISE : COLORS.FALL }}>
          {formatNumber(candle.trade_price)}원
        </span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-gray-400">고가:</span>
        <span style={{ color: COLORS.RISE }}>{formatNumber(candle.high_price)}원</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">저가:</span>
        <span style={{ color: COLORS.FALL }}>{formatNumber(candle.low_price)}원</span>
      </div>
    </div>
  );
};

export default ChartTooltip;
