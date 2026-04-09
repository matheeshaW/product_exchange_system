import { useCallback, useState } from 'react';
import { fetchSwapContact } from '../services/swaps.service';
import type { SwapContact } from '../types/swap.types';

export const useSwapContact = () => {
  const [contactsBySwapId, setContactsBySwapId] = useState<Record<string, SwapContact>>({});
  const [loadingSwapId, setLoadingSwapId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadContact = useCallback(async (swapId: string) => {
    if (contactsBySwapId[swapId]) {
      return;
    }

    try {
      setLoadingSwapId(swapId);
      setError(null);
      const data = await fetchSwapContact(swapId);
      setContactsBySwapId((prev) => ({
        ...prev,
        [swapId]: data,
      }));
    } catch {
      setError('Failed to fetch swap contact');
    } finally {
      setLoadingSwapId(null);
    }
  }, [contactsBySwapId]);

  return {
    contactsBySwapId,
    loadingSwapId,
    error,
    loadContact,
  };
};
