import React from 'react';
import ChartGridLines from './ChartGridLines';
import ChartDesktopYAxis from './ChartDesktopYAxis';
import ChartDesktopXAxis from './ChartDesktopXAxis';
import ChartPurchaseMarker from './ChartPurchaseMarker';
import ChartCrosshair from './ChartCrosshair';
import { ChartConfigShape } from './hooks/useChartConfig';
import { ChartDataShape } from './hooks/useCoinChartData';

interface Position {
  market: string;
  amount: number;
  avgPrice: number;
  purchaseDate?: string;
}

interface ChartCanvasProps {
  chartConfig: ChartConfigShape;
  chartData: ChartDataShape;
  mousePosition: { x: number; y: number; price: number; timeIndex: number } | null;
  position: Position | null;
  isMobile: boolean;
  svgRef: React.RefObject<SVGSVGElement>;
  onMouseMove: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseLeave: () => void;
  onTouchStart?: (event: React.TouchEvent<SVGSVGElement>) => void;
  onTouchMove: (event: React.TouchEvent<SVGSVGElement>) => void;
  onTouchEnd?: () => void;
}

const ChartCanvas = ({
  chartConfig,
  chartData,
  mousePosition,
  position,
  isMobile,
  svgRef,
  onMouseMove,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: ChartCanvasProps) => {
  const {
    chartWidth,
    chartHeight,
    padding,
    plotWidth,
    plotHeight,
    candleElements,
    candleSpacing,
  } = chartConfig;

  const handleTouchStart = (event: React.TouchEvent<SVGSVGElement>) => {
    if (onTouchStart) {
      onTouchStart(event);
    }
  };

  const handleTouchMove = (event: React.TouchEvent<SVGSVGElement>) => {
    onTouchMove(event);
  };

  const handleTouchEnd = () => {
    if (onTouchEnd) {
      onTouchEnd();
    }
  };

  return (
    <svg
      ref={svgRef}
      width={chartWidth}
      height={chartHeight}
      className="block"
      style={{
        display: 'block',
        maxWidth: 'none',
        marginLeft: 0,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ChartGridLines chartConfig={chartConfig} />
      {!isMobile && <ChartDesktopYAxis chartConfig={chartConfig} />}
      {candleElements}

      {position && (
        <ChartPurchaseMarker
          chartConfig={chartConfig}
          chartData={chartData}
          position={position}
          isMobile={isMobile}
        />
      )}

      <ChartCrosshair
        mousePosition={mousePosition}
        chartConfig={chartConfig}
        chartData={chartData}
        isMobile={isMobile}
      />

      {!isMobile && <ChartDesktopXAxis chartConfig={chartConfig} chartData={chartData} />}

      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={padding.top + plotHeight}
        stroke="#ced4da"
        strokeWidth={1}
      />
      <line
        x1={padding.left}
        y1={padding.top + plotHeight}
        x2={padding.left + plotWidth}
        y2={padding.top + plotHeight}
        stroke="#ced4da"
        strokeWidth={1}
      />
    </svg>
  );
};

export default ChartCanvas;
