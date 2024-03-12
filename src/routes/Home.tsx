//Home.tsx

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/configureStore";
import { setCoinState } from "../store/coinSlice";
import { FetchTodayDollar } from "../function/data";

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

export const Home = () => {
  const [todayDollar, setTodayDollar] = useState<number>(0);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const coinState = useSelector((state: RootState) => state.coin);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    FetchTodayDollar()
      .then((dollar) => {
        setTodayDollar(dollar);
      })
      .catch((error) => {
        console.error("Error fetching today's dollar:", error);
      });

    const fetchKrwCoins = async () => {
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
        });

        dispatch(setCoinState(newCoinState));
        setInitialDataFetched(true);
      } catch (error) {
        console.error("Error fetching KR₩ coins:", error);
      }
    };

    fetchKrwCoins();
  }, []);
  const updateCoinPrices = async (coinState: Record<string, Coin>) => {
    const markets = Object.keys(coinState).join(",");
    try {
      const response = await axios.get(
        `https://api.upbit.com/v1/ticker?markets=${markets}`
      );

      const newCoinState = { ...coinState };

      response.data.forEach((item: any) => {
        const market = item.market;
        const fontColor =
          newCoinState[market].krwprice !== item.trade_price
            ? "redColor"
            : "blackColor";
        newCoinState[market] = {
          ...newCoinState[market],
          krwprice: item.trade_price,
          prevPrice: item.prev_closing_price,
          change: item.change,
          changePercent: item.change_rate,
          absValue: item.change_price,
          fontColor,
        };
      });
      const response2 = await axios.get(
        "https://api.binance.com/api/v3/ticker/24hr"
      );
      response2.data.forEach((item: any) => {
        const symbol = item.symbol;
        const market = Object.keys(newCoinState).find(
          (key) => newCoinState[key].usSymbol === symbol
        );
        if (market) {
          newCoinState[market] = {
            ...newCoinState[market],
            usprice: item.lastPrice,
          };
        }
      });
      dispatch(setCoinState(newCoinState));
    } catch (error) {
      console.error("Error fetching coin prices:", error);
    }
  };

  const formatPrice = (price: number) => {
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

  const { isLoading, isError } = useQuery(
    "coinPrices",
    () => updateCoinPrices(coinState),
    {
      refetchInterval: 650,
      enabled: initialDataFetched,
    }
  );

  return (
    <div
      className="App"
      style={{ marginTop: "185px", marginLeft: "50px", marginRight: "50px" }}
    >
      <Table>
        <thead>
          <tr>
            <th>
              <span className="coinName">Korean Name</span>
            </th>
            <th>
              <span className="coinPrice">Price</span>
            </th>
            <th>
              <span className="kimp">김치프리미엄</span>
            </th>
            <th>
              <span className="prevPrice">전일종가 00시 기준</span>
            </th>
            <th>
              <span className="prevalue">변동액</span>
            </th>
            <th>
              <span className="prepercent">변화율</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(coinState).length > 0 && !isLoading ? (
            Object.keys(coinState).map((market, idx) => {
              const coin = coinState[market];
              return (
                <tr key={idx + 1}>
                  <td>
                    <div>
                      <img
                        className="logo"
                        src={
                          "https://static.upbit.com/logos/" +
                          market.replace("KRW-", "") +
                          ".png"
                        }
                      ></img>
                      <span>{coin.krwName}</span>
                    </div>
                    <div>
                      {coin.engName} {market.replace("KRW-", "")}
                    </div>
                  </td>

                  <td className={coin.fontColor}>
                    <div>{formatPrice(coin.krwprice)}원</div>
                    <div className="binance">
                      {coin.usprice !== 0 &&
                        formatPrice(
                          coin.usprice * todayDollar < 100
                            ? parseFloat(
                                (coin.usprice * todayDollar).toFixed(2)
                              )
                            : parseFloat(
                                (coin.usprice * todayDollar).toFixed(1)
                              )
                        ) + "원"}
                    </div>
                  </td>
                  <td>
                    {/* 김프 */}
                    <div
                      className={
                        coin.krwprice &&
                        (coin.krwprice - coin.usprice * todayDollar) /
                          coin.krwprice >
                          0
                          ? "green"
                          : "red"
                      }
                    >
                      {coin.krwprice &&
                        coin.usprice != 0 &&
                        Math.floor(
                          ((coin.krwprice - coin.usprice * todayDollar) /
                            coin.krwprice) *
                            10000
                        ) /
                          100 +
                          "%"}
                    </div>

                    <div className="binance">
                      {coin.usprice != 0 &&
                        formatPrice(
                          coin.krwprice - coin.usprice * todayDollar
                        ) + "원"}
                    </div>
                  </td>
                  <td>
                    {/* 전일종가 */}
                    {formatPrice(coin.prevPrice)}원
                    {coin.change === "RISE" ? (
                      <span className="rise">⬆️</span>
                    ) : coin.change === "FALL" ? (
                      <span className="fall">⬇️</span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {" "}
                    {/* 변동액 */}
                    {coin.change === "RISE" ? (
                      <span className="rise">
                        {" "}
                        +{formatPrice(coin.absValue)}원
                      </span>
                    ) : coin.change === "FALL" ? (
                      <span className="fall">
                        {" "}
                        -{formatPrice(coin.absValue)}원
                      </span>
                    ) : (
                      <span>{coin.absValue}원</span>
                    )}
                  </td>
                  <td>
                    {coin.change === "RISE" ? (
                      <span className="rise">
                        +{(coin.changePercent * 100).toFixed(2)}%
                      </span>
                    ) : coin.change === "FALL" ? (
                      <span className="fall">
                        -{(coin.changePercent * 100).toFixed(2)}%
                      </span>
                    ) : (
                      <span>{(coin.changePercent * 100).toFixed(2)}%</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6}>
                {isLoading
                  ? "Loading..."
                  : isError
                  ? "Error fetching data"
                  : "데이터가 없습니다"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
