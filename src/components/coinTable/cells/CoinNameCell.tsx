import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { MdShowChart } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import { UpbitCoin } from '../../../types/coin.types';
import { useIsMobile } from '../../../hooks/useMediaQuery';

interface CoinNameCellProps {
  coin: UpbitCoin;
  market: string;
  isChartExpanded: boolean;
  isFavorite: boolean;
  onChartToggle: () => void;
  onFavoriteToggle: () => void;
}

const CoinNameCell = React.memo(({
  coin,
  market,
  isChartExpanded,
  isFavorite,
  onChartToggle,
  onFavoriteToggle,
}: CoinNameCellProps) => {
  const isMobile = useIsMobile();
  const symbol = market.replace('KRW-', '');
  
  if (isMobile) {
    return (
      <td className="py-2 px-0 border-none align-middle first:pl-1 last:pr-0 sm:py-1 sm:px-0 sm:whitespace-normal sm:break-words sm:min-w-0 sm:text-[9px] sm:first:pl-0.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <img
              className="w-[14px] h-[14px] mr-1 rounded-full align-middle object-cover sm:w-[14px] sm:h-[14px] sm:mr-1"
              src={`https://static.upbit.com/logos/${symbol}.png`}
              alt={coin.korean_name}
            />
            <span className="w-16 lg:w-full overflow-x-hidden whitespace-nowrap overflow-ellipsis text-[9px] font-medium text-gray-900 leading-normal sm:text-[9px] sm:leading-[1.3] dark:text-slate-100">
              {coin.korean_name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {isFavorite ? (
              <AiFillStar
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle();
                }}
                className="cursor-pointer text-sm text-yellow-500 transition-all flex-shrink-0 px-0.5 touch-manipulation"
                title="즐겨찾기 제거"
              />
            ) : (
              <AiOutlineStar
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle();
                }}
                className="cursor-pointer text-sm text-gray-400 transition-all flex-shrink-0 px-0.5 touch-manipulation"
                title="즐겨찾기 추가"
              />
            )}
            <span className="px-0.5 text-[9px] font-semibold text-gray-700 tracking-tight dark:text-slate-300">
              {symbol}
            </span>
            {isChartExpanded ? (
              <MdShowChart
                onClick={(e) => {
                  e.stopPropagation();
                  onChartToggle();
                }}
                className="cursor-pointer text-sm text-blue-600 transition-all flex-shrink-0 px-0.5 touch-manipulation"
                title="그래프 숨기기"
              />
            ) : (
              <BsGraphUp
                onClick={(e) => {
                  e.stopPropagation();
                  onChartToggle();
                }}
                className="cursor-pointer text-sm text-gray-500 transition-all flex-shrink-0 px-0.5 touch-manipulation"
                title="그래프 보기"
              />
            )}
          </div>
        </div>
      </td>
    );
  }
  
  return (
    <td className="py-4 px-4 border-none align-middle first:pl-5 last:pr-5 md:py-3 md:px-2 md:whitespace-nowrap md:min-w-[80px]">
      <div className="flex items-center flex-wrap gap-1.5">
        <img
          className="w-7 h-7 mr-2.5 rounded-full align-middle object-cover md:w-[22px] md:h-[22px] md:mr-2"
          src={`https://static.upbit.com/logos/${symbol}.png`}
          alt={coin.korean_name}
        />
        <span className="flex-[0_0_auto] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-gray-900 leading-normal md:text-xs dark:text-white">
          {coin.korean_name}
        </span>
        {isFavorite ? (
          <AiFillStar
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="cursor-pointer text-2xl text-yellow-500 transition-all flex-shrink-0 py-1 px-1.5 touch-manipulation md:hover:scale-110 md:hover:drop-shadow-[0_0_4px_rgba(255,193,7,0.8)]"
            title="즐겨찾기 제거"
          />
        ) : (
          <AiOutlineStar
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="cursor-pointer text-2xl text-gray-400 transition-all flex-shrink-0 py-1 px-1.5 touch-manipulation md:hover:text-yellow-500 md:hover:scale-110"
            title="즐겨찾기 추가"
          />
        )}
        {isChartExpanded ? (
          <MdShowChart
            onClick={(e) => {
              e.stopPropagation();
              onChartToggle();
            }}
            className="cursor-pointer text-2xl text-blue-600 transition-all flex-shrink-0 py-1 px-1.5 touch-manipulation md:hover:scale-110"
            title="그래프 숨기기"
          />
        ) : (
          <BsGraphUp
            onClick={(e) => {
              e.stopPropagation();
              onChartToggle();
            }}
            className="cursor-pointer text-2xl text-gray-500 transition-all flex-shrink-0 py-1 px-1.5 touch-manipulation md:hover:text-blue-600 md:hover:scale-110"
            title="그래프 보기"
          />
        )}
      </div>
      <div className="text-sm font-medium text-gray-900 leading-normal mt-1 text-xs text-gray-500 dark:text-slate-400">
        {coin.english_name} {symbol}
      </div>
    </td>
  );
});

export default CoinNameCell;
