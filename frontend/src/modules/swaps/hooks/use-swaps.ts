import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getApiErrorMessage } from '../../../common/api/error-message';
import { fetchMySwaps, updateSwapStatus } from '../services/swaps.service';
import type { Swap } from '../types/swap.types';

export const useSwaps = () => {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id;

  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSwaps = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchMySwaps();
      setSwaps(data);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to load swaps'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSwaps();
  }, [loadSwaps]);

  const handleUpdateStatus = useCallback(
    async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
      try {
        setError(null);
        await updateSwapStatus(id, status);
        const fresh = await fetchMySwaps();
        setSwaps(fresh);
      } catch (error) {
        setError(getApiErrorMessage(error, 'Failed to update swap'));
      }
    },
    [],
  );

  const incoming = useMemo(
    () => swaps.filter((swap) => swap.ownerId === userId),
    [swaps, userId],
  );

  const outgoing = useMemo(
    () => swaps.filter((swap) => swap.requesterId === userId),
    [swaps, userId],
  );

  return {
    loading,
    error,
    incoming,
    outgoing,
    updateStatus: handleUpdateStatus,
  };
};
