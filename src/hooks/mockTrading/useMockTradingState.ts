import { useCallback, useEffect, useState } from 'react';
import { Position } from '../../types/mockTrading.types';

const BALANCE_KEY = 'mockTrading_balance';
const POSITIONS_KEY = 'mockTrading_positions';
const DEFAULT_BALANCE = 10000000;

interface MockTradingState {
  balance: number;
  positions: Position[];
}

const getStoredBalance = (): number => {
  if (typeof window === 'undefined') return DEFAULT_BALANCE;
  const savedBalance = window.localStorage.getItem(BALANCE_KEY);
  const parsed = savedBalance ? parseFloat(savedBalance) : DEFAULT_BALANCE;
  return Number.isNaN(parsed) ? DEFAULT_BALANCE : parsed;
};

const getStoredPositions = (): Position[] => {
  if (typeof window === 'undefined') return [];
  const savedPositions = window.localStorage.getItem(POSITIONS_KEY);
  if (!savedPositions) return [];
  try {
    const parsed = JSON.parse(savedPositions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const useMockTradingState = () => {
  const [state, setState] = useState<MockTradingState>({
    balance: DEFAULT_BALANCE,
    positions: [],
  });

  const persistState = useCallback((nextState: MockTradingState) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(BALANCE_KEY, nextState.balance.toString());
    window.localStorage.setItem(POSITIONS_KEY, JSON.stringify(nextState.positions));
    window.dispatchEvent(new Event('mockTradingUpdate'));
  }, []);

  const refreshFromStorage = useCallback(() => {
    setState({
      balance: getStoredBalance(),
      positions: getStoredPositions(),
    });
  }, []);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  const updateState = useCallback(
    (updater: (prev: MockTradingState) => MockTradingState) => {
      setState((prev) => {
        const next = updater(prev);
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const setBalance = useCallback(
    (balance: number) => {
      updateState((prev) => ({ ...prev, balance }));
    },
    [updateState]
  );

  const setPositions = useCallback(
    (positions: Position[]) => {
      updateState((prev) => ({ ...prev, positions }));
    },
    [updateState]
  );

  useEffect(() => {
    const handleStorageChange = () => {
      refreshFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mockTradingUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mockTradingUpdate', handleStorageChange);
    };
  }, [refreshFromStorage]);

  return {
    balance: state.balance,
    positions: state.positions,
    setBalance,
    setPositions,
    updateState,
    refreshFromStorage,
  };
};
