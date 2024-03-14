// coinSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KrwCoin, UpbitCoins } from '../types/coin';

const initialState: UpbitCoins = {};

const UpbitCoins = createSlice({
    name: 'upbitCoins',
    initialState,
    reducers: {
        syncCoins: (state, action: PayloadAction<UpbitCoins>) => {
            state = action.payload
            console.log(state)
            return state
        },
    },
});


export const { syncCoins } = UpbitCoins.actions;

export default UpbitCoins;