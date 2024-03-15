import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KrwCoin, UpbitCoins } from '../types/coin';
import { FetchKrwCoins } from '../api';



const initialState: UpbitCoins = {};

const UpbitCoins = createSlice({
    name: 'upbitCoins',
    initialState,
    reducers: {
        syncCoins: (state, action: PayloadAction<UpbitCoins>) => {
            state = action.payload
            return state
        },
    },
});


export const { syncCoins } = UpbitCoins.actions;

export default UpbitCoins;