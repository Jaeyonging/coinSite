import React from 'react';
import CoinNameCell from './cells/CoinNameCell';
import PriceCell from './cells/PriceCell';
import KimchiPremiumCell from './cells/KimchiPremiumCell';
import PrevPriceCell from './cells/PrevPriceCell';
import ChangeCell from './cells/ChangeCell';
import TradeVolumeCell from './cells/TradeVolumeCell';
import CoinChart from '../chart/CoinChart';
import { UpbitCoin } from '../../types/coin.types';
import { KrwCoinPrice } from '../../types/coin.types';
import { PriceChangeDirection } from '../../types/coin.types';

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
  onCoinClick: () => void;
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
  onCoinClick,
}: CoinRowProps) => {
  return (
    <>
      <tr
        onClick={onCoinClick}
        className="bg-white/90 transition-colors border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/60 md:hover:bg-transparent"
      >
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
        <ChangeCell value={krCoin.changePercent} change={krCoin.change} isPercent absValue={krCoin.absValue} />
        <TradeVolumeCell accTradePrice24h={krCoin.accTradePrice24h} />
      </tr>
      {isChartExpanded && (
        <tr className="bg-slate-50/60 dark:bg-slate-900/40">
          <td 
            colSpan={5} 
            className="p-0 w-full max-w-full" 
            style={{ 
              width: '100%', 
              maxWidth: '100%',
              padding: 0,
              margin: 0,
            }}
          >
            <CoinChart market={coin.market_KRW} unit="1일" />
          </td>
        </tr>
      )}
    </>
  );
});

export default CoinRow;
