// coinSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CoinState {
  [key: string]: {
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
  };
}

const initialState: CoinState = {};

const coin = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    setCoinState: (state, action: PayloadAction<CoinState>) => {
      state = action.payload
      return action.payload;
    },
    setCoinState2: (state, action: PayloadAction<{ code: string; updatedCoin: any }>) => {
      const { code, updatedCoin } = action.payload;
      state[code] = updatedCoin;
    }
  },
});


export const { setCoinState, setCoinState2 } = coin.actions;

export default coin;