import axios from "axios";
import { Coin } from "../types/coin";

const BASE_URL = 'https://api.upbit.com/v1';

export async function getMarketList(): Promise<Coin> {
    const query = '/market/all?isDetails=false';
    const response = await axios.get(BASE_URL + query);
    return response.data;
}



export async function FetchTodayDollar() {
    return axios.get("https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD")
        .then((response) => {
            return parseFloat(response.data[0].basePrice);
        });
}

export async function FetchKrwCoins() {
    const response = await axios.get("https://api.upbit.com/v1/market/all?isDetails=false"
    )
    return response.data
}

export async function FetchKrwPrice(markets: string) {
    if (markets.length < 1) {
        return
    }
    const response = await axios.get(`https://api.upbit.com/v1/ticker?markets=${markets}`
    )
    return response.data
}


export async function FetchDollarPrice() {
    const response = await axios.get("https://api.binance.com/api/v3/ticker/24hr"
    )
    return response.data
}



