import { useCallback, useState } from 'react';
import { fetchSwapContact } from '../services/swaps.service';
import type { SwapContact } from '../types/swap.types';

export const useSwapContact = () => {
  const [contact, setContact] = useState<SwapContact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContact = useCallback(async (swapId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSwapContact(swapId);
      setContact(data);
    } catch {
      setError('Failed to fetch swap contact');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contact,
    loading,
    error,
    loadContact,
  };
};
