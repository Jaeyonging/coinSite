//data.ts

import axios from "axios";

export function FetchTodayDollar(): Promise<number> {
    return axios.get("https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD")
      .then((response) => {
        return parseFloat(response.data[0].basePrice);
      });
  }