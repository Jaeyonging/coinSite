export interface Position {
  market: string;
  amount: number;
  avgPrice: number;
  purchaseDate?: string; // 매수 일자 (YYYY-MM-DD 형식)
}
