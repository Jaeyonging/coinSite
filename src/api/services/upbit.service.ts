import axios from 'axios';
import { CandleData, UpbitMarket, UpbitTicker } from '../types/api.types';

const BASE_URL = 'https://api.upbit.com/v1';

// API 요청 헤더 설정 헬퍼
const getApiConfig = () => ({
  transformRequest: [
    (data: any, headers: any) => {
      delete headers['Origin'];
      return data;
    },
  ],
});

/**
 * 업비트 마켓 목록 조회
 */
export const fetchUpbitMarkets = async (): Promise<UpbitMarket[]> => {
  const response = await axios.get<UpbitMarket[]>(
    '/api/v1/market/all?isDetails=false',
    getApiConfig()
  );
  return response.data;
};

/**
 * 업비트 티커(현재가) 정보 조회
 */
export const fetchUpbitTickers = async (markets: string): Promise<UpbitTicker[]> => {
  if (!markets || markets.length < 1) {
    return [];
  }
  const response = await axios.get<UpbitTicker[]>(
    `/api/v1/ticker?markets=${markets}`,
    getApiConfig()
  );
  return response.data;
};

/**
 * 업비트 캔들(차트) 데이터 조회
 */
export const fetchUpbitCandles = async (
  market: string,
  unit: string,
  count: number = 200
): Promise<CandleData[]> => {
  const response = await axios.get<CandleData[]>(
    `/api/v1/candles/${unit}?market=${market}&count=${count}`,
    getApiConfig()
  );
  return response.data;
};
