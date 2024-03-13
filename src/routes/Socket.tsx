import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/configureStore';
import { setCoinState, setCoinState2 } from '../store/coinSlice';
import { Table } from 'react-bootstrap';
import { setCoinName } from '../store/coinsSlice';
import { Coin } from '../types/coin';
import { FetchDollarPrice, FetchKrwCoins, FetchTodayDollar } from '../api';
import { FormatPrice } from '../function/data';
import { useQuery } from 'react-query';

export const Socket = () => {
  const [todayDollar, setTodayDollar] = useState<number>(0);
  const [isDataFinished, setDataFinished] = useState(false)
  const coinState = useSelector((state: RootState) => state.coin);
  const coinsState = useSelector((state: RootState) => state.coins);
  const dispatch = useDispatch<AppDispatch>();


  const updateCoinPrices = async () => {
    const newCoinState = { ...coinState };

    FetchDollarPrice().then((data) => {
      data.forEach((item: any) => {
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
    })
  };

  useEffect(() => {
    console.log("hi")
    FetchTodayDollar()
      .then((dollar) => {
        setTodayDollar(dollar);
      })
      .catch((error) => {
        console.error("Error fetching today's dollar:", error);
      });

    FetchKrwCoins()
      .then((data) => {
        const krwCoins = data.filter((coin: any) =>
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
          dispatch(setCoinName(coin.market))
        })
        dispatch(setCoinState(newCoinState));
        setDataFinished(true)
      })
  }, [])

  useEffect(() => {
    const ws = new WebSocket("wss://api.upbit.com/websocket/v1")
    ws.onopen = () => {
      console.log("WebSocket connected!");
      ws.send(JSON.stringify([
        { "ticket": "test example" },
        { "type": "ticker", "codes": coinsState.coinNames },
        { "format": "DEFAULT" }
      ]));
    }

    ws.onmessage = async e => {
      const { data } = e;
      const text = await new Response(data).text();
      const updatedCoins = JSON.parse(text);
      const newCoinState = { ...coinState };
      let code = updatedCoins.code;
      if (newCoinState[code]) {
        const fontColor =
          newCoinState[code].krwprice !== updatedCoins.trade_price
            ? "blackColor"
            : "redColor";

        newCoinState[code] = {
          ...newCoinState[code],
          krwprice: updatedCoins.trade_price,
          prevPrice: updatedCoins.prev_closing_price,
          change: updatedCoins.change,
          changePercent: updatedCoins.change_rate,
          absValue: updatedCoins.change_price,
          fontColor,
        };

        dispatch(setCoinState2({ code, updatedCoin: newCoinState[code] }));
      }
    };
    ws.onclose = () => {
      console.log("WebSocket closed!");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [isDataFinished])

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
          {Object.keys(coinState).length > 0 ? (
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
                    <div>{FormatPrice(coin.krwprice)}원</div>
                    <div className="binance">
                      {coin.usprice !== 0 &&
                        FormatPrice(
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
                        FormatPrice(
                          coin.krwprice - coin.usprice * todayDollar
                        ) + "원"}
                    </div>
                  </td>
                  <td>
                    {/* 전일종가 */}
                    {FormatPrice(coin.prevPrice)}원
                    {coin.change === "RISE" ? (
                      <span className="rise">⬆️</span>
                    ) : coin.change === "FALL" ? (
                      <span className="fall">⬇️</span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {/* 변동액 */}
                    {coin.change === "RISE" ? (
                      <span className="rise">
                        +{FormatPrice(coin.absValue)}원
                      </span>
                    ) : coin.change === "FALL" ? (
                      <span className="fall">
                        -{FormatPrice(coin.absValue)}원
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

            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

