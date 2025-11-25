import { Position } from '../types/mockTrading.types';
import { KrwCoinPrice } from '../types/coin.types';

export const TRADE_AMOUNT_PRECISION = 100000000;

type PriceMap = { [key: string]: KrwCoinPrice };

export const roundTradeAmount = (amount: number) => {
  return Math.round(amount * TRADE_AMOUNT_PRECISION) / TRADE_AMOUNT_PRECISION;
};

export const calculatePositionValue = (
  position: Position,
  krwPrices: PriceMap
) => {
  const coin = krwPrices[position.market];
  if (!coin) return 0;
  return coin.krwprice * position.amount;
};

export const calculateTotalInvestmentValue = (
  positions: Position[],
  krwPrices: PriceMap
) => {
  return positions.reduce((total, position) => {
    return total + calculatePositionValue(position, krwPrices);
  }, 0);
};

export const calculateTotalProfitLoss = (
  positions: Position[],
  krwPrices: PriceMap
) => {
  return positions.reduce((total, position) => {
    const coin = krwPrices[position.market];
    if (!coin) return total;
    const profitLoss = (coin.krwprice - position.avgPrice) * position.amount;
    return total + profitLoss;
  }, 0);
};

export const calculateTotalAssets = (
  positions: Position[],
  krwPrices: PriceMap,
  balance: number
) => {
  const totalInvestment = calculateTotalInvestmentValue(positions, krwPrices);
  return balance + totalInvestment;
};

export const calculateReturnPercent = (
  totalInvestment: number,
  totalProfitLoss: number
) => {
  if (totalInvestment <= 0) return 0;
  return (totalProfitLoss / totalInvestment) * 100;
};

export const getMockTradingSummary = (
  positions: Position[],
  krwPrices: PriceMap,
  balance: number
) => {
  const totalInvestment = calculateTotalInvestmentValue(positions, krwPrices);
  const totalAssets = balance + totalInvestment;
  const totalProfitLoss = calculateTotalProfitLoss(positions, krwPrices);
  const totalReturnPercent = calculateReturnPercent(totalInvestment, totalProfitLoss);

  return {
    totalAssets,
    totalInvestment,
    totalProfitLoss,
    totalReturnPercent,
  };
};

export const getPositionByMarket = (positions: Position[], market: string) =>
  positions.find((position) => position.market === market);

export const getMaxBuyableAmount = (balance: number, price: number) => {
  if (price <= 0) return 0;
  return balance / price;
};

export const applyBuyToPositions = (
  positions: Position[],
  market: string,
  amount: number,
  price: number,
  currentDate: string
) => {
  const roundedAmount = roundTradeAmount(amount);
  const nextPositions = [...positions];
  const existingIndex = nextPositions.findIndex((p) => p.market === market);
  const tradeCost = roundedAmount * price;

  if (existingIndex >= 0) {
    const existingPosition = nextPositions[existingIndex];
    const totalAmount = existingPosition.amount + roundedAmount;
    const totalCostExisting = existingPosition.avgPrice * existingPosition.amount;
    const totalCostNew = roundedAmount * price;
    const newAvgPrice = (totalCostExisting + totalCostNew) / totalAmount;

    nextPositions[existingIndex] = {
      market,
      amount: totalAmount,
      avgPrice: newAvgPrice,
      purchaseDate: existingPosition.purchaseDate || currentDate,
    };
  } else {
    nextPositions.push({
      market,
      amount: roundedAmount,
      avgPrice: price,
      purchaseDate: currentDate,
    });
  }

  return {
    positions: nextPositions,
    tradeCost,
    roundedAmount,
  };
};

export const applySellToPositions = (
  positions: Position[],
  market: string,
  amount: number
) => {
  const roundedAmount = roundTradeAmount(amount);
  const updatedPositions = positions
    .map((position) => {
      if (position.market !== market) return position;
      const newAmount = position.amount - roundedAmount;
      if (newAmount <= 0.00000001) {
        return null;
      }
      return { ...position, amount: newAmount };
    })
    .filter((position): position is Position => position !== null);

  return {
    positions: updatedPositions,
    roundedAmount,
  };
};

export const calculateProfitLossForPosition = (
  position: Position | undefined,
  currentPrice: number
) => {
  if (!position) {
    return {
      profitLoss: 0,
      profitLossPercent: 0,
    };
  }

  const profitLoss = (currentPrice - position.avgPrice) * position.amount;
  const profitLossPercent =
    position.avgPrice > 0
      ? ((currentPrice - position.avgPrice) / position.avgPrice) * 100
      : 0;

  return {
    profitLoss,
    profitLossPercent,
  };
};

export const calculateSellProfit = (
  position: Position,
  currentPrice: number,
  sellAmount: number
) => {
  const roundedAmount = roundTradeAmount(sellAmount);
  const totalRevenue = roundedAmount * currentPrice;
  const profit = (currentPrice - position.avgPrice) * roundedAmount;
  return {
    roundedAmount,
    totalRevenue,
    profit,
  };
};
