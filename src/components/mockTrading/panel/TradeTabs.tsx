import React from 'react';

interface TradeTabsProps {
  activeTab: 'buy' | 'sell';
  onChange: (tab: 'buy' | 'sell') => void;
}

const TradeTabs = ({ activeTab, onChange }: TradeTabsProps) => {
  return (
    <div className="mb-5 flex gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-1 dark:border-slate-700 dark:bg-slate-900/70">
      {(['buy', 'sell'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 rounded-xl py-3 text-xs font-semibold transition-all duration-200 md:py-3.5 md:text-base ${
            activeTab === tab
              ? tab === 'buy'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-red-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {tab === 'buy' ? '매수' : '매도'}
        </button>
      ))}
    </div>
  );
};

export default TradeTabs;
