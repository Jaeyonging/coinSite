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
      {/* 종목 */}
      <CoinNameCell
        position={position}
        coin={coin}
        isMobile={isMobile}
      />
      
      {/* 투자액 */}
      <td className="py-1.5 px-0 md:py-3.5 md:px-3 text-right whitespace-nowrap">
        {isMobile ? (
          <div className="text-[7px] md:text-sm font-semibold text-slate-700 dark:text-slate-200">
            {formatPrice(position.avgPrice * position.amount)}원
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {formatPrice(position.avgPrice * position.amount)}원
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-300 mt-px">
              {position.amount.toLocaleString()}개
            </div>
          </div>
        )}
      </td>
      
      {/* 평균단가 (모바일만 별도, 데스크톱은 다음 셀) */}
      {isMobile && (
        <td className="py-1.5 px-0 text-right text-[7px] md:text-sm text-slate-500 dark:text-slate-300 whitespace-nowrap">
          {formatPrice(position.avgPrice)}원
        </td>
      )}
      
      {/* 평균단가 (데스크톱) / 현재가 (모바일) */}
      <td className="py-1.5 px-0 md:py-3.5 md:px-3 text-right text-[7px] md:text-sm text-slate-500 dark:text-slate-300 whitespace-nowrap">
        {isMobile ? (
          formatPrice(krCoin.krwprice) + '원'
        ) : (
          formatPrice(position.avgPrice) + '원'
        )}
      </td>
      
      {/* 수익률 (모바일) / 현재가 (데스크톱) */}
      {isMobile ? (
        <ProfitLossCell
          profitLoss={profitLoss}
          profitLossPercent={profitLossPercent}
          isMobile={isMobile}
        />
      ) : (
        <td className="py-3.5 px-3 text-right text-sm text-slate-900 dark:text-white whitespace-nowrap">
          {formatPrice(krCoin.krwprice)}원
        </td>
      )}
      
      {/* 평가금액 */}
      <PriceCell
        price={currentValue}
        change={undefined}
        isMobile={isMobile}
      />
      
      {/* 수익률 (데스크톱) */}
      {!isMobile && (
        <ProfitLossCell
          profitLoss={profitLoss}
          profitLossPercent={profitLossPercent}
          isMobile={isMobile}
        />
      )}
      
      {/* 일자 (데스크톱만) */}
      {!isMobile && (
        <td className="py-3.5 px-3 text-center text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {position.purchaseDate ? position.purchaseDate : '-'}
        </td>
      )}
    </tr>
  );
};

export default PositionRow;
