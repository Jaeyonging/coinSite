import React, { useState } from 'react';
import { MdBarChart } from 'react-icons/md';
import { UpbitCoin } from '../types/coin.types';
import { KrwCoinPrice } from '../types/coin.types';
import { formatPrice } from '../utils/formatters';
import AssetSummary from './mockTrading/AssetSummary';
import PositionsTable from './mockTrading/PositionsTable';
import DepositModal from './mockTrading/DepositModal';
import ResetModal from './mockTrading/ResetModal';
import { useMockTradingState } from '../hooks/mockTrading/useMockTradingState';
import { useIsMobile } from '../hooks/useMediaQuery';
import { getMockTradingSummary } from '../utils/mockTrading';

interface MockTradingDashboardProps {
  upbitCoins: { [key: string]: UpbitCoin };
  krwPrices: { [key: string]: KrwCoinPrice };
  onCoinClick: (market: string) => void;
}

const MockTradingDashboard = ({
  upbitCoins,
  krwPrices,
  onCoinClick,
}: MockTradingDashboardProps) => {
  const { balance, positions, setBalance, updateState } = useMockTradingState();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const isMobile = useIsMobile();

  const {
    totalAssets,
    totalInvestment,
    totalProfitLoss,
    totalReturnPercent,
  } = getMockTradingSummary(positions, krwPrices, balance);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount.replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) {
      alert('올바른 금액을 입력해주세요.');
      return;
    }

    const newBalance = balance + amount;
    setBalance(newBalance);
    setDepositAmount('');
    setIsDepositModalOpen(false);
    alert(`${formatPrice(amount)}원이 입금되었습니다.`);
  };

  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      const numValue = parseFloat(value);
      setDepositAmount(numValue.toLocaleString());
    } else {
      setDepositAmount('');
    }
  };

  const handleReset = () => {
    updateState(() => ({
      balance: 10000000,
      positions: [],
    }));
    setIsResetModalOpen(false);
    alert('모의투자가 초기화되었습니다. 페이지를 새로고침합니다.');
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg backdrop-blur sm:mb-6 sm:p-4 dark:border-slate-800 dark:bg-slate-900/70">
      <AssetSummary
        totalAssets={totalAssets}
        balance={balance}
        totalInvestment={totalInvestment}
        totalProfitLoss={totalProfitLoss}
        totalReturnPercent={totalReturnPercent}
        onDepositClick={() => setIsDepositModalOpen(true)}
        onResetClick={() => setIsResetModalOpen(true)}
      />

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 md:mb-5 mt-[10px]">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 md:text-xl dark:text-white">
            <MdBarChart className="h-5 w-5 md:h-6 md:w-6" />
            투자종목
          </h2>
          <div className="rounded-full border border-slate-200/70 px-3 py-1 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-300">
            {positions.length > 0 ? `${positions.length}개 보유 중` : '포지션 없음'}
          </div>
        </div>
        <PositionsTable
          positions={positions}
          upbitCoins={upbitCoins}
          krwPrices={krwPrices}
          onCoinClick={onCoinClick}
          isMobile={isMobile}
        />
      </div>

      <DepositModal
        isOpen={isDepositModalOpen}
        depositAmount={depositAmount}
        balance={balance}
        onClose={() => {
          setIsDepositModalOpen(false);
          setDepositAmount('');
        }}
        onDepositAmountChange={handleDepositAmountChange}
        onDeposit={handleDeposit}
        isMobile={isMobile}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onReset={handleReset}
        isMobile={isMobile}
      />
    </div>
  );
};

export default MockTradingDashboard;
