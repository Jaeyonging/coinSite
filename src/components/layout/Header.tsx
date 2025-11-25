import React, { useEffect, useState } from 'react';
import { fetchExchangeRate } from '../../api/services/exchange-rate.service';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [dollar, setTodayDollar] = useState<number>(0);

  useEffect(() => {
    fetchExchangeRate()
      .then((rate) => {
        setTodayDollar(rate);
      })
      .catch((error) => {
        setTodayDollar(1389.0);
        console.error("Error fetching today's dollar:", error);
      });
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto mb-8 rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-4 shadow-md backdrop-blur md:px-4 md:py-3.5 md:mb-5 sm:px-3 sm:py-3 sm:mb-4 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex flex-col gap-3 sm:gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1 text-slate-600 md:text-left sm:text-center dark:text-slate-300">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            오늘의 달러
          </div>
          <div className="text-2xl font-bold text-slate-900 md:text-[22px] dark:text-white">
            {dollar.toLocaleString()}원
          </div>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
