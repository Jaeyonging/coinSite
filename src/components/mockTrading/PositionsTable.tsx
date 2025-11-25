import React from 'react';
import { UpbitCoin } from '../../types/coin.types';
import { KrwCoinPrice } from '../../types/coin.types';
import { Position } from '../../types/mockTrading.types';
import PositionRow from './PositionRow';
import EmptyPositions from './EmptyPositions';
import TableHeader from './TableHeader';

interface PositionsTableProps {
  positions: Position[];
  upbitCoins: { [key: string]: UpbitCoin };
  krwPrices: { [key: string]: KrwCoinPrice };
  onCoinClick: (market: string) => void;
  isMobile: boolean;
}

const PositionsTable = ({
  positions,
  upbitCoins,
  krwPrices,
  onCoinClick,
  isMobile,
}: PositionsTableProps) => {
  if (positions.length === 0) {
    return <EmptyPositions isMobile={isMobile} />;
  }

  return (
    <div className={`${isMobile ? 'overflow-x-visible' : 'overflow-x-auto'} -webkit-overflow-scrolling-touch`}>
      <table className="w-full border-separate border-spacing-0">
        <TableHeader isMobile={isMobile} />
        <tbody>
          {positions.map((position) => {
            const coin = upbitCoins[position.market];
            const krCoin = krwPrices[position.market];
            
            if (!coin || !krCoin) return null;

            return (
              <PositionRow
                key={position.market}
                position={position}
                coin={coin}
                krCoin={krCoin}
                onCoinClick={onCoinClick}
                isMobile={isMobile}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsTable;
