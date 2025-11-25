import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { UpbitCoin } from '../types/coin.types';
import { KrwCoinPrice } from '../types/coin.types';
import { formatPrice } from '../utils/formatters';
import CoinChart from './chart/CoinChart';
import { useMockTradingState } from '../hooks/mockTrading/useMockTradingState';
import {
  applyBuyToPositions,
  applySellToPositions,
  calculateProfitLossForPosition,
  calculateSellProfit,
  getMaxBuyableAmount,
  getPositionByMarket,
  roundTradeAmount,
} from '../utils/mockTrading';
import PanelBalanceSummary from './mockTrading/panel/PanelBalanceSummary';
import TradeTabs from './mockTrading/panel/TradeTabs';
import BuyTradeForm from './mockTrading/panel/BuyTradeForm';
import SellTradeForm from './mockTrading/panel/SellTradeForm';

interface MockTradingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  coin: UpbitCoin | null;
  krCoin: KrwCoinPrice | null;
  market: string;
}

const MockTradingPanel: React.FC<MockTradingPanelProps> = ({
  isOpen,
  onClose,
  coin,
  krCoin,
  market,
}) => {
  const { balance, positions, updateState } = useMockTradingState();
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [sellAmount, setSellAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  if (!isOpen || !coin || !krCoin) return null;

  const currentPrice = krCoin.krwprice;
  const currentPosition = getPositionByMarket(positions, market);
  const availableBalance = balance;
  const maxBuyable = getMaxBuyableAmount(availableBalance, currentPrice);

  const handleBuy = () => {
    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('올바른 수량을 입력해주세요.');
      return;
    }

    const roundedAmount = roundTradeAmount(amount);
    const totalCost = roundedAmount * currentPrice;
    
    if (totalCost > availableBalance) {
      alert('잔액이 부족합니다.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    
    updateState((prev) => {
      const result = applyBuyToPositions(prev.positions, market, roundedAmount, currentPrice, currentDate);
      return {
        balance: prev.balance - totalCost,
        positions: result.positions,
      };
    });

    setBuyAmount('');
    alert(`매수 완료: ${roundedAmount}개 (${formatPrice(totalCost)}원)`);
  };

  const handleSell = () => {
    const amount = parseFloat(sellAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('올바른 수량을 입력해주세요.');
      return;
    }

    if (!currentPosition) {
      alert('보유 수량이 부족합니다.');
      return;
    }

    const { roundedAmount, totalRevenue, profit } = calculateSellProfit(
      currentPosition,
      currentPrice,
      amount
    );

    if (currentPosition.amount < roundedAmount) {
      alert('보유 수량이 부족합니다.');
      return;
    }

    updateState((prev) => {
      const result = applySellToPositions(prev.positions, market, roundedAmount);
      return {
        balance: prev.balance + totalRevenue,
        positions: result.positions,
      };
    });
    setSellAmount('');
    
    const profitText = profit >= 0 
      ? `+${formatPrice(profit)}원 (수익)`
      : `${formatPrice(profit)}원 (손실)`;
    alert(`매도 완료: ${roundedAmount}개 (${formatPrice(totalRevenue)}원)\n${profitText}`);
  };

  const handleMaxBuy = () => {
    setBuyAmount(maxBuyable.toFixed(8));
  };

  const handleMaxSell = () => {
    if (currentPosition) {
      setSellAmount(currentPosition.amount.toFixed(8));
    }
  };

  const { profitLoss, profitLossPercent } = calculateProfitLossForPosition(
    currentPosition,
    currentPrice
  );

  return (
    <>
      {}
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-opacity duration-300 ease-in-out`}
        onClick={onClose}
      />
      
      {}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-[9999] ${isOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] max-h-[90vh] flex flex-col`}
      >
        {}
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <div className="text-xs md:text-xl font-bold mb-1">
              {coin.korean_name}
            </div>
            <div className="text-xs md:text-base text-gray-500">
              {formatPrice(currentPrice)}원
            </div>
          </div>
          <IoMdClose
            onClick={onClose}
            className="text-xl md:text-[28px] cursor-pointer text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-900"
          />
        </div>

        {}
        <div className="overflow-y-auto flex-1 p-4 md:p-5">
          <PanelBalanceSummary
            balance={balance}
            currentPosition={currentPosition}
            profitLoss={profitLoss}
            profitLossPercent={profitLossPercent}
          />

          {}
          {coin && (
            <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
              <CoinChart
                market={coin.market_KRW}
                unit="1분"
                position={currentPosition || null}
              />
            </div>
          )}

          <TradeTabs activeTab={activeTab} onChange={setActiveTab} />

          {}
          {activeTab === 'buy' && (
            <BuyTradeForm
              buyAmount={buyAmount}
              onBuyAmountChange={setBuyAmount}
              onMaxBuy={handleMaxBuy}
              maxBuyable={maxBuyable}
              currentPrice={currentPrice}
              onSubmit={handleBuy}
            />
          )}

          {activeTab === 'sell' && (
            <SellTradeForm
              sellAmount={sellAmount}
              onSellAmountChange={setSellAmount}
              onMaxSell={handleMaxSell}
              currentPosition={currentPosition}
              currentPrice={currentPrice}
              onSubmit={handleSell}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MockTradingPanel;
