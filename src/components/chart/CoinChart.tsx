import React, { useEffect, useRef, useState } from 'react';
import { CHART_CONFIG } from '../../utils/constants';
import { useViewport } from '../../hooks/useViewport';
import ChartHeader from './ChartHeader';
import ChartTimeUnitSelector from './ChartTimeUnitSelector';
import ChartLoadingState from './ChartLoadingState';
import ChartEmptyState from './ChartEmptyState';
import ChartTooltip from './ChartTooltip';
import ChartMobileYAxis from './ChartMobileYAxis';
import ChartMobileXAxis from './ChartMobileXAxis';
import ChartCanvas from './ChartCanvas';
import { useCoinChartData } from './hooks/useCoinChartData';
import { useChartConfig } from './hooks/useChartConfig';
import { useChartPointer } from './hooks/useChartPointer';

interface Position {
  market: string;
  amount: number;
  avgPrice: number;
  purchaseDate?: string;
}

interface CoinChartProps {
  market: string;
  unit: string;
  position?: Position | null;
}

const CoinChart = React.memo(({ market, unit, position }: CoinChartProps) => {
  const { candleData, chartData, loading, selectedUnit, setSelectedUnit } = useCoinChartData(
    market,
    unit
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const xAxisScrollRef = useRef<HTMLDivElement>(null);

  const { width } = useViewport();
  const isMobileViewport = width <= 480;
  const isTabletViewport = width <= 768;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartConfig = useChartConfig(
    chartData,
    candleData.length,
    hoveredIndex,
    isMobileViewport,
    isTabletViewport
  );

  const {
    mousePosition,
    tooltipPosition,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    clearPointerState,
  } = useChartPointer({
    chartConfig,
    chartData,
    containerRef,
    svgRef,
    scrollContainerRef,
    isMobileViewport,
    onHoverChange: setHoveredIndex,
  });

  useEffect(() => {
    if (!loading && candleData.length > 0 && scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [loading, candleData.length, selectedUnit]);

  if (loading) {
    return <ChartLoadingState />;
  }

  if (!chartData || !chartConfig || candleData.length === 0) {
    return <ChartEmptyState />;
  }

  const mobileYAxis = isMobileViewport ? (
    <ChartMobileYAxis chartConfig={chartConfig} chartData={chartData} />
  ) : null;

  return (
    <div
      className={`relative box-border rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${
        isMobileViewport ? 'my-2' : 'mt-3 mb-3'
      }`}
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        overflow: 'visible',
        marginLeft: 0,
        boxSizing: 'content-box',
      }}
      onTouchStart={(e) => {
        // 모바일에서 차트 터치 시 테이블 스크롤 방지
        if (isMobileViewport) {
          e.stopPropagation();
        }
      }}
      onTouchMove={(e) => {
        // 모바일에서 차트 터치 이동 시 테이블 스크롤 방지
        if (isMobileViewport) {
          e.stopPropagation();
        }
      }}
    >
      <ChartHeader currentPrice={chartData.lastPrice} changePercent={chartData.changePercent} isRising={chartData.isRising} />
      <ChartTimeUnitSelector
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
        isRising={chartData.isRising}
      />

      <div 
        ref={containerRef} 
        className="relative w-full overflow-visible bg-white dark:bg-slate-950"
        style={{ 
          width: '100%', 
          maxWidth: '100%', 
          minWidth: 0,
        }}
      >
        {mobileYAxis}

        <div
          id="chart-scroll-container"
          ref={scrollContainerRef}
          className="w-full overflow-auto relative box-border touch-pan-x bg-white dark:bg-slate-950"
          style={{
            height: isMobileViewport
              ? `${CHART_CONFIG.MOBILE_HEIGHT}px`
              : isTabletViewport
              ? `${CHART_CONFIG.TABLET_HEIGHT}px`
              : `${CHART_CONFIG.HEIGHT}px`,
            paddingBottom: isMobileViewport ? `${chartConfig.padding.bottom}px` : '0px',
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingRight: '0px',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
          onScroll={(event) => {
            if (isMobileViewport && xAxisScrollRef.current) {
              xAxisScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
            }
          }}
          onTouchStart={(e) => {
            // 모바일에서 스크롤 컨테이너 터치 시 테이블 스크롤 방지
            if (isMobileViewport) {
              e.stopPropagation();
            }
          }}
          onTouchMove={(e) => {
            // 모바일에서 스크롤 컨테이너 터치 이동 시 테이블 스크롤 방지
            if (isMobileViewport) {
              e.stopPropagation();
            }
          }}
        >
        <ChartCanvas
          chartConfig={chartConfig}
          chartData={chartData}
          mousePosition={mousePosition}
          position={position || null}
          isMobile={isMobileViewport}
          svgRef={svgRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={clearPointerState}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={clearPointerState}
        />
        </div>

        {isMobileViewport && (
          <ChartMobileXAxis
            chartConfig={chartConfig}
            chartData={chartData}
            xAxisScrollRef={xAxisScrollRef}
            onSyncScroll={(scrollLeft) => {
              const graphScrollContainer = document.getElementById('chart-scroll-container');
              if (graphScrollContainer) {
                graphScrollContainer.scrollLeft = scrollLeft;
              }
            }}
          />
        )}

        <ChartTooltip
          isMobile={isMobileViewport}
          mousePosition={mousePosition}
          tooltipPosition={tooltipPosition}
          chartData={chartData}
        />
      </div>
    </div>
  );
});

export default CoinChart;
