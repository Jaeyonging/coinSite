import axios from 'axios';
import { CandleData, UpbitMarket, UpbitTicker } from '../types/api.types';

const BASE_URL = 'https://api.upbit.com/v1';

const getApiConfig = () => ({
  transformRequest: [
    (data: any, headers: any) => {
      delete headers['Origin'];
      return data;
    },
  ],
});


export const fetchUpbitMarkets = async (): Promise<UpbitMarket[]> => {
  const response = await axios.get<UpbitMarket[]>(
    '/api/v1/market/all?isDetails=false',
    getApiConfig()
  );
  return response.data;
};


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
