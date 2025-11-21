import React, { useEffect, useState, useMemo, useRef } from 'react';
import { fetchUpbitCandles } from '../api/services/upbit.service';
import { CandleData } from '../api/types/api.types';
import { CHART_TIME_UNITS, COLORS, CHART_CONFIG } from '../utils/constants';
import { formatCompactNumber, formatNumber } from '../utils/formatters';
import { useAppSelector } from '../hooks/useAppSelector';

interface CoinChartProps {
  market: string;
  unit: string;
}

const CoinChart = React.memo(({ market, unit }: CoinChartProps) => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const [containerWidth, setContainerWidth] = useState(900);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 코인 심볼 추출 (KRW-BTC 형식이거나 BTC 형식일 수 있음)
  const coinSymbol = useMemo(() => {
    return market.startsWith('KRW-') ? market.substring(4) : market;
  }, [market]);

  // Redux에서 실시간 가격 구독
  const realtimePrice = useAppSelector((state) => state.coinKrwPrice.coins[coinSymbol]?.krwprice);

  useEffect(() => {
    const loadCandleData = async () => {
      setLoading(true);
      try {
        const unitConfig = CHART_TIME_UNITS[selectedUnit as keyof typeof CHART_TIME_UNITS] || CHART_TIME_UNITS['1일'];
        const data = await fetchUpbitCandles(market, unitConfig.unit, unitConfig.count);
        setCandleData(data.reverse());
      } catch (error) {
        console.error('Error fetching candle data:', error);
        setCandleData([]);
      } finally {
        setLoading(false);
      }
    };

    if (market) {
      loadCandleData();
    }
  }, [market, selectedUnit]);

  // 컨테이너 너비 감지 및 반응형 처리
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 48;
        const isMobile = window.innerWidth <= 480;
        const isTablet = window.innerWidth <= 768;
        const minWidth = isMobile ? 600 : isTablet ? 700 : CHART_CONFIG.MIN_WIDTH;
        setContainerWidth(Math.max(minWidth, width));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 차트 데이터 로드 시 오른쪽 끝으로 자동 스크롤 (모바일에서 최신 캔들 보이도록)
  useEffect(() => {
    if (!loading && candleData.length > 0 && scrollContainerRef.current) {
      // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 스크롤
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [loading, candleData.length, selectedUnit]);

  // 실시간 가격으로 마지막 캔들 업데이트
  useEffect(() => {
    if (!loading && candleData.length > 0 && realtimePrice && realtimePrice > 0) {
      setCandleData((prevData) => {
        const newData = [...prevData];
        const lastCandle = newData[newData.length - 1];
        
        if (lastCandle) {
          // 마지막 캔들의 종가를 실시간 가격으로 업데이트
          const updatedCandle = {
            ...lastCandle,
            trade_price: realtimePrice,
            // 고가/저가도 업데이트
            high_price: Math.max(lastCandle.high_price, realtimePrice),
            low_price: Math.min(lastCandle.low_price, realtimePrice),
          };
          newData[newData.length - 1] = updatedCandle;
        }
        
        return newData;
      });
    }
  }, [realtimePrice, loading]);

  const chartData = useMemo(() => {
    if (candleData.length === 0) return null;

    const firstPrice = candleData[0]?.trade_price || 0;
    const lastPrice = candleData[candleData.length - 1]?.trade_price || 0;
    const isRising = lastPrice >= firstPrice;
    const changePercent = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

    let maxPrice = -Infinity;
    let minPrice = Infinity;
    for (let i = 0; i < candleData.length; i++) {
      const candle = candleData[i];
      if (candle.high_price > maxPrice) maxPrice = candle.high_price;
      if (candle.low_price < minPrice) minPrice = candle.low_price;
    }
    const priceRange = maxPrice - minPrice || 1;

    const labels = new Array(candleData.length);
    for (let i = 0; i < candleData.length; i++) {
      const date = new Date(candleData[i].candle_date_time_kst);
      if (selectedUnit.includes('분') || selectedUnit === '1시간') {
        labels[i] = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      } else {
        labels[i] = `${date.getMonth() + 1}/${date.getDate()}`;
      }
    }

    return {
      candles: candleData,
      labels,
      firstPrice,
      lastPrice,
      isRising,
      changePercent,
      minPrice,
      maxPrice,
      priceRange,
    };
  }, [candleData, selectedUnit]);

  const chartConfig = useMemo(() => {
    if (!chartData || candleData.length === 0) {
      return null;
    }

    const { candles, minPrice, maxPrice, priceRange } = chartData;
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth <= 768;
    
    const calculatedWidth = candles.length * (isMobile ? 6 : isTablet ? 7 : 8);
    const minWidth = isMobile ? 600 : isTablet ? 700 : CHART_CONFIG.MIN_WIDTH;
    const chartWidth = Math.max(minWidth, calculatedWidth);
    const chartHeight = isMobile 
      ? CHART_CONFIG.MOBILE_HEIGHT 
      : isTablet 
      ? CHART_CONFIG.TABLET_HEIGHT 
      : CHART_CONFIG.HEIGHT;
    const padding = isMobile ? CHART_CONFIG.MOBILE_PADDING : CHART_CONFIG.PADDING;
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;
    const candleWidth = Math.max(2, Math.min(8, plotWidth / candles.length * CHART_CONFIG.CANDLE_WIDTH_RATIO));
    const candleSpacing = plotWidth / candles.length;

    const elements: JSX.Element[] = [];
    const priceToY = (price: number) => padding.top + plotHeight * (1 - (price - minPrice) / priceRange);
    
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
      
      elements.push(
        <g 
          key={index}
          onMouseEnter={(e) => {
            setHoveredIndex(index);
            if (containerRef.current) {
              const scrollContainer = containerRef.current.querySelector('div');
              const scrollLeft = scrollContainer?.scrollLeft || 0;
              const containerRect = containerRef.current.getBoundingClientRect();
              const scrollContainerRect = scrollContainer?.getBoundingClientRect();
              
              if (scrollContainerRect) {
                const relativeX = x + scrollLeft + scrollContainerRect.left - containerRect.left;
                const relativeY = Math.min(highY, lowY) + scrollContainerRect.top - containerRect.top;
                
                setTooltipPosition({
                  x: relativeX,
                  y: relativeY,
                });
              }
            }
          }}
          onMouseLeave={() => {
            setHoveredIndex(null);
            setTooltipPosition(null);
          }}
          style={{ cursor: 'pointer' }}
        >
          <line
            x1={x}
            y1={highY}
            x2={x}
            y2={lowY}
            stroke={isHovered ? '#000000' : color}
            strokeWidth={isHovered ? '2' : '1.5'}
            opacity={isHovered ? 1 : 1}
          />
          <rect
            x={x - candleWidth / 2}
            y={bodyTop}
            width={candleWidth}
            height={bodyHeight}
            fill={isHovered ? '#000000' : color}
            stroke={isHovered ? '#000000' : color}
            strokeWidth={isHovered ? '1' : '0.5'}
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
      candleElements: elements,
    };
  }, [chartData, candleData.length, hoveredIndex]);

  if (loading) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        marginTop: '12px',
        border: '1px solid #dee2e6',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
        <div style={{ fontSize: '15px', color: '#6c757d', fontWeight: 500 }}>차트 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!chartData || !chartConfig || candleData.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        marginTop: '12px',
        border: '1px solid #dee2e6',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📉</div>
        <div style={{ fontSize: '15px', color: '#6c757d', fontWeight: 500 }}>데이터가 없습니다.</div>
      </div>
    );
  }

  const { candles, labels, firstPrice, lastPrice, isRising, changePercent, minPrice, maxPrice, priceRange } = chartData;
  const { chartWidth, chartHeight, padding, plotWidth, plotHeight, candleElements, candleSpacing } = chartConfig;
  const chartColor = isRising ? COLORS.RISE : COLORS.FALL;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      marginTop: '12px',
      marginBottom: '12px',
      overflow: 'hidden',
      border: '1px solid #dee2e6',
      position: 'relative',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
    }}>
      <div style={{
        padding: window.innerWidth <= 480 ? '16px' : '20px 24px',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: window.innerWidth <= 480 ? '12px' : '16px',
        background: '#f8f9fa',
      }}>
        <div>
          <div style={{ 
            fontSize: window.innerWidth <= 480 ? '11px' : '12px', 
            color: '#6c757d', 
            marginBottom: '4px', 
            fontWeight: 500 
          }}>
            현재 가격
          </div>
          <div style={{ 
            fontSize: window.innerWidth <= 480 ? '14px' : window.innerWidth <= 768 ? '20px' : '24px', 
            fontWeight: 'bold', 
            color: '#212529' 
          }}>
            {formatNumber(lastPrice)}원
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontSize: window.innerWidth <= 480 ? '11px' : '12px', 
            color: '#6c757d', 
            marginBottom: '4px', 
            fontWeight: 500 
          }}>
            변동률
          </div>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '13px' : window.innerWidth <= 768 ? '18px' : '20px',
            fontWeight: 'bold',
            color: chartColor,
          }}>
            {isRising ? '+' : ''}{changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div style={{
        padding: window.innerWidth <= 480 ? '12px 16px' : '16px 24px',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        gap: window.innerWidth <= 480 ? '6px' : '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: '#ffffff',
      }}>
        {Object.keys(CHART_TIME_UNITS).map((timeUnit) => (
          <button
            key={timeUnit}
            onClick={() => setSelectedUnit(timeUnit)}
            style={{
              padding: window.innerWidth <= 480 ? '6px 10px' : '8px 14px',
              border: `1px solid ${selectedUnit === timeUnit ? chartColor : '#dee2e6'}`,
              borderRadius: '6px',
              background: selectedUnit === timeUnit 
                ? chartColor 
                : '#ffffff',
              color: selectedUnit === timeUnit ? '#ffffff' : '#495057',
              cursor: 'pointer',
              fontSize: window.innerWidth <= 480 ? '11px' : '13px',
              fontWeight: selectedUnit === timeUnit ? '600' : '500',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedUnit !== timeUnit) {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.borderColor = '#adb5bd';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedUnit !== timeUnit) {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#dee2e6';
              }
            }}
          >
            {timeUnit}
          </button>
        ))}
      </div>

      <div 
        ref={containerRef}
        style={{
          padding: '24px',
          background: '#ffffff',
          position: 'relative',
          overflow: 'visible',
          width: '100%'
        }}>
        <div 
          ref={scrollContainerRef}
          style={{
            width: '100%',
            height: window.innerWidth <= 480 
              ? `${CHART_CONFIG.MOBILE_HEIGHT}px` 
              : window.innerWidth <= 768 
              ? `${CHART_CONFIG.TABLET_HEIGHT}px` 
              : `${CHART_CONFIG.HEIGHT}px`,
            overflow: 'auto',
            position: 'relative',
            boxSizing: 'border-box',
            WebkitOverflowScrolling: 'touch',
            paddingLeft: window.innerWidth <= 480 ? '15px' : '0px',
          }}>
          <svg
            ref={svgRef}
            width={chartWidth}
            height={chartHeight}
            style={{ display: 'block' }}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + plotHeight * (1 - ratio);
              return (
                <line
                  key={ratio}
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + plotWidth}
                  y2={y}
                  stroke="#e9ecef"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const price = minPrice + priceRange * (1 - ratio);
              const y = padding.top + plotHeight * (1 - ratio);
              const isMobile = window.innerWidth <= 480;
              return (
                <text
                  key={ratio}
                  x={isMobile ? padding.left - 5 : padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={isMobile ? "9" : "12"}
                  fill="#6c757d"
                  fontWeight="500"
                >
                  {formatCompactNumber(price)}
                </text>
              );
            })}

            {candleElements}

            {hoveredIndex !== null && chartConfig && (
              <>
                <line
                  x1={padding.left + hoveredIndex * chartConfig.candleSpacing + chartConfig.candleSpacing / 2}
                  y1={padding.top}
                  x2={padding.left + hoveredIndex * chartConfig.candleSpacing + chartConfig.candleSpacing / 2}
                  y2={padding.top + plotHeight}
                  stroke="#6c757d"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
              </>
            )}

            {(() => {
              const tickCount = Math.min(10, candles.length);
              const step = Math.max(1, Math.floor(candles.length / tickCount));
              return labels.map((label, index) => {
                if (index % step !== 0 && index !== labels.length - 1) return null;
                const x = padding.left + index * candleSpacing + candleSpacing / 2;
                return (
                  <text
                    key={index}
                    x={x}
                    y={chartHeight - padding.bottom + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#6c757d"
                    transform={`rotate(-45 ${x} ${chartHeight - padding.bottom + 20})`}
                  >
                    {label}
                  </text>
                );
              });
            })()}

            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + plotHeight}
                  stroke="#ced4da"
              strokeWidth="1"
            />

            <line
              x1={padding.left}
              y1={padding.top + plotHeight}
              x2={padding.left + plotWidth}
              y2={padding.top + plotHeight}
                  stroke="#ced4da"
              strokeWidth="1"
            />
          </svg>
        </div>
        
        {hoveredIndex !== null && tooltipPosition && chartData && (
          <div
            style={{
              position: 'absolute',
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              background: 'rgba(0, 0, 0, 0.85)',
              color: '#ffffff',
              padding: window.innerWidth <= 480 ? '8px 10px' : '10px 14px',
              borderRadius: '8px',
              fontSize: window.innerWidth <= 480 ? '10px' : '12px',
              fontWeight: 500,
              pointerEvents: 'none',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: window.innerWidth <= 480 ? '150px' : '180px',
              lineHeight: '1.6',
            }}
          >
            <div style={{ marginBottom: '6px', fontSize: window.innerWidth <= 480 ? '9px' : '11px', color: '#adb5bd', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>
              {chartData.labels[hoveredIndex]}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#adb5bd' }}>시가:</span>
              <span>{formatNumber(chartData.candles[hoveredIndex].opening_price)}원</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#adb5bd' }}>종가:</span>
              <span style={{ 
                color: chartData.candles[hoveredIndex].trade_price >= chartData.candles[hoveredIndex].opening_price 
                  ? COLORS.RISE 
                  : COLORS.FALL 
              }}>
                {formatNumber(chartData.candles[hoveredIndex].trade_price)}원
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#adb5bd' }}>고가:</span>
              <span style={{ color: COLORS.RISE }}>{formatNumber(chartData.candles[hoveredIndex].high_price)}원</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#adb5bd' }}>저가:</span>
              <span style={{ color: COLORS.FALL }}>{formatNumber(chartData.candles[hoveredIndex].low_price)}원</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default CoinChart;
