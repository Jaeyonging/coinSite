import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoinsState } from '../types/coin.types';

const initialState: CoinsState = {
  coinNames: [],
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoinName: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      if (!state.coinNames.includes(payload)) {
        state.coinNames.push(payload);
      }
    },
    setCoinNames: (state, action: PayloadAction<string[]>) => {
      const uniqueMarkets = Array.from(new Set(action.payload));
      state.coinNames = uniqueMarkets;
    },
  },
});

export const { setCoinName, setCoinNames } = coinsSlice.actions;
export default coinsSlice.reducer;
