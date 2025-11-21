import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import TableHeader from './TableHeader';
import CoinRow from './CoinRow';
import CoinCard from './CoinCard';
import { UpbitCoin } from '../types/coin.types';
import { KrwCoinPrice } from '../types/coin.types';
import { PriceChangeDirection } from '../types/coin.types';

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
}: CoinTableProps) => {
  if (markets.length === 0) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
    return (
      <div
        style={{
          textAlign: 'center',
          padding: isMobile ? '30px 16px' : '40px 20px',
          color: '#6c757d',
          fontSize: isMobile ? '13px' : '15px',
        }}
      >
        <div style={{ fontSize: isMobile ? '28px' : '32px', marginBottom: '12px' }}>🔍</div>
        <div>검색 결과가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <Table style={{ width: '100%', tableLayout: 'auto' }}>
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
              />
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default CoinTable;
