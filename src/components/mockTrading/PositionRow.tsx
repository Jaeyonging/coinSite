import React from 'react';
import { UpbitCoin } from '../../types/coin.types';
import { KrwCoinPrice } from '../../types/coin.types';
import { Position } from '../../types/mockTrading.types';
import { formatPrice } from '../../utils/formatters';
import CoinNameCell from './CoinNameCell';
import PriceCell from './PriceCell';
import ProfitLossCell from './ProfitLossCell';

interface PositionRowProps {
  position: Position;
  coin: UpbitCoin;
  krCoin: KrwCoinPrice;
  onCoinClick: (market: string) => void;
  isMobile: boolean;
}

const PositionRow = ({ position, coin, krCoin, onCoinClick, isMobile }: PositionRowProps) => {
  const currentValue = krCoin.krwprice * position.amount;
  const profitLoss = (krCoin.krwprice - position.avgPrice) * position.amount;
  const profitLossPercent = position.avgPrice > 0 
    ? ((krCoin.krwprice - position.avgPrice) / position.avgPrice) * 100
    : 0;

  return (
    <tr
      onClick={() => onCoinClick(position.market)}
      className="cursor-pointer border-b border-slate-100 transition-colors duration-200 ease-in-out hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
    >
      <CoinNameCell
        position={position}
        coin={coin}
        profitLoss={profitLoss}
        profitLossPercent={profitLossPercent}
        isMobile={isMobile}
      />
      <td className="hidden md:table-cell py-3.5 px-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">
        {formatPrice(position.avgPrice * position.amount)}원
      </td>
      <td className="hidden md:table-cell py-3.5 px-3 text-right text-sm font-medium text-slate-500 dark:text-slate-300">
        {position.amount.toLocaleString()}개
      </td>
      <td className="hidden md:table-cell py-3.5 px-3 text-right text-sm text-slate-500 dark:text-slate-300">
        {formatPrice(position.avgPrice)}원
      </td>
      <td className="py-1.5 px-0 text-right text-[9px] font-semibold text-slate-600 md:py-3.5 md:px-3 md:text-sm dark:text-slate-200">
        <span className="md:hidden">{formatPrice(position.avgPrice)}원</span>
        <span className="hidden md:inline text-slate-900 dark:text-white">
          {formatPrice(krCoin.krwprice)}원
        </span>
      </td>
      <PriceCell
        price={isMobile ? krCoin.krwprice : currentValue}
        change={isMobile ? krCoin.change : undefined}
        isMobile={isMobile}
      />
      <ProfitLossCell
        profitLoss={profitLoss}
        profitLossPercent={profitLossPercent}
        isMobile={isMobile}
      />
      {!isMobile && (
        <td className="py-3.5 px-3 text-center text-sm text-slate-500 dark:text-slate-400">
          {position.purchaseDate ? position.purchaseDate : '-'}
        </td>
      )}
    </tr>
  );
};

export default PositionRow;
