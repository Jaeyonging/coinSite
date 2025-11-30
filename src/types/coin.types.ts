export interface Coin {
  krwName: string;
  krwSymbol: string;
  krwprice: number;
  engName: string;
  usSymbol: string;
  usprice: number;
  prevPrice: number;
  change: string;
  changePercent: number;
  absValue: number;
  fontColor: string;
}

export interface UpbitCoin {
  english_name: string;
  korean_name: string;
  market_KRW: string;
  market_USDT: string;
}

export interface UpbitCoins {
  [key: string]: UpbitCoin;
}

export interface USCoin {
  [key: string]: {
    usSymbol: string;
    usprice: number;
  };
}

export interface KrwCoinPrice {
  krwSymbol: string;
  krwprice: number;
  prevPrice: number;
  change: string;
  changePercent: number;
  absValue: number;
  accTradePrice24h: number; // 24시간 누적 거래대금
}

export interface KrwCoinPriceState {
  coins: {
    [key: string]: KrwCoinPrice;
  };
  loading: 'loading' | 'success' | 'error';
  error: string | null;
}

export interface CoinsState {
  coinNames: string[];
}

export type PriceChangeDirection = 'up' | 'down' | null;
