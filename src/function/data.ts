//data.ts

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/configureStore";
import { setCoinName } from "../store/coinsSlice";
import { setCoinState } from "../store/coinSlice";

export function FetchTodayDollar(): Promise<number> {
  return axios.get("https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD")
    .then((response) => {
      return parseFloat(response.data[0].basePrice);
    });
}

interface Coin {
  krwName: string;
  krwSymbol: string;
  krwprice: number;
  engName: string;
  usSymbol: string;
  usprice: number;
  prevPrice: number;
  change: string;
  changePercent: number;
  absValue: number;
  fontColor: string;
}

export const FetchKrwCoins = async () => {
  const coinState = useSelector((state: RootState) => state.coin);
  const coinsState = useSelector((state: RootState) => state.coins);
  const dispatch = useDispatch<AppDispatch>();

  try {
    const response = await axios.get(
      "https://api.upbit.com/v1/market/all?isDetails=false"
    );
    const krwCoins = response.data.filter((coin: any) =>
      coin.market.startsWith("KRW-")
    );

    const newCoinState: Record<string, Coin> = {};
    krwCoins.forEach((coin: any) => {
      newCoinState[coin.market] = {
        krwName: coin.korean_name,
        krwSymbol: coin.market,
        engName: coin.english_name,
        usSymbol: coin.market.split("-")[1] + "USDT",
        krwprice: 0,
        usprice: 0,
        prevPrice: 0,
        change: "",
        changePercent: 0,
        absValue: 0,
        fontColor: "blackColor",
      };
      dispatch(setCoinName(coin.market));
    });

    dispatch(setCoinState(newCoinState));
  } catch (error) {
    console.error("Error fetching KR₩ coins:", error);
  }
};

export const formatPrice = (price: number) => {
  if (price > 1000) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (price > 100) {
    return price.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (price < 1) {
    const formattedPrice = parseFloat(price.toFixed(5)).toString();
    return formattedPrice;
  } else {
    return price.toFixed(2);
  }
};
