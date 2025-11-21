import React, { useEffect, useState } from 'react';
import { fetchExchangeRate } from '../../../api/services/exchange-rate.service';

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
    <div className="nav-bank">
      <div>
        <span style={{ marginRight: '8px' }}>💵</span>
        오늘의 달러:
      </div>
      <span>{dollar.toLocaleString()}원</span>
    </div>
  );
};

export default Header;
