import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../../common/api/error-message';
import { deleteMyItem, fetchMyItems, updateMyItem } from '../services/user-items.service';
import type { MyItem, UpdateMyItemPayload } from '../types/user-items.types';

export const useMyItems = () => {
  const [items, setItems] = useState<MyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchMyItems();
      setItems(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load your items'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const saveItem = useCallback(async (itemId: string, payload: UpdateMyItemPayload) => {
    try {
      setSavingId(itemId);
      const updated = await updateMyItem(itemId, payload);
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updated } : item)));
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update item'));
      return false;
    } finally {
      setSavingId(null);
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    try {
      setDeletingId(itemId);
      await deleteMyItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete item'));
      return false;
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    items,
    loading,
    error,
    savingId,
    deletingId,
    setError,
    reloadItems: loadItems,
    saveItem,
    removeItem,
  };
};
