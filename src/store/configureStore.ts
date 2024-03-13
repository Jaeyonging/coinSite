// store.ts
import { configureStore } from '@reduxjs/toolkit';
import coin from './coinSlice';
import coins from './coinsSlice';

const store = configureStore({
  reducer: {
    coin: coin.reducer,
    coins: coins.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
