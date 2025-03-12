import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/configureStore";
import { setCoinState } from "../store/coinSlice";
import { setCoinName } from "../store/coinsSlice";
import { FetchDollarPrice, FetchKrwPrice, FetchTodayDollar } from "../api";
import { FormatPrice } from "../function/data";

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
  kimp: number;
  fontColor: string;
}

export const Home = () => {
  const [todayDollar, setTodayDollar] = useState<number>(0);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isRendered, setIsRendered] = useState(false)
  const coinState = useSelector((state: RootState) => state.coin);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    FetchTodayDollar()
      .then((dollar) => {
        setTodayDollar(dollar);
      })
      .catch((error) => {
        setTodayDollar(1389);
        console.error("Error fetching today's dollar:", error);
      });

    const fetchKrwCoins = async () => {
      try {
        const response = await axios.get("https://api.upbit.com/v1/market/all?isDetails=false");
        const krwCoins = response.data.filter((coin: any) => coin.market.startsWith("KRW-"));

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
            kimp: 0,
            fontColor: "blackColor",
          };
          dispatch(setCoinName(coin.market));
        });
        dispatch(setCoinState(newCoinState));
        setInitialDataFetched(true);
      } catch (error) {
        console.error("Error fetching KR₩ coins:", error);
      }
    };

    fetchKrwCoins();
  }, [dispatch]);

  const updateCoinPrices = async () => {
    const markets = Object.keys(coinState).join(",");
    const newCoinState = { ...coinState };

    try {
      const krwData = await FetchKrwPrice(markets);
      krwData.forEach((item: any) => {
        const market = item.market;
        const fontColor = newCoinState[market].krwprice !== item.trade_price ? "redColor" : "blackColor";
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

      const usdData = await FetchDollarPrice();
      usdData.forEach((item: any) => {
        const symbol = item.symbol;
        const market = Object.keys(newCoinState).find((key) => newCoinState[key].usSymbol === symbol);
        if (market) {
          newCoinState[market] = {
            ...newCoinState[market],
            usprice: item.lastPrice,
          };
        }
      });

      Object.keys(newCoinState).forEach((market) => {
        const coin = newCoinState[market];
        if (coin.krwprice && coin.usprice) {
          const kimp = ((coin.krwprice - coin.usprice * todayDollar) / (coin.usprice * todayDollar)) * 100;
          newCoinState[market].kimp = kimp;
        }
      });

      dispatch(setCoinState(newCoinState));
    } catch (error) {
      console.error("Error updating coin prices:", error);
    }
  };

  const { isLoading, isError } = useQuery("coinPrices", updateCoinPrices, {
    refetchInterval: 700,
    enabled: initialDataFetched,
  });

  const handleSort = (key: string) => {
    setIsRendered(true);
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
    if (!sortConfig || sortConfig.direction === "default") return Object.keys(coinState);

    const sorted = [...Object.keys(coinState)];
    sorted.sort((a, b) => {
      const coinA = coinState[a];
      const coinB = coinState[b];
      let comparison = 0;

      if (sortConfig.key === "krwName") {
        comparison = coinA.krwName.localeCompare(coinB.krwName);
      } else {
        const valueA = coinA[sortConfig.key as keyof Coin];
        const valueB = coinB[sortConfig.key as keyof Coin];

        if (sortConfig.key === "absValue" || sortConfig.key === "changePercent") {
          const actualValueA = coinA.change === "RISE" ? valueA : -valueA;
          const actualValueB = coinB.change === "RISE" ? valueB : -valueB;
          if (typeof actualValueA === "number" && typeof actualValueB === "number") {
            comparison = actualValueA - actualValueB;
          }
        } else {
          if (typeof valueA === "number" && typeof valueB === "number") {
            comparison = valueA - valueB;
          }
        }
      }

      if (sortConfig.direction === "descending") {
        comparison *= -1;
      }

      return comparison;
    });

    return sorted;
  };

  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <span style={{ fontSize: "10px" }}>△▽</span>;
    if (sortConfig.direction === "ascending") {
      return <span style={{ fontSize: "10px" }}>▲▽</span>;
    } else if (sortConfig.direction === "descending") {
      return <span style={{ fontSize: "10px" }}>△▼</span>;
    } else {
      return <span style={{ fontSize: "10px" }}>△▽</span>;
    }
  };


  const filteredCoins = sortedCoins().filter((market) => {
    const coin = coinState[market];
    return (
      coin.krwName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.engName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if(isLoading) return <div>로딩중</div>
  if(isError) return <div>에러가 발생햇습니다.</div>

  return (
    <div className="App" style={{ marginTop: "50px", wordBreak: "keep-all" }}>
      <Form.Control
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", width: "100%", }}
      />
      <Table>
        <thead>
          <tr>
            <th onClick={() => handleSort("krwName")}>
              <span className="coinName">Korean Name</span> {!isRendered ? <span style={{ fontSize: "10px" }}>△▽</span> : renderSortIcon("krwName")}
            </th>
            <th onClick={() => handleSort("krwprice")}>
              <span className="coinPrice">Price</span> {!isRendered ? <span style={{ fontSize: "10px" }}>△▽</span> : renderSortIcon("krwprice")}
            </th>
            <th onClick={() => handleSort("kimp")}>
              <span className="kimp">김치프리미엄</span> {!isRendered ? <span style={{ fontSize: "10px" }}>△▽</span> : renderSortIcon("kimp")}
            </th>
            <th className="display-none" onClick={() => handleSort("prevPrice")}>
              <span className="prevPrice">전일종가</span> {!isRendered ? <span style={{ fontSize: "10px" }}>△▽</span> : renderSortIcon("prevPrice")}
            </th>
            <th onClick={() => handleSort("absValue")}>
              <span className="prevalue">변동액</span> {!isRendered ? <span style={{ fontSize: "10px" }}>△▽</span> : renderSortIcon("absValue")}
            </th>
            <th onClick={() => handleSort("changePercent")}>
              <span className="prepercent">변화율</span> {!isRendered ? <span style={{ fontSize: "10px" }}>△▽</span> : renderSortIcon("changePercent")}
            </th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && Object.keys(coinState).length > 0 ? (
            filteredCoins.map((market, idx) => {
              const coin = coinState[market];
              return (
                <tr key={idx + 1}>
                  <td>
                    <div>
                      <img
                        className="logo"
                        src={"https://static.upbit.com/logos/" + market.replace("KRW-", "") + ".png"}
                        alt={coin.krwName}
                      ></img>
                      <span className="font-10px">{coin.krwName}</span>
                    </div>
                    <div className="font-10px">
                      {coin.engName} {market.replace("KRW-", "")}
                    </div>
                  </td>

                  <td>
                    <div className={"font-10px " + coin.fontColor}>{FormatPrice(coin.krwprice)}원</div>
                    <div className="binance">
                      {coin.usprice !== 0 &&
                        FormatPrice(
                          coin.usprice * todayDollar < 100
                            ? parseFloat((coin.usprice * todayDollar).toFixed(2))
                            : parseFloat((coin.usprice * todayDollar).toFixed(1))
                        ) + "원"}
                    </div>
                  </td>
                  <td>
                    <div
                      className={
                        coin.krwprice &&
                          (coin.krwprice - coin.usprice * todayDollar) / coin.krwprice > 0
                          ? "font-10px green"
                          : "font-10px red"
                      }
                    >
                      {coin.krwprice &&
                        coin.usprice !== 0 ? (
                        isFinite(
                          Math.floor(
                            ((coin.krwprice - coin.usprice * todayDollar) / (coin.usprice * todayDollar)) * 10000
                          ) /
                          100
                        ) ? (
                          Math.floor(
                            ((coin.krwprice - coin.usprice * todayDollar) / (coin.usprice * todayDollar)) * 10000
                          ) /
                          100 + "%"
                        ) : (
                          "Kimchi"
                        )
                      ) : (
                        "Kimchi"
                      )}
                    </div>

                    <div className="binance">
                      {coin.usprice !== 0 && FormatPrice(coin.krwprice - coin.usprice * todayDollar) + "원"}
                    </div>
                  </td>
                  <td className="font-10px display-none">
                    {FormatPrice(coin.prevPrice)}원
                    {coin.change === "RISE" ? (
                      <span className="rise">⬆️</span>
                    ) : coin.change === "FALL" ? (
                      <span className="fall">⬇️</span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="font-10px">
                    {coin.change === "RISE" ? (
                      <span className="rise">+{FormatPrice(coin.absValue)}원</span>
                    ) : coin.change === "FALL" ? (
                      <span className="fall">-{FormatPrice(coin.absValue)}원</span>
                    ) : (
                      <span>{FormatPrice(coin.absValue)}원</span>
                    )}
                  </td>
                  <td className="font-10px">
                    {coin.change === "RISE" ? (
                      <span className="rise">+{(coin.changePercent * 100).toFixed(2)}%</span>
                    ) : coin.change === "FALL" ? (
                      <span className="fall">-{(coin.changePercent * 100).toFixed(2)}%</span>
                    ) : (
                      <span>{(coin.changePercent * 100).toFixed(2)}%</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6}>{isLoading ? "Loading..." : isError ? "Error fetching data" : "F5를 눌러 새로고침을 해주세요."}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
