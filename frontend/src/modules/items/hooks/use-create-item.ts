import { useCallback, useState } from 'react';
import { itemsCreationService } from '../services/items-creation.service';
import type { ItemFormData } from '../types/create-item.types';

export const useCreateItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createItem = useCallback(
    async (formData: ItemFormData, images: File[]) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        if (images.length === 0) {
          throw new Error('Please select at least one image');
        }

        if (images.length > 5) {
          throw new Error('Maximum 5 images allowed');
        }

        const payload = {
          ...formData,
          images,
        };

        await itemsCreationService.createItem(payload);

        setSuccess(true);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetForm = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    createItem,
    resetForm,
  };
};
