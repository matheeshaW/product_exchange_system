import api from '../../../common/api/axios.instance';
import type { ApiResponse } from '../../../common/api/api.types';
import type {
  ChangePasswordPayload,
  DeleteAccountPayload,
  ProfileData,
  UpdateProfilePayload,
} from '../types/user.types';

export const fetchMyProfile = async () => {
  const res = await api.get<ApiResponse<ProfileData>>('/users/me');
  return res.data.data;
};

export const updateMyProfile = async (payload: UpdateProfilePayload) => {
  const res = await api.patch<ApiResponse<ProfileData>>('/users/me', payload);
  return res.data.data;
};

export const changeMyPassword = async (payload: ChangePasswordPayload) => {
  await api.patch('/users/me/password', payload);
};

export const deleteMyAccount = async (payload: DeleteAccountPayload) => {
  await api.delete('/users/me', {
    data: payload,
  });
};
