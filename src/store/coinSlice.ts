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
    kimp: number,
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
  },
});


export const { setCoinState } = coin.actions;

export default coin;