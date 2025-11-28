import { useState, useCallback } from 'react';
import { validateUserExists } from '@/services/tracking.service';
import type { UserValidationResult } from '@/types';

interface UseUserIdState {
  userId: string;
  isValidating: boolean;
  error: string | null;
}

interface UseUserIdReturn extends UseUserIdState {
  setUserId: (id: string) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Custom hook untuk mengelola user ID selection dan validation
 */
export function useUserId(initialUserId: string = ''): UseUserIdReturn {
  const [state, setState] = useState<UseUserIdState>({
    userId: initialUserId,
    isValidating: false,
    error: null,
  });

  const setUserId = useCallback(async (id: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isValidating: true, error: null }));

    try {
      const result = await validateUserExists(id);

      if (result.isValid) {
        setState({ userId: result.userId, isValidating: false, error: null });
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isValidating: false,
          error: result.error || 'User Not Found',
        }));
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setState((prev) => ({ ...prev, isValidating: false, error: errorMsg }));
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      userId: '',
      isValidating: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    setUserId,
    clearError,
    reset,
  };
}
