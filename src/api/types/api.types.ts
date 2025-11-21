// API Response Types
export interface CandleData {
  market: string;
  candle_date_time_utc: string;
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_price: number;
  candle_acc_trade_volume: number;
  unit: number;
}

export interface UpbitMarket {
  market: string;
  korean_name: string;
  english_name: string;
}

export interface UpbitTicker {
  market: string;
  trade_price: number;
  prev_closing_price: number;
  change: 'RISE' | 'FALL' | 'EVEN';
  change_rate: number;
  change_price: number;
}
