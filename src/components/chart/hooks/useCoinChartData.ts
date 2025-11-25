import { useEffect, useMemo, useState } from 'react';
import { fetchUpbitCandles } from '../../../api/services/upbit.service';
import { CandleData } from '../../../api/types/api.types';
import { CHART_TIME_UNITS } from '../../../utils/constants';
import { useAppSelector } from '../../../hooks/useAppSelector';

export interface ChartDataShape {
  candles: CandleData[];
  labels: string[];
  firstPrice: number;
  lastPrice: number;
  isRising: boolean;
  changePercent: number;
  minPrice: number;
  maxPrice: number;
  priceRange: number;
}

export const useCoinChartData = (market: string, initialUnit: string) => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(initialUnit);

  const coinSymbol = useMemo(() => {
    return market.startsWith('KRW-') ? market.substring(4) : market;
  }, [market]);

  const realtimePrice = useAppSelector(
    (state) => state.coinKrwPrice.coins[coinSymbol]?.krwprice
  );

  useEffect(() => {
    const loadCandleData = async () => {
      setLoading(true);
      try {
        const unitConfig =
          CHART_TIME_UNITS[selectedUnit as keyof typeof CHART_TIME_UNITS] ||
          CHART_TIME_UNITS['1일'];
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

  useEffect(() => {
    if (!loading && candleData.length > 0 && realtimePrice && realtimePrice > 0) {
      setCandleData((prevData) => {
        if (prevData.length === 0) return prevData;
        
        const lastCandle = prevData[prevData.length - 1];
        if (!lastCandle) return prevData;

        // 가격이 실제로 변경된 경우에만 업데이트
        if (Math.abs(lastCandle.trade_price - realtimePrice) < 0.01) {
          return prevData;
        }

        const newData = [...prevData];
        const updatedCandle = {
          ...lastCandle,
          trade_price: realtimePrice,
          high_price: Math.max(lastCandle.high_price, realtimePrice),
          low_price: Math.min(lastCandle.low_price, realtimePrice),
        };
        newData[newData.length - 1] = updatedCandle;

        return newData;
      });
    }
  }, [realtimePrice, loading]);

  const chartData = useMemo<ChartDataShape | null>(() => {
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
    
    // 안전성 체크: 가격 범위가 0이거나 유효하지 않은 경우
    const priceRange = maxPrice > minPrice ? maxPrice - minPrice : Math.max(maxPrice, minPrice) * 0.01 || 1;

    const labels = new Array(candleData.length);
    for (let i = 0; i < candleData.length; i++) {
      const date = new Date(candleData[i].candle_date_time_kst);
      if (selectedUnit.includes('분') || selectedUnit === '1시간') {
        labels[i] = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(
          date.getMinutes()
        ).padStart(2, '0')}`;
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

  return {
    candleData,
    chartData,
    loading,
    selectedUnit,
    setSelectedUnit,
  };
};
