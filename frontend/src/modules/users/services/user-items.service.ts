import api from '../../../common/api/axios.instance';
import type { ApiResponse } from '../../../common/api/api.types';
import type { MyItem, UpdateMyItemPayload } from '../types/user-items.types';

export const fetchMyItems = async () => {
  const res = await api.get<ApiResponse<MyItem[]>>('/items/my?includeSwapped=true');
  return res.data.data;
};

export const updateMyItem = async (itemId: string, payload: UpdateMyItemPayload) => {
  const formData = new FormData();

  if (payload.title !== undefined) formData.append('title', payload.title);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.category !== undefined) formData.append('category', payload.category);
  if (payload.condition !== undefined) formData.append('condition', payload.condition);

  formData.append('keepImageUrls', JSON.stringify(payload.keepImageUrls || []));

  (payload.newImages || []).forEach((file) => {
    formData.append('images', file);
  });

  const res = await api.patch<ApiResponse<MyItem>>(`/items/${itemId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};

export const deleteMyItem = async (itemId: string) => {
  await api.delete(`/items/${itemId}`);
};
