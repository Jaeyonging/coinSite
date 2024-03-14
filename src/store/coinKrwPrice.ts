// coinSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KrwCoin, UpbitCoins } from '../types/coin';

const initialState: KrwCoin = {};

const KrwCoinPrice = createSlice({
    name: 'KRWcoin',
    initialState,
    reducers: {

        syncKRWPrice: (state, action: PayloadAction<{ code: string; updatedCoin: any }>) => {
            const { code, updatedCoin } = action.payload;
            state[code] = updatedCoin;
        }

    },
});


export const { syncKRWPrice } = KrwCoinPrice.actions;

export default KrwCoinPrice;