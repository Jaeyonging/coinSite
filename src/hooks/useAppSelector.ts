import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store/store';

/**
 * 타입 안전한 selector 훅
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
