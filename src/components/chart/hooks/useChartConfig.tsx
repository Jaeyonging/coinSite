import React, { useMemo } from 'react';
import { ChartDataShape } from './useCoinChartData';
import { CHART_CONFIG, COLORS } from '../../../utils/constants';

interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartConfigShape {
  chartWidth: number;
  chartHeight: number;
  padding: ChartPadding;
  plotWidth: number;
  plotHeight: number;
  candleWidth: number;
  candleSpacing: number;
  candleElements: JSX.Element[];
  priceToY: (price: number) => number;
  minPrice: number;
  maxPrice: number;
  priceRange: number;
  chartColor: string;
}

export const useChartConfig = (
  chartData: ChartDataShape | null,
  candleCount: number,
  hoveredIndex: number | null,
  isMobile: boolean,
  isTablet: boolean
) => {
  return useMemo<ChartConfigShape | null>(() => {
    if (!chartData || candleCount === 0) {
      return null;
    }

    const { candles, minPrice, maxPrice, priceRange, isRising } = chartData;

    const calculatedWidth = candles.length * (isMobile ? 6 : isTablet ? 7 : 8);
    const minWidth = isMobile ? 600 : isTablet ? 700 : CHART_CONFIG.MIN_WIDTH;
    const chartWidth = Math.max(minWidth, calculatedWidth);
    const chartHeight = isMobile
      ? CHART_CONFIG.MOBILE_HEIGHT
      : isTablet
      ? CHART_CONFIG.TABLET_HEIGHT
      : CHART_CONFIG.HEIGHT;
    const padding = (isMobile ? CHART_CONFIG.MOBILE_PADDING : CHART_CONFIG.PADDING) as ChartPadding;
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;
    const candleWidth = Math.max(
      2,
      Math.min(8, (plotWidth / candles.length) * CHART_CONFIG.CANDLE_WIDTH_RATIO)
    );
    const candleSpacing = plotWidth / candles.length;

    const priceToY = (price: number) => {
      if (priceRange <= 0) {
        return padding.top + plotHeight / 2;
      }
      const ratio = (price - minPrice) / priceRange;
      return padding.top + plotHeight * (1 - Math.max(0, Math.min(1, ratio)));
    };

    const candleElements: JSX.Element[] = [];

    for (let index = 0; index < candles.length; index++) {
      const candle = candles[index];
      const x = padding.left + index * candleSpacing + candleSpacing / 2;
      const isUp = candle.trade_price >= candle.opening_price;
      const color = isUp ? COLORS.RISE : COLORS.FALL;

      const highY = priceToY(candle.high_price);
      const lowY = priceToY(candle.low_price);
      const openY = priceToY(candle.opening_price);
      const closeY = priceToY(candle.trade_price);
      const bodyTop = Math.min(openY, closeY);
      const bodyBottom = Math.max(openY, closeY);
      const bodyHeight = Math.max(1, bodyBottom - bodyTop);
      const isHovered = hoveredIndex === index;

      candleElements.push(
        <g key={index} className="cursor-pointer">
          <line
            x1={x}
            y1={highY}
            x2={x}
            y2={lowY}
            stroke={isHovered ? '#000000' : color}
            strokeWidth={isHovered ? 2 : 1.5}
          />
          <rect
            x={x - candleWidth / 2}
            y={bodyTop}
            width={candleWidth}
            height={bodyHeight}
            fill={isHovered ? '#000000' : color}
            stroke={isHovered ? '#000000' : color}
            strokeWidth={isHovered ? 1 : 0.5}
            opacity={isHovered ? 0.9 : 1}
          />
        </g>
      );
    }

    return {
      chartWidth,
      chartHeight,
      padding,
      plotWidth,
      plotHeight,
      candleWidth,
      candleSpacing,
      candleElements,
      priceToY,
      minPrice,
      maxPrice,
      priceRange,
      chartColor: isRising ? COLORS.RISE : COLORS.FALL,
    };
  }, [chartData, candleCount, hoveredIndex, isMobile, isTablet]);
};
