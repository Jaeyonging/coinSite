import React from 'react';

interface TradeTabsProps {
  activeTab: 'buy' | 'sell';
  onChange: (tab: 'buy' | 'sell') => void;
}

const TradeTabs = ({ activeTab, onChange }: TradeTabsProps) => {
  return (
    <div className="flex gap-2 mb-5">
      <button
        onClick={() => onChange('buy')}
        className={`flex-1 py-3 text-xs md:py-3.5 md:text-base font-semibold border-none rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
          activeTab === 'buy' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900'
        }`}
      >
        매수
      </button>
      <button
        onClick={() => onChange('sell')}
        className={`flex-1 py-3 text-xs md:py-3.5 md:text-base font-semibold border-none rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
          activeTab === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-900'
        }`}
      >
        매도
      </button>
    </div>
  );
};

export default TradeTabs;
