// coinSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { USCoin } from '../types/coin';


const initialState: USCoin = {};

const USCoinPrice = createSlice({
    name: 'UScoin',
    initialState,
    reducers: {
        setUSCoin: (state, action: PayloadAction<USCoin>) => {
            state = action.payload
            return action.payload;
        },
        syncUSPRICE: (state, action: PayloadAction<{ code: string; updatedCoin: any }>) => {
            const { code, updatedCoin } = action.payload;
            state[code] = updatedCoin;
        },
    },
});


export const { setUSCoin, syncUSPRICE } = USCoinPrice.actions;

export default USCoinPrice;