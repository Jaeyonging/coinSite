import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { UpbitCoin } from '../types/coin.types';
import { KrwCoinPrice } from '../types/coin.types';
import { formatPrice } from '../utils/formatters';
import TradingViewChart from './chart/TradingViewChart';
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
  usPrice: number;
}

const MockTradingPanel: React.FC<MockTradingPanelProps> = ({
  isOpen,
  onClose,
  coin,
  krCoin,
  market,
  usPrice,
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
      <div
        className={`fixed inset-0 z-[9998] bg-black/60 transition-opacity duration-300 ease-in-out dark:bg-black/70 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] flex max-h-[90vh] flex-col rounded-t-[28px] border border-slate-200/60 bg-white/95 shadow-[0_-25px_70px_rgba(15,23,42,0.45)] backdrop-blur transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] dark:border-slate-800 dark:bg-slate-950 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4 md:p-5 dark:border-slate-800">
          <div>
            <div className="mb-1 text-xs font-bold text-slate-900 md:text-xl dark:text-white">
              {coin.korean_name}
            </div>
            <div className="text-xs text-slate-500 md:text-base dark:text-slate-400">
              {formatPrice(currentPrice)}원
            </div>
          </div>
          <IoMdClose
            onClick={onClose}
            className="cursor-pointer text-xl text-slate-400 transition-colors duration-200 ease-in-out hover:text-slate-900 md:text-[28px] dark:text-slate-500 dark:hover:text-white"
          />
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/60 p-4 md:p-5 dark:bg-slate-900/20">
          <PanelBalanceSummary
            balance={balance}
            currentPosition={currentPosition}
            profitLoss={profitLoss}
            profitLossPercent={profitLossPercent}
          />

          {coin && (
            <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm dark:border-slate-800">
              <TradingViewChart market={coin.market_KRW} usPrice={usPrice} />
            </div>
          )}

          <TradeTabs activeTab={activeTab} onChange={setActiveTab} />

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
