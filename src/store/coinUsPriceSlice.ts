import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { USCoin } from '../types/coin.types';

const initialState: USCoin = {};

const coinUsPriceSlice = createSlice({
  name: 'coinUsPrice',
  initialState,
  reducers: {
    setUSCoin: (state, action: PayloadAction<USCoin>) => {
      return action.payload;
    },
    syncUSPRICE: (state, action: PayloadAction<{ code: string; updatedCoin: { usprice: number } }>) => {
      const { code, updatedCoin } = action.payload;
      if (state[code]) {
        state[code].usprice = updatedCoin.usprice;
      } else {
        state[code] = {
          usSymbol: code,
          usprice: updatedCoin.usprice,
        };
      }
    },
  },
});

export const { setUSCoin, syncUSPRICE } = coinUsPriceSlice.actions;
export default coinUsPriceSlice.reducer;
