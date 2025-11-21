import axios from 'axios';

const EXCHANGE_RATE_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQF1KDUxPDqapqgXa3qyOoyWQ7ndB8hvi4Ct0FKxGXW0wofPOLbLyqWuQeGRkvvEjhwTuwmmQ7hyM9m/pub?gid=0&single=true&output=csv';

/**
 * USD/KRW 환율 조회 (Google Sheets)
 */
export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await axios.get(EXCHANGE_RATE_URL);
    return parseFloat(response.data) || 1389; // 기본값
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 1389; // 기본값 반환
  }
};
