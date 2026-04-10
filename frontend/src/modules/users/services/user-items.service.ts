import api from '../../../common/api/axios.instance';
import type { ApiResponse } from '../../../common/api/api.types';
import type { MyItem, UpdateMyItemPayload } from '../types/user-items.types';

export const fetchMyItems = async () => {
  const res = await api.get<ApiResponse<MyItem[]>>('/items/my?includeSwapped=true');
  return res.data.data;
};

export const updateMyItem = async (itemId: string, payload: UpdateMyItemPayload) => {
  const res = await api.patch<ApiResponse<MyItem>>(`/items/${itemId}`, payload);
  return res.data.data;
};

export const deleteMyItem = async (itemId: string) => {
  await api.delete(`/items/${itemId}`);
};
