// store.ts
import { configureStore } from '@reduxjs/toolkit';
import coin from './coinSlice';

const store = configureStore({
  reducer: {
    coin: coin.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
