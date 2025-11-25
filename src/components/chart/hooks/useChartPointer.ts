import { useCallback, useState, useRef } from 'react';
import { ChartConfigShape } from './useChartConfig';
import { ChartDataShape } from './useCoinChartData';

interface PointerState {
  x: number;
  y: number;
  price: number;
  timeIndex: number;
}

interface UseChartPointerParams {
  chartConfig: ChartConfigShape | null;
  chartData: ChartDataShape | null;
  containerRef: React.RefObject<HTMLDivElement>;
  svgRef: React.RefObject<SVGSVGElement>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  isMobileViewport: boolean;
  onHoverChange: (index: number | null) => void;
}

export const useChartPointer = ({
  chartConfig,
  chartData,
  containerRef,
  svgRef,
  scrollContainerRef,
  isMobileViewport,
  onHoverChange,
}: UseChartPointerParams) => {
  const [mousePosition, setMousePosition] = useState<PointerState | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isScrollingRef = useRef<boolean>(false);

  const clearPointerState = useCallback(() => {
    setMousePosition(null);
    onHoverChange(null);
    setTooltipPosition(null);
    touchStartRef.current = null;
    isScrollingRef.current = false;
  }, [onHoverChange]);

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!chartConfig || !chartData) return false;

      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return false;

      const scrollContainer = scrollContainerRef.current;
      const scrollLeft = scrollContainer?.scrollLeft || 0;
      const scrollTop = scrollContainer?.scrollTop || 0;

      const pointerX = clientX - svgRect.left;
      const pointerY = clientY - svgRect.top;
      const { padding, plotWidth, plotHeight, candleSpacing, minPrice, priceRange } = chartConfig;

      if (
        pointerX < padding.left ||
        pointerX > padding.left + plotWidth ||
        pointerY < padding.top ||
        pointerY > padding.top + plotHeight
      ) {
        clearPointerState();
        return false;
      }

      const relativeY = pointerY - padding.top;
      const priceRatio = 1 - relativeY / plotHeight;
      const currentPrice = minPrice + priceRange * priceRatio;
      const relativeX = pointerX - padding.left;
      const timeIndex = Math.round(relativeX / candleSpacing);
      const clampedTimeIndex = Math.max(0, Math.min(chartData.candles.length - 1, timeIndex));

      setMousePosition({
        x: pointerX,
        y: pointerY,
        price: currentPrice,
        timeIndex: clampedTimeIndex,
      });
      onHoverChange(clampedTimeIndex);

      const containerRect = containerRef.current?.getBoundingClientRect();
      const scrollContainerRect = scrollContainer?.getBoundingClientRect();
      if (containerRect && scrollContainerRect) {
        let relativeX =
          pointerX - scrollLeft + (scrollContainerRect.left - containerRect.left);
        const relativeY =
          pointerY - scrollTop + (scrollContainerRect.top - containerRect.top);
        
        // 모바일에서 툴팁이 화면 밖으로 나가지 않도록 조정
        if (isMobileViewport) {
          const tooltipWidth = 150; // 모바일 툴팁 최소 너비
          const containerWidth = containerRect.width;
          const padding = 10; // 여백
          
          // 오른쪽 경계 체크
          if (relativeX + tooltipWidth / 2 > containerWidth - padding) {
            relativeX = containerWidth - tooltipWidth / 2 - padding;
          }
          // 왼쪽 경계 체크
          if (relativeX - tooltipWidth / 2 < padding) {
            relativeX = tooltipWidth / 2 + padding;
          }
        }
        
        setTooltipPosition({
          x: relativeX,
          y: relativeY,
        });
      }

      return true;
    },
    [chartConfig, chartData, clearPointerState, containerRef, onHoverChange, scrollContainerRef, svgRef]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      handlePointerMove(event.clientX, event.clientY);
    },
    [handlePointerMove]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<SVGSVGElement>) => {
      if (!isMobileViewport) return;
      const touch = event.touches[0];
      if (!touch) return;
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      isScrollingRef.current = false;
    },
    [isMobileViewport]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<SVGSVGElement>) => {
      if (!isMobileViewport) return;
      const touch = event.touches[0];
      if (!touch || !touchStartRef.current) return;

      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 스크롤인지 판단 (수평 이동이 수직 이동보다 크거나, 이동 거리가 10px 이상)
      if (deltaX > deltaY && deltaX > 10) {
        isScrollingRef.current = true;
        clearPointerState();
        return; // 스크롤이면 preventDefault 하지 않음
      }

      // 터치 상호작용인 경우에만 preventDefault
      if (!isScrollingRef.current && distance > 5) {
        event.preventDefault();
        event.stopPropagation();
        handlePointerMove(touch.clientX, touch.clientY);
      }
    },
    [handlePointerMove, isMobileViewport, clearPointerState]
  );

  return {
    mousePosition,
    tooltipPosition,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    clearPointerState,
  };
};
