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
    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200 sm:p-4 sm:mb-6">
      <AssetSummary
        totalAssets={totalAssets}
        balance={balance}
        totalInvestment={totalInvestment}
        totalProfitLoss={totalProfitLoss}
        totalReturnPercent={totalReturnPercent}
        onDepositClick={() => setIsDepositModalOpen(true)}
        onResetClick={() => setIsResetModalOpen(true)}
        isMobile={isMobile}
      />

      <div>
        <h2 className="text-sm md:text-xl font-bold mb-4 md:mb-5 text-gray-900 flex items-center gap-2">
          <MdBarChart className="w-5 h-5 md:w-6 md:h-6" />
          투자종목
        </h2>
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
