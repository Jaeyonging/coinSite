import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UpbitCoins } from '../types/coin.types';

const initialState: UpbitCoins = {};

const upbitCoinsSlice = createSlice({
  name: 'upbitCoins',
  initialState,
  reducers: {
    syncCoins: (state, action: PayloadAction<UpbitCoins>) => {
      return action.payload;
    },
  },
});

export const { syncCoins } = upbitCoinsSlice.actions;
export default upbitCoinsSlice.reducer;
