
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }

  const flooredPrice = Math.floor(price);
  return flooredPrice.toLocaleString('ko-KR');
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

export const formatCompactNumber = (num: number, maximumFractionDigits: number = 1): string => {
  return new Intl.NumberFormat('ko-KR', {
    notation: 'compact',
    maximumFractionDigits,
  }).format(num);
};

export const formatTradeVolume = (volume: number | null | undefined): string => {
  if (volume === null || volume === undefined || isNaN(volume) || volume === 0) {
    return '0억원';
  }

  const eok = volume / 100000000;

  return eok.toFixed(1) + '억원';
};
