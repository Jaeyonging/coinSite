import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/configureStore';
import { Table } from 'react-bootstrap';
import { setCoinName } from '../store/coinsSlice';
import { KrwCoin, USCoin, UpbitCoins } from '../types/coin';
import { FetchDollarPrice, FetchKrwCoins, FetchKrwPrice, FetchTodayDollar } from '../api';
import { FormatPrice } from '../function/data';
import { syncCoins } from '../store/upbitCoins';
import { fetchKRWPrice, syncKRWPrice, syncKRWPrice2, } from '../store/coinKrwPrice';
import { setUSCoin, syncUSPRICE } from '../store/coinUsPrice';

export const Socket = () => {
  const [todayDollar, setTodayDollar] = useState<number>(0);
  const [fetchFinished, setFetchedFinished] = useState(false)
  const [USfetchFinished, setUSFetchedFinished] = useState(false)
  const coinsState = useSelector((state: RootState) => state.coins);
  const coinKrwPriceState = useSelector((state: RootState) => state.KrwCoin);
  const coinUSPriceState = useSelector((state: RootState) => state.USCoin);
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
        const newUSCOIN: USCoin = {};
        krwCoins.forEach((coin: any) => {
          const coinSymbol = coin.market.substring(4);
          newUpbitCoinState[coinSymbol] = {
            ...newUpbitCoinState[coinSymbol],
            english_name: coin.english_name,
            korean_name: coin.korean_name,
            market_KRW: coin.market,
            market_USDT: coinSymbol + "USDT"
          };
          newUSCOIN[coinSymbol] = {
            usSymbol: coinSymbol,
            usprice: 0
          };
          dispatch(setCoinName(coin.market))
        })
        dispatch(syncCoins(newUpbitCoinState));
        dispatch(setUSCoin(newUSCOIN))
      })
      .catch((error) => {
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
      const upbtitWS = new WebSocket("wss://api.upbit.com/websocket/v1")
      const convertedPairs = coinsState.coinNames.map(pair => {
        const currency = pair.split('-')[1].toLowerCase()
        //return `${currency}usdt@aggTrade`;
        return `${currency}usdt@markPrice@1s`;
      });
      const combinedString = convertedPairs.join('/');

      const binanceWS = new WebSocket(`wss://fstream.binance.com/stream?streams=${combinedString}`);
      // const binanceWS = new WebSocket(`wss://fstream.binance.com/stream?streams=btcusdt@aggTrade`);
      binanceWS.onopen = () => {
      }
      binanceWS.onmessage = async e => {
        const { data } = e;
        const text = await new Response(data).text();
        const updatedCoins = JSON.parse(text).data;

        const usSymbole = updatedCoins.s.replace("USDT", "")
        const updatedCoin = {
          usprice: parseFloat(updatedCoins.p)
        };

        dispatch(syncUSPRICE({ code: usSymbole, updatedCoin: updatedCoin }));
      }

      upbtitWS.onopen = () => {
        upbtitWS.send(JSON.stringify([
          { "ticket": "test example" },
          { "type": "ticker", "codes": coinsState.coinNames },
          { "format": "DEFAULT" }
        ]));
      }

      upbtitWS.onmessage = async e => {
        const { data } = e;
        const text = await new Response(data).text();
        const updatedCoins = JSON.parse(text);
        const NewcoinKrwPriceState = { ...coinKrwPriceState };
        let coinSymbol = updatedCoins.code.substring(4);
        const updatedCoin = {
          krwprice: updatedCoins.trade_price,
          prevPrice: updatedCoins.prev_closing_price,
          change: updatedCoins.change,
          changePercent: updatedCoins.change_rate * 100,
          absValue: updatedCoins.change_price
        };
        NewcoinKrwPriceState.coins = {
          [coinSymbol]: updatedCoin
        };

        dispatch(syncKRWPrice2({ code: coinSymbol, updatedCoin: NewcoinKrwPriceState.coins[coinSymbol] }));
      };
      upbtitWS.onclose = () => {
      };
      upbtitWS.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        upbtitWS.close();
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
                  const uscoin = coinUSPriceState[market]
                  const krcoin = coinKrwPriceState.coins[market]
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
                        <div>{FormatPrice(krcoin.krwprice)}원</div>
                        <div className="binance">
                          {uscoin && uscoin.usprice !== undefined && uscoin.usprice !== 0 ? (
                            FormatPrice(
                              uscoin.usprice * todayDollar < 100
                                ? parseFloat((uscoin.usprice * todayDollar).toFixed(2))
                                : parseFloat((uscoin.usprice * todayDollar).toFixed(1))
                            ) + "원"
                          ) : (
                            ""
                          )}
                        </div>
                      </td>
                      <td>
                        {/* 김프 */}
                        <div
                          className={
                            krcoin.krwprice &&
                              (krcoin.krwprice - uscoin.usprice * todayDollar) /
                              (uscoin.usprice * todayDollar) >
                              0
                              ? "green"
                              : "red"
                          }
                        >
                          {krcoin.krwprice &&
                            uscoin.usprice != 0 &&
                            Math.floor(
                              ((krcoin.krwprice - uscoin.usprice * todayDollar) /
                                (uscoin.usprice * todayDollar)) *
                              10000
                            ) /
                            100 +
                            "%"}
                        </div>

                        <div className="binance">
                          {uscoin.usprice != 0 &&
                            FormatPrice(
                              krcoin.krwprice - uscoin.usprice * todayDollar
                            ) + "원"}
                        </div>
                      </td>
                      <td>
                        {/* 전일종가 */}
                        {FormatPrice(krcoin.prevPrice)}원
                        {krcoin.change === "RISE" ? (
                          <span className="rise">⬆️</span>
                        ) : krcoin.change === "FALL" ? (
                          <span className="fall">⬇️</span>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        {/* 변동액 */}
                        {krcoin.change === "RISE" ? (
                          <span className="rise">
                            +{FormatPrice(krcoin.absValue)}원
                          </span>
                        ) : krcoin.change === "FALL" ? (
                          <span className="fall">
                            -{FormatPrice(krcoin.absValue)}원
                          </span>
                        ) : (
                          <span>{krcoin.absValue}원</span>
                        )}
                      </td>
                      <td>
                        {krcoin.change === "RISE" ? (
                          <span className="rise">
                            +{(krcoin.changePercent).toFixed(2)}%
                          </span>
                        ) : krcoin.change === "FALL" ? (
                          <span className="fall">
                            -{(krcoin.changePercent).toFixed(2)}%
                          </span>
                        ) : (
                          <span>{(krcoin.changePercent).toFixed(2)}%</span>
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