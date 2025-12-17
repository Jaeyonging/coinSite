import React, { useEffect, useRef, useMemo, useId } from 'react';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';

interface TradingViewChartProps {
  market: string;
  usPrice: number;
  interval?: string;
  uniqueId?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart = ({ market, usPrice, interval = '15', uniqueId }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const previousSymbolRef = useRef<string | null>(null);
  const previousThemeRef = useRef<string | null>(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const defaultId = useId();

  const hasBinancePrice = useMemo(() => {
    return usPrice && usPrice !== 0;
  }, [usPrice]);

  // TradingView 심볼 계산
  const tradingViewSymbol = useMemo(() => {
    const symbol = market.replace('KRW-', '');
    return hasBinancePrice 
      ? `BINANCE:${symbol}USDT`
      : `UPBIT:${symbol}KRW`;
  }, [market, hasBinancePrice]);

  // 고정된 containerId 생성 (market 기반, uniqueId로 구분)
  const containerId = useMemo(() => {
    const symbol = market.replace('KRW-', '');
    const id = uniqueId || defaultId.replace(/:/g, '_');
    return `tradingview_${symbol}_${id}`;
  }, [market, uniqueId, defaultId]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 심볼이나 테마가 변경되었을 때만 위젯 재생성
    const themeChanged = previousThemeRef.current !== theme;
    const symbolChanged = previousSymbolRef.current !== tradingViewSymbol;
    
    if (!symbolChanged && !themeChanged && widgetRef.current) {
      return;
    }

    containerRef.current.id = containerId;
    previousSymbolRef.current = tradingViewSymbol;
    previousThemeRef.current = theme;

    const loadTradingView = () => {
      if (window.TradingView && containerRef.current) {
        // 기존 위젯 제거
        if (widgetRef.current) {
          try {
            widgetRef.current.remove();
          } catch (e) {
            // 위젯 제거 중 오류 무시
          }
          widgetRef.current = null;
        }

        // 컨테이너 내용 비우기
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        const widgetHeight = isMobile ? 320 : 600; 
        const isDark = theme === 'dark';
        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: tradingViewSymbol,
          interval: interval,
          timezone: 'Asia/Seoul',
          theme: isDark ? 'dark' : 'light',
          style: '1',
          locale: 'kr',
          toolbar_bg: isDark ? '#1e293b' : '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerId,
          height: widgetHeight,
          width: '100%',
        });
      }
    };

    if (window.TradingView) {
      loadTradingView();
    } else {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        loadTradingView();
      };
      
      if (!document.querySelector('script[src="https://s3.tradingview.com/tv.js"]')) {
        document.head.appendChild(script);
      } else {
        const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]') as HTMLScriptElement;
        if (existingScript && !existingScript.onload) {
          existingScript.onload = () => {
            loadTradingView();
          };
        }
      }
    }

    return () => {
      // 클린업
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          // 위젯 제거 중 오류 무시
        }
        widgetRef.current = null;
      }
    };
  }, [tradingViewSymbol, containerId, isMobile, theme, interval]);

  return (
    <div
      className={`relative box-border rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 mt-3 mb-3 ${
        isMobile ? 'h-72 lg:h-80 resize-y overflow-y-hidden pt-0.5 pb-4' : ''
      }`}
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        height: isMobile ? undefined : '400px',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default TradingViewChart;
