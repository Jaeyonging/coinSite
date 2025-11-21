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
  },
});

export const { setCoinName } = coinsSlice.actions;
export default coinsSlice.reducer;
