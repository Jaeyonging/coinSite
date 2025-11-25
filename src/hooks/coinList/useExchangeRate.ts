import { useEffect, useState } from 'react';
import { fetchExchangeRate } from '../../api/services/exchange-rate.service';

const FALLBACK_RATE = 1389;

export const useExchangeRate = () => {
  const [todayDollar, setTodayDollar] = useState(0);

  useEffect(() => {
    let isMounted = true;

    fetchExchangeRate()
      .then((rate) => {
        if (isMounted) {
          setTodayDollar(rate);
        }
      })
      .catch((error) => {
        console.error("Error fetching today's dollar:", error);
        if (isMounted) {
          setTodayDollar(FALLBACK_RATE);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return todayDollar;
};
