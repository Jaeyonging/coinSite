import React from 'react';
import TableHeader from './TableHeader';
import CoinRow from './CoinRow';
import { UpbitCoin } from '../../types/coin.types';
import { KrwCoinPrice } from '../../types/coin.types';
import { PriceChangeDirection } from '../../types/coin.types';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface CoinTableProps {
  markets: string[];
  upbitCoins: { [key: string]: UpbitCoin };
  krwPrices: { [key: string]: KrwCoinPrice };
  usPrices: { [key: string]: { usprice: number } };
  todayDollar: number;
  priceAnimations: { [key: string]: PriceChangeDirection };
  expandedCharts: { [key: string]: boolean };
  sortConfig: { key: string; direction: string } | null;
  isRendered: boolean;
  isFavorite: (market: string) => boolean;
  onSort: (key: string) => void;
  onChartToggle: (market: string) => void;
  onFavoriteToggle: (market: string) => void;
  onCoinClick: (market: string) => void;
}

const CoinTable = ({
  markets,
  upbitCoins,
  krwPrices,
  usPrices,
  todayDollar,
  priceAnimations,
  expandedCharts,
  sortConfig,
  isRendered,
  isFavorite,
  onSort,
  onChartToggle,
  onFavoriteToggle,
  onCoinClick,
}: CoinTableProps) => {
  const isMobile = useIsMobile();

  if (markets.length === 0) {
    return (
      <div className="text-center py-[30px] px-4 text-gray-500 text-[15px] sm:py-[30px] sm:px-4 sm:text-[13px]">
        <div className="text-[32px] mb-3 sm:text-[28px] sm:mb-3">🔍</div>
        <div>검색 결과가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden md:overflow-x-auto relative" style={{ width: '100%', maxWidth: '100%' }}>
      <table
        className={`w-full border-separate border-spacing-0 mt-0 rounded-lg overflow-hidden shadow-sm border border-gray-200 ${
          isMobile ? 'table-fixed' : 'table-auto'
        }`}
        style={{ 
          width: '100%', 
          maxWidth: '100%',
          tableLayout: isMobile ? 'fixed' : 'auto',
        }}
      >
        <TableHeader onSort={onSort} sortConfig={sortConfig} isRendered={isRendered} />
        <tbody>
          {markets.map((market, idx) => {
            const coin = upbitCoins[market];
            const krCoin = krwPrices[market];
            const usPrice = usPrices[market]?.usprice || 0;

            if (!coin || !krCoin) return null;

            return (
              <CoinRow
                key={`${market}-${idx}`}
                market={market}
                coin={coin}
                krCoin={krCoin}
                usPrice={usPrice}
                todayDollar={todayDollar}
                priceAnimation={priceAnimations[market] || null}
                isChartExpanded={!!expandedCharts[market]}
                isFavorite={isFavorite(market)}
                onChartToggle={() => onChartToggle(market)}
                onFavoriteToggle={() => onFavoriteToggle(market)}
                onCoinClick={() => onCoinClick(market)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
