import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KrwCoinPriceState, KrwCoinPrice } from '../types/coin.types';
import { fetchUpbitTickers } from '../api/services/upbit.service';

export const fetchKRWPrice = createAsyncThunk(
  'coins/fetchKRWPrice',
  async (markets: string) => {
    try {
      const data = await fetchUpbitTickers(markets);
      return data;
    } catch (error) {
      throw new Error(`Error fetching KRW price: ${error}`);
    }
  }
);

const initialState: KrwCoinPriceState = {
  coins: {},
  loading: 'loading',
  error: null,
};

const coinKrwPriceSlice = createSlice({
  name: 'coinKrwPrice',
  initialState,
  reducers: {
    syncKRWPrice: (state, action: PayloadAction<{ [key: string]: KrwCoinPrice }>) => {
      state.coins = action.payload;
    },
    syncKRWPrice2: (state, action: PayloadAction<{ code: string; updatedCoin: KrwCoinPrice }>) => {
      const { code, updatedCoin } = action.payload;
      state.coins[code] = updatedCoin;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKRWPrice.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchKRWPrice.fulfilled, (state, action) => {
        const data = action.payload;
        data.forEach((item) => {
          const market = item.market.substring(4);
          state.coins[market] = {
            krwSymbol: market,
            krwprice: item.trade_price,
            prevPrice: item.prev_closing_price,
            change: item.change,
            changePercent: item.change_rate * 100,
            absValue: item.change_price,
            accTradePrice24h: item.acc_trade_price_24h || 0,
          };
        });
        state.loading = 'success';
        state.error = null;
      })
      .addCase(fetchKRWPrice.rejected, (state, action) => {
        state.loading = 'error';
        state.error = action.error.message || 'KRW 시세를 불러오는 중 오류가 발생했습니다.';
        console.error('Error fetching KRW price: ', action.error.message);
      });
  },
});

export const { syncKRWPrice, syncKRWPrice2 } = coinKrwPriceSlice.actions;
export default coinKrwPriceSlice.reducer;
