import React, { useEffect, useState } from 'react';
import { fetchExchangeRate } from '../../api/services/exchange-rate.service';

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
    <div className="w-full max-w-[1400px] mx-auto mb-8 px-6 py-4 bg-white rounded-lg shadow-sm flex flex-row items-center justify-between border border-gray-200 md:px-4 md:py-3.5 md:gap-3 md:text-left md:mb-5 sm:px-3 sm:py-3 sm:flex-col sm:gap-2 sm:text-center sm:mb-4">
      <div className="text-[15px] font-medium text-gray-600 flex items-center gap-2 md:text-[13px] md:flex-wrap sm:text-xs sm:justify-center">
        <span>💵</span>
        오늘의 달러:
      </div>
      <span className="text-xl font-bold text-gray-900 md:text-[17px] md:break-keep sm:text-[15px]">{dollar.toLocaleString()}원</span>
    </div>
  );
};

export default Header;
