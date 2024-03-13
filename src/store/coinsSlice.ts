import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoinState } from '../types/coin';


interface CoinsState {
    coinNames: string[];
}

const initialState: CoinsState = {
    coinNames: [],
};

const coins = createSlice({
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


export const { setCoinName } = coins.actions;
export default coins;
