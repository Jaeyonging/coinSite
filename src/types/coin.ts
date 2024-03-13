
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

export interface CoinState {
    coinNameList: {
        [key: string]: {
            krwPrice: number;
        }
    }

    coinNames: string[];

}