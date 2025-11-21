import { combineReducers } from '@reduxjs/toolkit';
import coinsReducer from './coinsSlice';
import coinKrwPriceReducer from './coinKrwPriceSlice';
import coinUsPriceReducer from './coinUsPriceSlice';
import upbitCoinsReducer from './upbitCoinsSlice';

const rootReducer = combineReducers({
  coins: coinsReducer,
  coinKrwPrice: coinKrwPriceReducer,
  coinUsPrice: coinUsPriceReducer,
  upbitCoins: upbitCoinsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
