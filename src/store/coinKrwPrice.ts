// coinSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KrwCoin, KrwCoin2, UpbitCoins } from '../types/coin';
import { FetchKrwPrice } from '../api';

export const fetchKRWPrice = createAsyncThunk(
    'krwcoin/fetchKRWPrice',
    async (markets: string) => {
        try {
            const data = await FetchKrwPrice(markets);
            console.log()
            return data;
        } catch (error) {
            throw Error("Error fetching KRW price: " + error);
        }
    }
);

const initialState: KrwCoin2 = {
    coins: {},
    loading: 'loading'
};
const KrwCoinPrice = createSlice({
    name: 'KRWcoin',
    initialState,
    reducers: {

        syncKRWPrice: (state, action: PayloadAction<KrwCoin>) => {
            state.coins = action.payload
            return state
        },
        syncKRWPrice2: (state, action: PayloadAction<{ code: string; updatedCoin: any }>) => {
            const { code, updatedCoin } = action.payload;
            state.coins[code] = updatedCoin;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKRWPrice.fulfilled, (state, action) => {
                const data = action.payload;
                data.forEach((item: any) => {
                    const market = item.market.substring(4);
                    state.coins[market] = {
                        krwprice: item.trade_price,
                        prevPrice: item.prev_closing_price,
                        change: item.change,
                        changePercent: item.change_rate * 100,
                        absValue: item.change_price,
                    };
                });
                state.loading = "success"
            })
            .addCase(fetchKRWPrice.rejected, (state, action) => {
                state.loading = "error"
                console.error("Error fetching KRW price: ", action.error.message);
            });
    }
});


export const { syncKRWPrice, syncKRWPrice2 } = KrwCoinPrice.actions;

export default KrwCoinPrice;