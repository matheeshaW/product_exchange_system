import api from '../../../common/api/axios.instance';
import type { ApiResponse } from '../../../common/api/api.types';
import type { Swap, SwapContact, SwapStatus } from '../types/swap.types';

export const fetchMySwaps = async () => {
  const res = await api.get<ApiResponse<Swap[]>>('/swaps');
  return res.data.data;
};

export const updateSwapStatus = async (
  swapId: string,
  status: Extract<SwapStatus, 'ACCEPTED' | 'REJECTED'>,
) => {
  await api.patch(`/swaps/${swapId}`, { status });
};

export const fetchSwapContact = async (swapId: string) => {
  const res = await api.get<ApiResponse<SwapContact>>(`/swaps/${swapId}/contact`);
  return res.data.data;
};
