
export interface Coin {
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


export interface UpbitCoins {
    [key: string]: {
        english_name: string;
        korean_name: string;
        market_KRW: string
        market_USDT: string
    }
}
export interface USCoin {
    [key: string]: {
        engName: string;
        usSymbol: string;
        usprice: number;
    };
}

export interface KrwCoin {
    [key: string]: {
        krwSymbol: string;
        krwprice: number;
        prevPrice: number;
        change: string;
        changePercent: number;
        absValue: number;
    }
}

export interface KrwCoin2 {
    coins: {
        [key: string]: {
            krwSymbol: string;
            krwprice: number;
            prevPrice: number;
            change: string;
            changePercent: number;
            absValue: number;
        }
    },
    loading: string
}


export interface CoinState {
    coinNameList: {
        [key: string]: {
            krwPrice: number;
        }
    }

    coinNames: string[];

}