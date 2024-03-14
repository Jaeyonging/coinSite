// store.ts
import { configureStore } from '@reduxjs/toolkit';
import coin from './coinSlice';
import coins from './coinsSlice';
import KrwCoinPrice from './coinKrwPrice';
import USCoinPrice from './coinUsPrice';
import UpbitCoins from './upbitCoins';

const store = configureStore({
  reducer: {
    coin: coin.reducer,
    coins: coins.reducer,
    KrwCoin: KrwCoinPrice.reducer,
    USCoin: USCoinPrice.reducer,
    UpbitCoin: UpbitCoins.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
