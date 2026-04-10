import api from '../../../common/api/axios.instance';
import type { CreateItemPayload, CreateItemResponse } from '../types/create-item.types';

export const itemsCreationService = {
  async createItem(payload: CreateItemPayload): Promise<CreateItemResponse> {
    try {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      formData.append('category', payload.category);
      formData.append('condition', payload.condition);

      // Append all images with the 'images' key (matching backend interceptor name)
      payload.images.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.post<CreateItemResponse>('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to create item');
      }
      throw new Error('Failed to create item');
    }
  },
};
