import axios from "axios";
import { Coin } from "../types/coin";

const BASE_URL = 'https://api.upbit.com/v1';

export async function FetchTodayDollar() {
    return axios.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vQF1KDUxPDqapqgXa3qyOoyWQ7ndB8hvi4Ct0FKxGXW0wofPOLbLyqWuQeGRkvvEjhwTuwmmQ7hyM9m/pub?gid=0&single=true&output=csv")
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err)
        });
}

export async function FetchKrwCoins() {
    const response = await axios.get("/api/v1/market/all?isDetails=false", {
        transformRequest: [(data, headers) => {
            delete headers['Origin'];
            return data;
        }]
    });
    return response.data;
}


export async function FetchKrwPrice(markets: string) {
    if (markets.length < 1) {
        return;
    }
    const response = await axios.get(`/api/v1/ticker?markets=${markets}`, {
        transformRequest: [(data, headers) => {
            delete headers['Origin'];
            return data;
        }]
    });
    return response.data;
}


