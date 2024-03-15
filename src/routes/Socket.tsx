import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/configureStore';
import { Table } from 'react-bootstrap';
import { setCoinName } from '../store/coinsSlice';
import { KrwCoin, UpbitCoins } from '../types/coin';
import { FetchDollarPrice, FetchKrwCoins, FetchKrwPrice, FetchTodayDollar } from '../api';
import { FormatPrice } from '../function/data';
import { syncCoins } from '../store/upbitCoins';
import { fetchKRWPrice, syncKRWPrice, syncKRWPrice2, } from '../store/coinKrwPrice';

export const Socket = () => {
  const [todayDollar, setTodayDollar] = useState<number>(0);
  const [fetchFinished, setFetchedFinished] = useState(false)
  const coinsState = useSelector((state: RootState) => state.coins);
  const coinKrwPriceState = useSelector((state: RootState) => state.KrwCoin);
  const upbitCoinState = useSelector((state: RootState) => state.UpbitCoin);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
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
        const newUpbitCoinState: UpbitCoins = {};
        const newCoinKrwPrice: KrwCoin = {};
        krwCoins.forEach((coin: any) => {
          const coinSymbol = coin.market.substring(4);
          newUpbitCoinState[coinSymbol] = {
            ...newUpbitCoinState[coinSymbol],
            english_name: coinSymbol,
            korean_name: coin.korean_name,
            market_KRW: coin.market,
            market_USDT: coinSymbol + "USDT"
          };
          dispatch(setCoinName(coin.market))
        })
        dispatch(syncCoins(newUpbitCoinState));
      })
      .catch((error) => {
        console.log
      })

  }, [])

  useEffect(() => {
    if (coinKrwPriceState.loading == "success") {
      setFetchedFinished(true)
    }
  }, [coinKrwPriceState.loading])

  useEffect(() => {
    const markets = coinsState.coinNames.join(',')
    if (markets) {
      const newCoinState = { ...coinKrwPriceState };
      const apiAction = dispatch(fetchKRWPrice(markets))
    }
  }, [upbitCoinState])

  useEffect(() => {
    if (fetchFinished) {
      const ws = new WebSocket("wss://api.upbit.com/websocket/v1")
      ws.onopen = () => {
        console.log("socket opened")
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
        const NewcoinKrwPriceState = { ...coinKrwPriceState };
        let coinSymbol = updatedCoins.code.substring(4);
        const krwSymbol = updatedCoins.code;
        const updatedCoin = {
          krwSymbol: krwSymbol,
          krwprice: updatedCoins.trade_price,
          prevPrice: updatedCoins.prev_closing_price,
          change: updatedCoins.change,
          changePercent: updatedCoins.change_rate * 100,
          absValue: updatedCoins.change_price
        };
        NewcoinKrwPriceState.coins = {
          ...NewcoinKrwPriceState.coins,
          [coinSymbol]: updatedCoin
        };


        dispatch(syncKRWPrice2({ code: coinSymbol, updatedCoin: NewcoinKrwPriceState.coins[coinSymbol] }));
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
    }
  }, [fetchFinished])

  return (
    <>
      {fetchFinished ? (
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
              {Object.keys(upbitCoinState).length > 0 ? (
                Object.keys(upbitCoinState).map((market, idx) => {
                  const coin = upbitCoinState[market];
                  const KrwCoinInfo = coinKrwPriceState.coins[market]
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
                          <span>{coin.korean_name}</span>
                        </div>
                        <div>
                          {coin.english_name} {market.replace("KRW-", "")}
                        </div>
                      </td>

                      <td>
                        <div>{FormatPrice(KrwCoinInfo.krwprice)}원</div>
                        <div className="binance">
                          {/* {coin.usprice !== 0 &&
            FormatPrice(
              coin.usprice * todayDollar < 100
                ? parseFloat(
                  (coin.usprice * todayDollar).toFixed(2)
                )
                : parseFloat(
                  (coin.usprice * todayDollar).toFixed(1)
                )
            ) + "원"} */}
                        </div>
                      </td>
                      <td>
                        {/* 김프 */}
                        {/* <div
          className={
            KrwCoinInfo.krwprice &&
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
        </div> */}

                        {/* <div className="binance">
          {coin.usprice != 0 &&
            FormatPrice(
              coin.krwprice - coin.usprice * todayDollar
            ) + "원"}
        </div> */}
                      </td>
                      <td>
                        {/* 전일종가 */}
                        {FormatPrice(KrwCoinInfo.prevPrice)}원
                        {KrwCoinInfo.change === "RISE" ? (
                          <span className="rise">⬆️</span>
                        ) : KrwCoinInfo.change === "FALL" ? (
                          <span className="fall">⬇️</span>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        {/* 변동액 */}
                        {KrwCoinInfo.change === "RISE" ? (
                          <span className="rise">
                            +{FormatPrice(KrwCoinInfo.absValue)}원
                          </span>
                        ) : KrwCoinInfo.change === "FALL" ? (
                          <span className="fall">
                            -{FormatPrice(KrwCoinInfo.absValue)}원
                          </span>
                        ) : (
                          <span>{KrwCoinInfo.absValue}원</span>
                        )}
                      </td>
                      <td>
                        {KrwCoinInfo.change === "RISE" ? (
                          <span className="rise">
                            +{(KrwCoinInfo.changePercent * 100).toFixed(2)}%
                          </span>
                        ) : KrwCoinInfo.change === "FALL" ? (
                          <span className="fall">
                            -{(KrwCoinInfo.changePercent * 100).toFixed(2)}%
                          </span>
                        ) : (
                          <span>{(KrwCoinInfo.changePercent * 100).toFixed(2)}%</span>
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
      ) : (
        <div>

        </div>
      )}

    </>
  )
};