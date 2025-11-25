
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }

  // 가격이 0일 때는 그대로 0 반환
  if (price === 0) {
    return '0';
  }

  // 가격 자릿수에 따라 소수점 자릿수 결정
  const absPrice = Math.abs(price);
  let formattedPrice: string;
  let decimalPlaces: number;

  if (absPrice >= 100 && absPrice < 1000) {
    // 3자리 (100-999): 소수점 1자리
    decimalPlaces = 1;
    formattedPrice = price.toFixed(decimalPlaces);
  } else if (absPrice >= 10 && absPrice < 100) {
    // 2자리 (10-99): 소수점 2자리
    decimalPlaces = 2;
    formattedPrice = price.toFixed(decimalPlaces);
  } else if (absPrice >= 1 && absPrice < 10) {
    // 1자리 (1-9): 소수점 3자리
    decimalPlaces = 3;
    formattedPrice = price.toFixed(decimalPlaces);
  } else if (absPrice >= 0.1 && absPrice < 1) {
    // 0.1원 이상 1원 미만: 소수점 4자리
    decimalPlaces = 4;
    formattedPrice = price.toFixed(decimalPlaces);
  } else if (absPrice >= 0.01 && absPrice < 0.1) {
    // 0.01원 이상 0.1원 미만: 소수점 5자리
    decimalPlaces = 5;
    formattedPrice = price.toFixed(decimalPlaces);
  } else if (absPrice > 0 && absPrice < 0.01) {
    // 0.01원 미만: 소수점 6자리
    decimalPlaces = 6;
    formattedPrice = price.toFixed(decimalPlaces);
  } else {
    // 1000 이상인 경우: 기존 로직 유지 (정수로 표시)
    const flooredPrice = Math.floor(price);
    return flooredPrice.toLocaleString('ko-KR');
  }

  const parts = formattedPrice.split('.');
  const integerPart = parseFloat(parts[0]);
  parts[0] = integerPart.toLocaleString('ko-KR');
  
  return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
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
