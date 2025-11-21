import React from 'react';
import CoinNameCell from './CoinNameCell';
import PriceCell from './PriceCell';
import KimchiPremiumCell from './KimchiPremiumCell';
import PrevPriceCell from './PrevPriceCell';
import ChangeCell from './ChangeCell';
import CoinChart from './CoinChart';
import { UpbitCoin } from '../types/coin.types';
import { KrwCoinPrice } from '../types/coin.types';
import { PriceChangeDirection } from '../types/coin.types';

interface CoinRowProps {
  market: string;
  coin: UpbitCoin;
  krCoin: KrwCoinPrice;
  usPrice: number;
  todayDollar: number;
  priceAnimation: PriceChangeDirection;
  isChartExpanded: boolean;
  isFavorite: boolean;
  onChartToggle: () => void;
  onFavoriteToggle: () => void;
}

const CoinRow = React.memo(({
  market,
  coin,
  krCoin,
  usPrice,
  todayDollar,
  priceAnimation,
  isChartExpanded,
  isFavorite,
  onChartToggle,
  onFavoriteToggle,
}: CoinRowProps) => {
  return (
    <>
      <tr>
        <CoinNameCell
          coin={coin}
          market={market}
          isChartExpanded={isChartExpanded}
          isFavorite={isFavorite}
          onChartToggle={onChartToggle}
          onFavoriteToggle={onFavoriteToggle}
        />
        <PriceCell
          krwPrice={krCoin.krwprice}
          usPrice={usPrice}
          todayDollar={todayDollar}
          animation={priceAnimation}
        />
        <KimchiPremiumCell
          krwPrice={krCoin.krwprice}
          usPrice={usPrice}
          todayDollar={todayDollar}
        />
        <PrevPriceCell prevPrice={krCoin.prevPrice} change={krCoin.change} />
        <ChangeCell value={krCoin.absValue} change={krCoin.change} />
        <ChangeCell value={krCoin.changePercent} change={krCoin.change} isPercent />
      </tr>
      {isChartExpanded && (
        <tr>
          <td colSpan={6} style={{ padding: 0 }}>
            <CoinChart market={coin.market_KRW} unit="1일" />
          </td>
        </tr>
      )}
    </>
  );
});

export default CoinRow;
