
export const formatPrice = (price: number): string => {
  if (price > 1000) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else if (price > 100) {
    return price.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else if (price < 1) {
    const formattedPrice = parseFloat(price.toFixed(5)).toString();
    return formattedPrice;
  } else {
    return price.toFixed(2);
  }
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
