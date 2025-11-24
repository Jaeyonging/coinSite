import React from 'react';
import SearchBar from '../components/SearchBar';
import CoinTable from '../components/CoinTable';
import { useCoinList } from '../hooks/useCoinList';

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

  if (!fetchFinished) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          fontSize: isMobile ? '14px' : '16px',
          color: '#6c757d',
          padding: isMobile ? '30px 16px' : '40px 20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? '28px' : '32px', marginBottom: isMobile ? '12px' : '16px' }}>⏳</div>
          <div style={{ fontWeight: 500, fontSize: isMobile ? '14px' : '16px' }}>데이터를 불러오는 중...</div>
          <div style={{ fontSize: isMobile ? '12px' : '14px', marginTop: '8px', color: '#6c757d' }}>
            11월 24일 이후로 변경되었습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div
          style={{
            color: '#dc3545',
            padding: typeof window !== 'undefined' && window.innerWidth <= 480 ? '10px 12px' : '12px 16px',
            margin: '0 0 16px 0',
            background: '#f8d7da',
            borderRadius: '6px',
            border: '1px solid #f5c2c7',
            fontWeight: 500,
            fontSize: typeof window !== 'undefined' && window.innerWidth <= 480 ? '12px' : '14px',
            wordBreak: 'keep-all',
          }}
        >
          {error}
        </div>
      )}
      <div
        className="App"
        style={{
          marginTop: '0',
          wordBreak: 'keep-all',
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'auto',
          position: 'relative',
          zIndex: 0,
        }}
      >
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
        />
      </div>
    </>
  );
};

export default CoinListPage;
