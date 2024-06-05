import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/configureStore';
import { Form, Table } from 'react-bootstrap';
import { setCoinName } from '../store/coinsSlice';
import { KrwCoin, KrwCoin2, USCoin, UpbitCoins } from '../types/coin';
import { FetchDollarPrice, FetchKrwCoins, FetchKrwPrice, FetchTodayDollar } from '../api';
import { FormatPrice } from '../function/data';
import { syncCoins } from '../store/upbitCoins';
import { fetchKRWPrice, syncKRWPrice, syncKRWPrice2 } from '../store/coinKrwPrice';
import { setUSCoin, syncUSPRICE } from '../store/coinUsPrice';

export const Socket = () => {
  const [todayDollar, setTodayDollar] = useState<number>(0);
  const [fetchFinished, setFetchedFinished] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isRendered, setIsRendered] = useState(false)

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
        const krwCoins = data.filter((coin: any) => coin.market.startsWith("KRW-"));
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
          dispatch(setCoinName(coin.market));
        });
        dispatch(syncCoins(newUpbitCoinState));
        dispatch(setUSCoin(newUSCOIN));
      })
      .catch((error) => {
        console.error('Error fetching KRW coins:', error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (coinKrwPriceState.loading === "success") {
      setFetchedFinished(true);
    }
  }, [coinKrwPriceState.loading]);

  useEffect(() => {
    const markets = coinsState.coinNames.join(',');
    if (markets) {
      dispatch(fetchKRWPrice(markets));
    }
  }, [upbitCoinState, coinsState.coinNames, dispatch]);

  useEffect(() => {
    if (fetchFinished) {
      const upbtitWS = new WebSocket("wss://api.upbit.com/websocket/v1");
      const convertedPairs = coinsState.coinNames.map(pair => {
        const currency = pair.split('-')[1].toLowerCase();
        return `${currency}usdt@markPrice@1s`;
      });
      const combinedString = convertedPairs.join('/');

      const binanceWS = new WebSocket(`wss://fstream.binance.com/stream?streams=${combinedString}`);

      binanceWS.onmessage = async e => {
        const { data } = e;
        const text = await new Response(data).text();
        const updatedCoins = JSON.parse(text).data;

        const usSymbole = updatedCoins.s.replace("USDT", "");
        const updatedCoin = { usprice: parseFloat(updatedCoins.p) };

        dispatch(syncUSPRICE({ code: usSymbole, updatedCoin }));
      };

      upbtitWS.onopen = () => {
        upbtitWS.send(JSON.stringify([
          { "ticket": "test example" },
          { "type": "ticker", "codes": coinsState.coinNames },
          { "format": "DEFAULT" }
        ]));
      };

      upbtitWS.onmessage = async e => {
        const { data } = e;
        const text = await new Response(data).text();
        const updatedCoins = JSON.parse(text);
        const coinSymbol = updatedCoins.code.substring(4);
        const updatedCoin = {
          krwprice: updatedCoins.trade_price,
          prevPrice: updatedCoins.prev_closing_price,
          change: updatedCoins.change,
          changePercent: updatedCoins.change_rate * 100,
          absValue: updatedCoins.change_price
        };

        dispatch(syncKRWPrice2({ code: coinSymbol, updatedCoin }));
      };



      return () => {
        upbtitWS.close();
        binanceWS.close();
      };
    }
  }, [fetchFinished, coinsState.coinNames, dispatch]);

  const handleSort = (key: string) => {
    setIsRendered(true)
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = "default";
      }
    }
    setSortConfig({ key, direction });
  };



  const sortedCoins = () => {
    if (!sortConfig || sortConfig.direction === "default") {
      return Object.keys(upbitCoinState);
    }

    const sorted = [...Object.keys(upbitCoinState)];
    sorted.sort((a, b) => {
      const coinA = upbitCoinState[a];
      const coinB = upbitCoinState[b];
      let comparison = 0;

      let valueA, valueB;
      switch (sortConfig.key) {
        case 'koreanName':
          comparison = coinA.korean_name.localeCompare(coinB.korean_name);
          break;
        case 'price':
          valueA = coinKrwPriceState.coins[a]?.krwprice ?? 0;
          valueB = coinKrwPriceState.coins[b]?.krwprice ?? 0;
          comparison = valueA - valueB;
          break;
        case 'kimp':
          const usPriceA = coinUSPriceState[a]?.usprice ?? 0;
          const usPriceB = coinUSPriceState[b]?.usprice ?? 0;
          valueA = (coinKrwPriceState.coins[a].krwprice - usPriceA * todayDollar) / (usPriceA * todayDollar) * 100;
          valueB = (coinKrwPriceState.coins[b].krwprice - usPriceB * todayDollar) / (usPriceB * todayDollar) * 100;
          comparison = valueA - valueB;
          break;
        case 'prevPrice':
          valueA = coinKrwPriceState.coins[a]?.prevPrice ?? 0;
          valueB = coinKrwPriceState.coins[b]?.prevPrice ?? 0;
          comparison = valueA - valueB;
          break;
        case 'absValue':
          valueA = coinKrwPriceState.coins[a]?.absValue ?? 0;
          valueB = coinKrwPriceState.coins[b]?.absValue ?? 0;
          const actualValueA = coinKrwPriceState.coins[a]?.change === "RISE" ? valueA : -valueA;
          const actualValueB = coinKrwPriceState.coins[b]?.change === "RISE" ? valueB : -valueB;
          comparison = actualValueA - actualValueB;
          break;
        case 'changePercent':
          valueA = coinKrwPriceState.coins[a]?.changePercent ?? 0;
          valueB = coinKrwPriceState.coins[b]?.changePercent ?? 0;
          const actualPercentA = coinKrwPriceState.coins[a]?.change === "RISE" ? valueA : -valueA;
          const actualPercentB = coinKrwPriceState.coins[b]?.change === "RISE" ? valueB : -valueB;
          comparison = actualPercentA - actualPercentB;
          break;
        default:
          return 0;
      }

      if (sortConfig.direction === 'descending') {
        comparison *= -1;
      }

      return comparison;
    });

    return sorted;
  };



  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    if (sortConfig.direction === 'ascending') {
      return <span>▲</span>;
    } else if (sortConfig.direction === 'descending') {
      return <span>▼</span>;
    } else {
      return null;
    }
  };

  const filteredCoins = sortedCoins().filter((market) => {
    const coin = upbitCoinState[market];
    return (
      coin.korean_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.english_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  return (
    <>
      {fetchFinished ? (
        <div className="App" style={{ marginTop: "50px", wordBreak: "keep-all" }}>
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "20px", width: "100%" }}
          />
          <Table>
            <thead>
              <tr>
                <th onClick={() => handleSort('koreanName')}>
                  <span className="coinName">Korean Name</span> {!isRendered ? <span>△▽</span> : renderSortIcon('koreanName')}
                </th>
                <th onClick={() => handleSort('price')}>
                  <span className="coinPrice">Price</span> {!isRendered ? <span>△▽</span> : renderSortIcon('price')}
                </th>
                <th onClick={() => handleSort('kimp')}>
                  <span className="kimp">김치프리미엄</span> {!isRendered ? <span>△▽</span> : renderSortIcon('kimp')}
                </th>
                <th className='display-none' onClick={() => handleSort('prevPrice')}>
                  <span className="prevPrice">전일종가</span> {!isRendered ? <span>△▽</span> : renderSortIcon('prevPrice')}
                </th>
                <th onClick={() => handleSort('absValue')}>
                  <span className="prevalue">변동액</span> {!isRendered ? <span>△▽</span> : renderSortIcon('absValue')}
                </th>
                <th onClick={() => handleSort('changePercent')}>
                  <span className="prepercent">변화율</span> {!isRendered ? <span>△▽</span> : renderSortIcon('changePercent')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCoins().length > 0 ? (
                filteredCoins.map((market, idx) => {
                  const coin = upbitCoinState[market];
                  const uscoin = coinUSPriceState[market];
                  const krcoin = coinKrwPriceState.coins[market];
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
                          <span className="font-10px">{coin.korean_name}</span>
                        </div>
                        <div className="font-10px">
                          {coin.english_name} {market.replace("KRW-", "")}
                        </div>
                      </td>
                      <td>
                        <div className="font-10px">{FormatPrice(krcoin.krwprice)}원</div>
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
                        <div
                          className={
                            krcoin.krwprice &&
                              (krcoin.krwprice - uscoin.usprice * todayDollar) /
                              (uscoin.usprice * todayDollar) >
                              0
                              ? "font-10px green"
                              : "font-10px red"
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
                      <td className="font-10px display-none">
                        {FormatPrice(krcoin.prevPrice)}원
                        {krcoin.change === "RISE" ? (
                          <span className="rise">⬆️</span>
                        ) : krcoin.change === "FALL" ? (
                          <span className="fall">⬇️</span>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="font-10px">
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
                      <td className="font-10px">
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
                <tr></tr>
              )}
            </tbody>
          </Table>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
