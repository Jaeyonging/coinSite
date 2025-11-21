import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';

/**
 * 타입 안전한 dispatch 훅
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
