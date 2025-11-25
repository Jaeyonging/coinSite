import React, { useState } from 'react';
import SearchBar from '../components/coinList/SearchBar';
import CoinTable from '../components/coinTable';
import MockTradingPanel from '../components/MockTradingPanel';
import MockTradingDashboard from '../components/MockTradingDashboard';
import { useCoinList } from '../hooks/useCoinList';
import { useIsMobile } from '../hooks/useMediaQuery';

const CoinListPage = () => {
  const {
    todayDollar,
    fetchFinished,
    sortConfig,
    searchTerm,
    setSearchTerm,
    isRendered,
    error,
    expandedCharts,
    priceAnimations,
    filteredCoins,
    upbitCoinState,
    coinKrwPriceState,
    coinUSPriceState,
    isFavorite,
    toggleFavorite,
    handleSort,
    handleChartToggle,
  } = useCoinList();

  const [selectedCoin, setSelectedCoin] = useState<{
    market: string;
    coin: any;
    krCoin: any;
  } | null>(null);
  const [isMockTradingOpen, setIsMockTradingOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleCoinClick = (market: string) => {
    const coin = upbitCoinState[market];
    const krCoin = coinKrwPriceState.coins[market];
    if (coin && krCoin) {
      setSelectedCoin({ market, coin, krCoin });
      setIsMockTradingOpen(true);
    }
  };

  const handleCloseMockTrading = () => {
    setIsMockTradingOpen(false);
    setSelectedCoin(null);
  };

  if (!fetchFinished) {
    return (
      <div className={`flex justify-center items-center min-h-[50vh] ${isMobile ? 'text-sm py-[30px] px-4' : 'text-base py-10 px-5'} text-gray-500`}>
        <div className="text-center">
          <div className={`${isMobile ? 'text-[28px] mb-3' : 'text-[32px] mb-4'}`}>⏳</div>
          <div className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>데이터를 불러오는 중...</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2 text-gray-500`}>
            11월 24일 이후로 변경되었습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className={`text-fall ${isMobile ? 'py-2.5 px-3 text-xs' : 'py-3 px-4 text-sm'} mb-4 bg-red-100 rounded-md border border-red-200 font-medium break-keep`}>
          {error}
        </div>
      )}
      <div className="mt-0 break-keep w-full max-w-screen overflow-x-hidden sm:overflow-x-hidden md:overflow-x-auto relative z-0">
        <MockTradingDashboard
          upbitCoins={upbitCoinState}
          krwPrices={coinKrwPriceState.coins}
          onCoinClick={handleCoinClick}
        />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CoinTable
          markets={filteredCoins}
          upbitCoins={upbitCoinState}
          krwPrices={coinKrwPriceState.coins}
          usPrices={coinUSPriceState}
          todayDollar={todayDollar}
          priceAnimations={priceAnimations}
          expandedCharts={expandedCharts}
          sortConfig={sortConfig}
          isRendered={isRendered}
          isFavorite={isFavorite}
          onSort={handleSort}
          onChartToggle={handleChartToggle}
          onFavoriteToggle={toggleFavorite}
          onCoinClick={handleCoinClick}
        />
      </div>
      <MockTradingPanel
        isOpen={isMockTradingOpen}
        onClose={handleCloseMockTrading}
        coin={selectedCoin?.coin || null}
        krCoin={selectedCoin?.krCoin || null}
        market={selectedCoin?.market || ''}
      />
    </>
  );
};

export default CoinListPage;
