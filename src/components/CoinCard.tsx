import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { MdShowChart } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import CoinChart from './CoinChart';
import { UpbitCoin } from '../types/coin.types';
import { KrwCoinPrice } from '../types/coin.types';
import { PriceChangeDirection } from '../types/coin.types';
import { formatPrice } from '../utils/formatters';
import { COLORS, ANIMATION_DURATION } from '../utils/constants';

interface CoinCardProps {
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

const CoinCard = React.memo(({
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
}: CoinCardProps) => {
  const binancePrice =
    usPrice && usPrice !== 0
      ? formatPrice(
          usPrice * todayDollar < 100
            ? parseFloat((usPrice * todayDollar).toFixed(2))
            : parseFloat((usPrice * todayDollar).toFixed(1))
        ) + '원'
      : '';

  const calculatePremium = () => {
    if (!krCoin.krwprice || !usPrice || usPrice === 0) {
      return { percentage: 'Kimchi', difference: 0 };
    }
    const premium =
      ((krCoin.krwprice - usPrice * todayDollar) / (usPrice * todayDollar)) * 100;
    const difference = krCoin.krwprice - usPrice * todayDollar;
    const percentage = isFinite(Math.floor(premium * 100) / 100)
      ? `${Math.floor(premium * 100) / 100}%`
      : 'Kimchi';
    return { percentage, difference };
  };

  const { percentage, difference } = calculatePremium();
  const isPositive = difference > 0;

  const changeDisplayValue = (value: number, isPercent: boolean) => {
    return isPercent ? value.toFixed(2) + '%' : formatPrice(value) + '원';
  };

  return (
    <div className="coin-card">
      <div className="coin-card-header">
        <div className="coin-card-name">
          <img
            className="logo"
            src={`https://static.upbit.com/logos/${market.replace('KRW-', '')}.png`}
            alt={coin.korean_name}
          />
          <div>
            <div className="coin-card-korean-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {coin.korean_name}
              {isFavorite ? (
                <AiFillStar
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteToggle();
                  }}
                  style={{
                    cursor: 'pointer',
                    fontSize: '22px',
                    color: '#ffc107',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
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
                    fontSize: '22px',
                    color: '#adb5bd',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    touchAction: 'manipulation',
                  }}
                  title="즐겨찾기 추가"
                  onMouseEnter={(e) => {
                    if (window.innerWidth > 768) {
                      e.currentTarget.style.color = '#ffc107';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth > 768) {
                      e.currentTarget.style.color = '#adb5bd';
                    }
                  }}
                />
              )}
              {isChartExpanded ? (
                <MdShowChart
                  onClick={onChartToggle}
                  style={{
                    cursor: 'pointer',
                    fontSize: '22px',
                    color: '#0d6efd',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    touchAction: 'manipulation',
                  }}
                  title="그래프 숨기기"
                />
              ) : (
                <BsGraphUp
                  onClick={onChartToggle}
                  style={{
                    cursor: 'pointer',
                    fontSize: '22px',
                    color: '#6c757d',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    touchAction: 'manipulation',
                  }}
                  title="그래프 보기"
                  onMouseEnter={(e) => {
                    if (window.innerWidth > 768) {
                      e.currentTarget.style.color = '#0d6efd';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth > 768) {
                      e.currentTarget.style.color = '#6c757d';
                    }
                  }}
                />
              )}
            </div>
            <div className="coin-card-english-name">
              {coin.english_name} {market.replace('KRW-', '')}
            </div>
          </div>
        </div>
      </div>

      <div className="coin-card-body">
        <div className="coin-card-row">
          <div className="coin-card-label">가격</div>
          <div
            className="coin-card-value"
            style={{
              color:
                priceAnimation === 'up'
                  ? COLORS.RISE
                  : priceAnimation === 'down'
                  ? COLORS.FALL
                  : '#212529',
              transition: `color ${ANIMATION_DURATION.TRANSITION}ms ease`,
              fontWeight: 600,
            }}
          >
            {formatPrice(krCoin.krwprice)}원
          </div>
        </div>
        {binancePrice && (
          <div className="coin-card-row">
            <div className="coin-card-label">USDT</div>
            <div className="coin-card-value-small">{binancePrice}</div>
          </div>
        )}

        <div className="coin-card-row">
          <div className="coin-card-label">김치프리미엄</div>
          <div className={`coin-card-value ${isPositive ? 'green' : 'red'}`}>
            {percentage}
          </div>
        </div>
        {usPrice !== 0 && (
          <div className="coin-card-row">
            <div className="coin-card-label">차이</div>
            <div className="coin-card-value-small">{formatPrice(difference)}원</div>
          </div>
        )}

        <div className="coin-card-row">
          <div className="coin-card-label">변동액</div>
          <div className={`coin-card-value ${krCoin.change === 'RISE' ? 'rise' : krCoin.change === 'FALL' ? 'fall' : ''}`}>
            {krCoin.change === 'RISE' ? '+' : krCoin.change === 'FALL' ? '-' : ''}
            {changeDisplayValue(krCoin.absValue, false)}
          </div>
        </div>

        <div className="coin-card-row">
          <div className="coin-card-label">변화율</div>
          <div className={`coin-card-value ${krCoin.change === 'RISE' ? 'rise' : krCoin.change === 'FALL' ? 'fall' : ''}`}>
            {krCoin.change === 'RISE' ? '+' : krCoin.change === 'FALL' ? '-' : ''}
            {changeDisplayValue(krCoin.changePercent, true)}
          </div>
        </div>
      </div>

      {isChartExpanded && (
        <div className="coin-card-chart">
          <CoinChart market={coin.market_KRW} unit="1일" />
        </div>
      )}
    </div>
  );
});

export default CoinCard;
