import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { MdShowChart } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import { UpbitCoin } from '../types/coin.types';

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
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  
  if (isMobile) {
    return (
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img
              className="logo"
              src={`https://static.upbit.com/logos/${market.replace('KRW-', '')}.png`}
              alt={coin.korean_name}
            />
            <span className="font-10px" style={{ flex: '0 0 auto', minWidth: 0 }}>
              {coin.korean_name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isFavorite ? (
              <AiFillStar
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle();
                }}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#ffc107',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  padding: '0px 2px',
                  touchAction: 'manipulation',
                }}
                title="즐겨찾기 제거"
              />
            ) : (
              <AiOutlineStar
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle();
                }}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#adb5bd',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  padding: '0px 2px',
                  touchAction: 'manipulation',
                }}
                title="즐겨찾기 추가"
              />
            )}
            {isChartExpanded ? (
              <MdShowChart
                onClick={onChartToggle}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#0d6efd',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  padding: '0px 2px',
                  touchAction: 'manipulation',
                }}
                title="그래프 숨기기"
              />
            ) : (
              <BsGraphUp
                onClick={onChartToggle}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#6c757d',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  padding: '0px 2px',
                  touchAction: 'manipulation',
                }}
                title="그래프 보기"
              />
            )}
          </div>
        </div>
      </td>
    );
  }
  
  return (
    <td>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <img
          className="logo"
          src={`https://static.upbit.com/logos/${market.replace('KRW-', '')}.png`}
          alt={coin.korean_name}
        />
        <span className="font-10px" style={{ flex: '0 0 auto', minWidth: 0 }}>
          {coin.korean_name}
        </span>
        {isFavorite ? (
          <AiFillStar
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              color: '#ffc107',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              padding: '4px 6px',
              touchAction: 'manipulation',
            }}
            title="즐겨찾기 제거"
            onMouseEnter={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.transform = 'scale(1.2)';
                e.currentTarget.style.filter = 'drop-shadow(0 0 4px rgba(255, 193, 7, 0.8))';
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'none';
              }
            }}
          />
        ) : (
          <AiOutlineStar
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              color: '#adb5bd',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              padding: '4px 6px',
              touchAction: 'manipulation',
            }}
            title="즐겨찾기 추가"
            onMouseEnter={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.color = '#ffc107';
                e.currentTarget.style.transform = 'scale(1.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.color = '#adb5bd';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          />
        )}
        {isChartExpanded ? (
          <MdShowChart
            onClick={onChartToggle}
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              color: '#0d6efd',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              padding: '4px 6px',
              touchAction: 'manipulation',
            }}
            title="그래프 숨기기"
            onMouseEnter={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.transform = 'scale(1.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          />
        ) : (
          <BsGraphUp
            onClick={onChartToggle}
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              color: '#6c757d',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              padding: '4px 6px',
              touchAction: 'manipulation',
            }}
            title="그래프 보기"
            onMouseEnter={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.color = '#0d6efd';
                e.currentTarget.style.transform = 'scale(1.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.color = '#6c757d';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          />
        )}
      </div>
      <div className="font-10px" style={{ marginTop: '4px', fontSize: '12px', color: '#6c757d' }}>
        {coin.english_name} {market.replace('KRW-', '')}
      </div>
    </td>
  );
});

export default CoinNameCell;
